import React from 'react';
import { Brain, Zap } from 'lucide-react';

export default function Header() {
  return (
    <div className="text-center mb-16 animate-fade-in">
      <div className="inline-flex items-center gap-3 mb-6 px-8 py-4 border-2 border-white/30 hover:border-white transition-all duration-300 group">
        <Brain className="w-7 h-7 group-hover:scale-110 transition-transform" />
        <span className="text-sm font-bold tracking-widest">MEDICAL AI SYSTEM</span>
        <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
      </div>
      
      <h1 className="text-8xl font-black mb-6 tracking-tighter">
        DISEASE
        <br />
        <span className="inline-block bg-white text-black px-6 py-2 transform hover:skew-x-2 transition-transform">
          DETECTION
        </span>
      </h1>
      <div className="flex items-center justify-center gap-4 text-sm tracking-widest">
        <div className="w-16 h-px bg-white" />
        <p className="text-gray-400">AI-POWERED MEDICAL ANALYSIS</p>
        <div className="w-16 h-px bg-white" />
      </div>
    </div>
  );
}