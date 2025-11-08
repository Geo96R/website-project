'use client';

import { useEffect, useState } from 'react';
import KeyboardVisualizer from './KeyboardVisualizer';

export default function TerminalDisplay({ command }) {
  const [displayedCommand, setDisplayedCommand] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (!command) {
      setDisplayedCommand('');
      return;
    }

    // Reset displayed command first to ensure animation always happens
    setDisplayedCommand('');
    
    // Detect mobile device for slower typing speed
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const typingSpeed = isMobile ? 100 : 50; // Slower on mobile so users can see it

    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= command.length) {
        setDisplayedCommand(command.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, typingSpeed);

    return () => clearInterval(typingInterval);
  }, [command]);

  // Cursor blink
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="w-full font-mono text-xs terminal-display">
      {/* Terminal Header */}
      <div className="flex items-center justify-between pb-2 border-b border-tron-blue/30 mb-3">
        <div className="text-tron-cyan">GEORGE DEVOPS TERMINAL <span className="text-tron-blue">v2.0</span></div>
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 rounded-full bg-green-500" />
        </div>
      </div>

      {/* Login Info */}
      <div className="text-gray-600 text-[10px] mb-2">
        Last login: {new Date().toLocaleString()} on ttys001
      </div>

      {/* Command Line */}
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-tron-cyan">george-sh:dev_root$</span>
        <span className="text-white">{displayedCommand}</span>
        {showCursor && <span className="text-tron-cyan">█</span>}
      </div>

    </div>
  );
}
