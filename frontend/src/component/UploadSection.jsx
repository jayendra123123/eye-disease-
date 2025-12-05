import React, { useRef } from 'react';
import { Upload, Sparkles, Activity, X } from 'lucide-react';

export default function UploadSection({ 
  file, 
  preview, 
  dragActive, 
  analyzing, 
  result, 
  handleDrag, 
  handleDrop, 
  handleChange, 
  analyzeImage, 
  reset 
}) {
  const fileInputRef = useRef(null);

  return (
    <div className="space-y-8">
      <div
        className={`relative group ${dragActive ? 'scale-105' : ''} transition-all duration-500`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className={`absolute inset-0 bg-white ${dragActive ? 'opacity-20' : 'opacity-5'} transition-opacity`} />
        
        <div className={`relative border-4 ${dragActive ? 'border-white' : 'border-white/20'} hover:border-white/50 transition-all duration-300 p-16 cursor-pointer group-hover:shadow-2xl group-hover:shadow-white/20`}
          onClick={() => fileInputRef.current?.click()}>
          
          {!preview ? (
            <>
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 border-4 border-white/20 animate-ping" />
                  <div className="relative w-32 h-32 border-4 border-white flex items-center justify-center">
                    <Upload className="w-16 h-16" />
                  </div>
                </div>
              </div>
              
              <h3 className="text-3xl font-black mb-4 tracking-tight">DROP IMAGE HERE</h3>
              <p className="text-gray-400 mb-8 tracking-wide">OR CLICK TO BROWSE FILES</p>
              
              <div className="flex items-center justify-center gap-3 text-sm tracking-widest border-t border-white/20 pt-6">
                <Sparkles className="w-5 h-5" />
                <span className="text-gray-500">JPG • PNG • DICOM</span>
              </div>
            </>
          ) : (
            <div className="relative group/preview">
              <div className="absolute inset-0 border-4 border-white/50" />
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-80 object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  reset();
                }}
                className="absolute top-4 right-4 p-3 bg-white text-black hover:bg-black hover:text-white border-2 border-white transition-all duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
      </div>

      {file && !result && (
        <div className="space-y-4">
          <button
            onClick={() => analyzeImage(false)}
            disabled={analyzing}
            className="w-full py-6 px-8 bg-white text-black hover:bg-black hover:text-white border-4 border-white font-black text-xl tracking-widest transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-4 group"
          >
            {analyzing ? (
              <>
                <div className="w-7 h-7 border-2 border-black border-t-transparent animate-spin rounded-full" />
                ANALYZING
              </>
            ) : (
              <>
                <Activity className="w-7 h-7 group-hover:rotate-90 transition-transform duration-500" />
                START ANALYSIS
              </>
            )}
          </button>
          
          <button
            onClick={() => analyzeImage(true)}
            disabled={analyzing}
            className="w-full py-4 px-6 border-2 border-white/50 text-white hover:bg-white/10 hover:border-white font-bold text-lg tracking-widest transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
          >
            <Sparkles className="w-5 h-5" />
            ENSEMBLE MODE
          </button>
        </div>
      )}
    </div>
  );
}