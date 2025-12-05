# DeepEye - AI Eye Disease Detection

## 🔗 How to Connect Frontend to ML Models

Your DeepEye application now has a complete connection between the React frontend and your trained ML models! Here's how it all works:

## 📁 Project Structure

```
DeepEye/
├── app.py                          # 🔥 FastAPI backend server
├── requirements.txt               # Python dependencies (updated)
├── start.bat                     # Easy startup script
├── mobileNet_model.h5/.keras    # Your trained MobileNet model
├── ResNet_model.h5/.keras       # Your trained ResNet model
└── frontend/
    ├── src/component/
    │   ├── ui.jsx               # Main component (updated)
    │   ├── Header.jsx           # Header component
    │   ├── UploadSection.jsx    # Upload component (updated)
    │   ├── ResultsSection.jsx   # Results component (updated)
    │   └── api.js               # 🔗 API service layer
    └── package.json
```

## 🚀 Quick Start

### Option 1: Use the Startup Script (Recommended)

```bash
# Double-click start.bat or run:
start.bat
```

### Option 2: Manual Setup

```bash
# 1. Install Python dependencies
pip install fastapi uvicorn python-multipart

# 2. Start the backend API
python app.py

# 3. In another terminal, start the frontend
cd frontend
npm install
npm start
```

## 🔧 Architecture Overview

### Backend API (app.py)

- **FastAPI server** running on `http://localhost:8000`
- **Loads your trained models** on startup (MobileNet & ResNet)
- **Two prediction endpoints**:
  - `/predict` - Single model prediction
  - `/predict/ensemble` - Combines both models for better accuracy
- **CORS enabled** for React frontend communication
- **Image preprocessing** (resize to 224x224, normalize)
- **Medical recommendations** based on detected conditions

### Frontend Connection (api.js)

- **DeepEyeAPI class** handles all API communication
- **File upload** via FormData to backend
- **Error handling** with graceful fallback to mock data
- **Support for both** single and ensemble predictions

### Updated Components

#### UploadSection.jsx

- **Two analysis buttons**:
  - "START ANALYSIS" - Uses single model
  - "ENSEMBLE MODE" - Uses both models for higher accuracy
- **Real-time upload** to backend API

#### ResultsSection.jsx

- **Displays actual ML predictions** from your models
- **Shows confidence scores** for all 4 conditions
- **Medical recommendations** based on detected disease
- **Model information** (which model was used)

## 🎯 Prediction Flow

1. **User uploads image** → Frontend validates file type
2. **Image sent to API** → Backend preprocesses image (224x224, RGB, normalized)
3. **ML model inference** → Your trained model analyzes the image
4. **Results processed** → Backend formats predictions with medical info
5. **Frontend displays** → User sees disease detection results

## 📊 Model Classes

Your models detect these conditions:

- ✅ **Normal** - Healthy eye
- 🔴 **Cataract** - Lens clouding
- 🔴 **Diabetic Retinopathy** - Diabetes-related damage
- 🔴 **Glaucoma** - Optic nerve damage

## 🛠 API Endpoints

### GET `/`

Health check - shows if models are loaded

### POST `/predict`

Single model prediction (uses MobileNet by default)

### POST `/predict/ensemble`

Ensemble prediction (combines MobileNet + ResNet)

## 🔒 Security Features

- **File type validation** (images only)
- **CORS configured** for frontend-backend communication
- **Error handling** with detailed error messages
- **Graceful fallbacks** if models fail to load

## 🎨 UI Features

- **Drag & drop** image upload
- **Real-time progress** during analysis
- **Animated results** with confidence bars
- **Medical recommendations** based on AI findings
- **Ensemble mode** for higher accuracy predictions

## 🧪 Testing the Connection

1. **Start both services** using `start.bat`
2. **Open** `http://localhost:3000` in browser
3. **Upload an eye image** from your test dataset
4. **Watch the analysis** happen in real-time
5. **Check browser console** for API communication logs

## 💡 Troubleshooting

- **Backend not starting?** → Check if models exist in root directory
- **Frontend API errors?** → Ensure backend is running on port 8000
- **CORS issues?** → Verify frontend runs on localhost:3000
- **Model loading fails?** → Check TensorFlow installation and model files

Your ML models are now fully connected and ready to detect eye diseases in real-time! 🎉
