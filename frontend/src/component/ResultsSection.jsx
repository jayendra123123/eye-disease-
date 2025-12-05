import React from 'react';
import { Brain, CheckCircle, AlertCircle, Sparkles, Upload, Activity } from 'lucide-react';

export default function ResultsSection({ analyzing, result, reset }) {
  if (analyzing) {
    return (
      <div className="border-4 border-white/20 p-12 animate-fade-in">
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="relative">
            <div className="w-40 h-40 border-4 border-white/20 border-t-white animate-spin" />
            <Brain className="w-16 h-16 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          
          <div className="text-center space-y-3">
            <h3 className="text-3xl font-black tracking-tight">AI PROCESSING</h3>
            <p className="text-gray-500 tracking-widest text-sm">ANALYZING MEDICAL PATTERNS</p>
          </div>
          
          <div className="w-full space-y-4 pt-6 border-t border-white/20">
            {["FEATURE EXTRACTION", "PATTERN RECOGNITION", "DISEASE CLASSIFICATION"].map((step, i) => (
              <div key={i} className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: `${i * 0.3}s` }}>
                <div className="w-3 h-3 bg-white animate-pulse" />
                <span className="text-sm tracking-widest font-bold">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="border-4 border-white p-10 animate-fade-in space-y-8">
        <div className="flex items-center gap-6 pb-6 border-b-2 border-white/20">
          {result.detected ? (
            <div className="p-4 border-4 border-white">
              <AlertCircle className="w-12 h-12" />
            </div>
          ) : (
            <div className="p-4 border-4 border-white">
              <CheckCircle className="w-12 h-12" />
            </div>
          )}
          
          <div>
            <h3 className="text-3xl font-black tracking-tight">
              {result.detected ? "DISEASE DETECTED" : "NO DISEASE DETECTED"}
            </h3>
            <p className="text-gray-500 tracking-widest text-sm mt-1">
              ANALYSIS COMPLETE • {result.model_used || 'AI MODEL'}
            </p>
          </div>
        </div>

        {result.detected && (
          <>
            <div className="grid grid-cols-2 gap-6">
              <div className="border-2 border-white/30 p-6 hover:border-white transition-colors">
                <div className="text-xs tracking-widest text-gray-500 mb-2">CONDITION</div>
                <div className="font-black text-xl">{result.disease}</div>
              </div>
              
              <div className="border-2 border-white/30 p-6 hover:border-white transition-colors">
                <div className="text-xs tracking-widest text-gray-500 mb-2">SEVERITY</div>
                <div className="font-black text-xl">{result.severity}</div>
              </div>
            </div>

            <div className="border-2 border-white/30 p-6 hover:border-white transition-colors">
              <div className="flex justify-between items-end mb-4">
                <span className="text-xs tracking-widest text-gray-500">CONFIDENCE LEVEL</span>
                <span className="text-4xl font-black">{result.confidence}%</span>
              </div>
              <div className="w-full h-4 bg-white/10 relative overflow-hidden">
                <div 
                  className="bg-white h-4 transition-all duration-1000 ease-out"
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
            </div>

            {result.all_predictions && (
              <div className="pt-6 border-t-2 border-white/20">
                <h4 className="font-black mb-6 flex items-center gap-3 text-xl tracking-tight">
                  <Brain className="w-6 h-6" />
                  ALL PREDICTIONS
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(result.all_predictions).map(([condition, confidence]) => (
                    <div key={condition} className="border border-white/20 p-4 hover:border-white/40 transition-colors">
                      <div className="text-xs tracking-widest text-gray-500 mb-2">
                        {condition.replace('_', ' ').toUpperCase()}
                      </div>
                      <div className="font-black text-lg">{Number(confidence).toFixed(1)}%</div>
                      <div className="w-full h-2 bg-white/10 mt-2">
                        <div 
                          className="bg-white h-2 transition-all duration-1000"
                          style={{ width: `${confidence}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-6 border-t-2 border-white/20">
              <h4 className="font-black mb-6 flex items-center gap-3 text-xl tracking-tight">
                <Sparkles className="w-6 h-6" />
                RECOMMENDATIONS
              </h4>
              <ul className="space-y-4">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-4 text-sm">
                    <div className="w-2 h-2 bg-white mt-2 flex-shrink-0" />
                    <span className="text-gray-300 leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <button
          onClick={reset}
          className="w-full py-4 px-6 border-2 border-white hover:bg-white hover:text-black font-black tracking-widest transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          NEW ANALYSIS
        </button>
      </div>
    );
  }

  // Default state - How it works
  return (
    <div className="border-4 border-white/20 p-10">
      <h3 className="text-2xl font-black mb-8 tracking-tight">HOW IT WORKS</h3>
      <div className="space-y-6">
        {[
          { icon: Upload, text: "Upload your medical image" },
          { icon: Brain, text: "AI analyzes patterns and features" },
          { icon: Activity, text: "Get instant results and recommendations" }
        ].map((step, i) => (
          <div key={i} className="flex items-center gap-6 p-5 border-2 border-white/10 hover:border-white/30 transition-colors group">
            <div className="p-3 border-2 border-white/30 group-hover:bg-white group-hover:text-black transition-all">
              <step.icon className="w-7 h-7" />
            </div>
            <span className="font-bold tracking-wide">{step.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}