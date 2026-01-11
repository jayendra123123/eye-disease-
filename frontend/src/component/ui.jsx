import React, { useState, useEffect } from 'react';
import Header from './Header';
import UploadSection from './UploadSection';
import ResultsSection from './ResultsSection';
import DeepEyeAPI from './api';

export default function DiseaseDetection() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    setFile(file);
    setResult(null);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (useEnsemble = false) => {
    if (!file) return;
    
    setAnalyzing(true);
    
    try {
      console.log('🔄 Starting image analysis...');
      console.log('📁 File:', file.name, 'Size:', file.size, 'Type:', file.type);
      console.log('🔧 Ensemble mode:', useEnsemble);
      
      const result = await DeepEyeAPI.predictDisease(file, useEnsemble);
      console.log('✅ Analysis completed:', result);
      console.log('🔍 Disease detected:', result.detected);
      console.log('🏥 Disease name:', result.disease);
      console.log('📊 Confidence:', result.confidence);
      console.log('⚠️ Severity:', result.severity);
      
      setResult(result);
      
    } catch (error) {
      console.error('❌ Error analyzing image:', error.message);
      console.error('📋 Error details:', error);
      
      // Fallback to mock data if API is not available
      console.warn('⚠️ Using mock data as fallback');
      const mockResult = DeepEyeAPI.getMockPrediction();
      setResult(mockResult);
    }
    
    setAnalyzing(false);
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Floating particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-white animate-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: 0.3,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}

      {/* Animated corner accents */}
      <div className="absolute top-0 left-0 w-64 h-64 border-l-4 border-t-4 border-white opacity-20 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-64 h-64 border-r-4 border-b-4 border-white opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Upload Section */}
          <UploadSection 
            file={file}
            preview={preview}
            dragActive={dragActive}
            analyzing={analyzing}
            result={result}
            handleDrag={handleDrag}
            handleDrop={handleDrop}
            handleChange={handleChange}
            analyzeImage={analyzeImage}
            reset={reset}
          />

          {/* Results Section */}
          <div className="space-y-8">
            <ResultsSection 
              analyzing={analyzing}
              result={result}
              reset={reset}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-xs tracking-widest text-gray-600 border-t border-white/10 pt-8">
          <p>⚠️ AI-ASSISTED TOOL • ALWAYS CONSULT HEALTHCARE PROFESSIONALS</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(10px, -10px); }
          50% { transform: translate(-5px, -20px); }
          75% { transform: translate(-10px, -10px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float {
          animation: float infinite ease-in-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}