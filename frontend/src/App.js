import React, { useState } from 'react';
import Ui from './component/ui.jsx';
import About from './component/About.jsx';
import './App.css';

function App() {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      {showAbout ? <About /> : <Ui />}
      
      {/* Toggle Button */}
      <button
        onClick={() => setShowAbout(!showAbout)}
        className="fixed bottom-8 right-8 px-6 py-3 bg-white text-black hover:bg-black hover:text-white border-4 border-white font-black tracking-widest transition-all duration-300 transform hover:scale-110 z-50 shadow-2xl"
        style={{ fontFamily: 'inherit' }}
      >
        {showAbout ? 'DISEASE DETECTION' : 'ABOUT'}
      </button>
    </>
  );
}

export default App;
