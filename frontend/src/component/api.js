// API configuration
const API_BASE_URL = 'http://localhost:8000';

/**
 * API service for DeepEye disease detection
 */
class DeepEyeAPI {
  /**
   * Predict disease from image file
   * @param {File} imageFile - The image file to analyze
   * @param {boolean} useEnsemble - Whether to use ensemble prediction
   * @returns {Promise<Object>} Prediction result
   */
  static async predictDisease(imageFile, useEnsemble = false) {
    const formData = new FormData();
    formData.append('file', imageFile);
    
    const endpoint = useEnsemble ? '/predict/ensemble' : '/predict';
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }
  
  /**
   * Check API health status
   * @returns {Promise<Object>} Health status
   */
  static async checkHealth() {
    const response = await fetch(`${API_BASE_URL}/`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }
  
  /**
   * Get mock prediction data (fallback)
   * @returns {Object} Mock prediction result
   */
  static getMockPrediction() {
    const diseases = ["Diabetic Retinopathy", "Glaucoma", "Cataract"];
    const severities = ["Mild", "Moderate", "Severe"];
    const isDetected = Math.random() > 0.3;
    
    return {
      detected: isDetected,
      disease: isDetected ? diseases[Math.floor(Math.random() * diseases.length)] : "No Disease",
      confidence: (Math.random() * 30 + 70).toFixed(1),
      severity: isDetected ? severities[Math.floor(Math.random() * severities.length)] : "N/A",
      recommendations: [
        "⚠️ API connection failed - showing mock data",
        "Please ensure the backend server is running at http://localhost:8000",
        "Consult an ophthalmologist for actual medical diagnosis",
        "This is demonstration data only"
      ],
      model_used: "Mock Data (API Offline)",
      all_predictions: {
        "cataract": Math.random() * 100,
        "diabetic_retinopathy": Math.random() * 100,
        "glaucoma": Math.random() * 100,
        "normal": Math.random() * 100
      }
    };
  }
}

export default DeepEyeAPI;