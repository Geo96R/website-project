'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import StreamSelector from './StreamSelector';
import TerminalDisplay from './TerminalDisplay';
import KeyboardVisualizer from './KeyboardVisualizer';

// dynamic import to prevent SSR issues
const AnimatedFrame = dynamic(() => import('./AnimatedFrame'), { ssr: false });

export default function LandingPage() {
  const router = useRouter();
  const [terminalCommand, setTerminalCommand] = useState('');
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(true);

  useEffect(() => {
    // only run on client side
    if (typeof window === 'undefined') return;
    
    // check if mobile device and screen size
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isSmallTablet = /iPad/i.test(navigator.userAgent) && window.innerWidth < 768;
      const isSmallScreen = window.innerWidth < 768; // Hide keyboard below 768px
      
      setIsMobile(isMobileDevice || isSmallTablet || isSmallScreen);
      setShowKeyboard(!isSmallScreen); // Only show keyboard on screens 768px and wider
    };
    
    checkMobile();
    
    // Calculate the same dimensions as AnimatedFrame
    const calculateDimensions = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      
      // Responsive sizing
      let contentWidth, contentHeight;
      
      // Mobile devices (portrait)
      if (vw < 768 && vh > vw) {
        contentWidth = vw * 0.92;
        contentHeight = vh * 0.88;
      }
      // Mobile devices (landscape) and tablets
      else if (vw < 1024) {
        contentWidth = vw * 0.88;
        contentHeight = vh * 0.85;
      }
      // Desktop and larger screens
      else {
        contentWidth = Math.min(vw * 0.8, 1200);
        contentHeight = Math.min(vh * 0.85, 800);
      }
      
      setContainerDimensions({
        width: contentWidth,
        height: contentHeight,
      });
    };

    calculateDimensions();
    window.addEventListener('resize', () => {
      calculateDimensions();
      checkMobile(); // Recheck on resize
    });
    window.addEventListener('orientationchange', () => {
      calculateDimensions();
      checkMobile(); // Recheck on orientation change
    });
    
    const handleZoom = () => {
      setTimeout(() => {
        calculateDimensions();
        checkMobile();
      }, 100);
    };
    window.addEventListener('wheel', handleZoom);
    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=')) {
        handleZoom();
      }
    });

    return () => {
      window.removeEventListener('resize', calculateDimensions);
      window.removeEventListener('orientationchange', calculateDimensions);
      window.removeEventListener('wheel', handleZoom);
    };
  }, []);

  const handleStreamSelect = (streamId) => {
    const fullCommand = `./launch_${streamId}.sh`;
    setTerminalCommand(fullCommand);
    
    // Auto-scroll to terminal on mobile
    setTimeout(() => {
      const terminalElement = document.querySelector('.terminal-display');
      if (terminalElement) {
        terminalElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 500);
    
    // faster navigation - adjust speed based on device
    const isMobileDevice = typeof window !== 'undefined' && window.innerWidth <= 768;
    const typingSpeed = isMobileDevice ? 50 : 250; // slower on PC, faster on mobile
    const delay = isMobileDevice ? 500 : 1000; // shorter delay on mobile
    
    setTimeout(() => {
      router.push(`/${streamId}`);
    }, fullCommand.length * typingSpeed + delay);
  };

  return (
    <>
      <AnimatedFrame />
      <div className="min-h-screen flex items-start justify-center pt-2 sm:pt-4 lg:items-center lg:pt-0 overflow-y-auto">
        {/* Synchronized container - same dimensions as border, auto-height on mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="relative mb-4"
          style={{
            width: `${containerDimensions.width}px`,
            minHeight: isMobile ? 'auto' : `${containerDimensions.height}px`,
            height: isMobile ? 'auto' : `${containerDimensions.height}px`,
            maxHeight: isMobile ? 'none' : `${containerDimensions.height}px`,
            padding: isMobile ? '8px' : '16px',
            overflow: isMobile ? 'visible' : 'hidden',
          }}
        >
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 h-full" style={{ overflow: isMobile ? 'visible' : 'hidden' }}>
          
          {/* LEFT COLUMN - README stacked vertically */}
          <div className="space-y-2 sm:space-y-3 flex flex-col h-full" style={{ overflow: isMobile ? 'visible' : 'hidden' }}>
            {/* Header */}
            <div className="border-t-2 border-b border-tron-cyan p-2">
              <div className="text-xs text-tron-cyan font-mono">GEORGE DEVOPS PORTAL <span className="text-tron-blue">v2.0</span></div>
            </div>

            {/* README Section - Vertical */}
            <div className="border border-tron-cyan p-2 sm:p-3 bg-black/50 flex-grow overflow-y-auto">
              <div className="flex items-center justify-between mb-2 sm:mb-3 pb-2 border-b border-tron-cyan/30">
                <h2 className="text-base sm:text-lg font-bold text-tron-cyan font-mono">README <span className="text-tron-blue">.TXT</span></h2>
                <span className="text-[10px] text-tron-blue">END. PROGRAM</span>
              </div>
              
              <div className="space-y-2 sm:space-y-3 text-xs leading-relaxed">
                <p className="text-gray-300">
                  Hello <span className="text-tron-cyan font-semibold">Traveler</span>.
                </p>
                <p className="text-gray-300">
                  I'm <span className="text-tron-cyan font-semibold">George Tatevosov</span>, DevOps Engineer at Kadabra Inc.
                </p>
                <p className="text-gray-300">
                  I architect and automate global infrastructure at scale. Tech leading a distributed team managing <span className="text-tron-cyan">7000+</span> containerized services across <span className="text-tron-cyan">30+</span> servers spanning 3 continents.
                </p>
                <p className="text-gray-300">
                  This portal visualizes live infrastructure data. Click on a stream to the right to continue.
                </p>
              </div>
            </div>

            {/* System Status */}
            <div className="border border-tron-blue p-2 sm:p-3 bg-black/50 flex-shrink-0">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-tron-blue/30">
                <h2 className="text-sm font-bold text-tron-cyan font-mono">SYSTEM <span className="text-tron-blue">.STATUS</span></h2>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">System Status:</span>
                  <span className="text-green-400">ONLINE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Security Level:</span>
                  <span className="text-red-400">ZERO-TRUST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Streams:</span>
                  <span className="text-tron-cyan">5/6</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Login:</span>
                  <span className="text-gray-500 text-[10px]">{new Date().toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Footer Quote */}
            <div className="border-t border-tron-blue/30 pt-2 sm:pt-3 flex-shrink-0">
              <p className="text-[10px] text-gray-600 text-center italic">
                "Work hard, be kind, and amazing things will happen"
              </p>
              <p className="text-[10px] text-gray-700 text-center mt-1">
                © 2025 George Tatevosov
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN - Streams and Terminal */}
          <div className="lg:col-span-2 space-y-2 sm:space-y-3 flex flex-col h-full" style={{ overflow: isMobile ? 'visible' : 'hidden' }}>
            {/* Header */}
            <div className="border-t-2 border-b border-tron-cyan p-2">
              <div className="text-xs text-tron-cyan font-mono">
                CENTRAL SYSTEM DATA ... <span className="text-tron-blue">LAUNCH GLOBAL VISUALIZATION</span>
              </div>
            </div>

            {/* Stream Selector */}
            <div className="border border-tron-cyan/50 p-2 sm:p-3 lg:p-4 bg-black/50 flex-shrink-0">
              <StreamSelector onStreamSelect={handleStreamSelect} />
            </div>

            {/* Terminal Display */}
            <div className="border border-tron-blue/50 p-2 sm:p-3 bg-black/50 flex-shrink-0">
              <TerminalDisplay command={terminalCommand} />
            </div>

            {/* Interactive Keyboard - ONLY SHOW ON TABLETS AND DESKTOP (768px+) */}
            {showKeyboard && (
              <div className="border border-tron-cyan/50 p-2 sm:p-3 bg-black/50 flex-shrink-0 overflow-hidden">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-tron-cyan/30">
                  <h2 className="text-sm font-bold text-tron-cyan font-mono">KEYBOARD <span className="text-tron-blue">.VISUALIZER</span></h2>
                </div>
                <KeyboardVisualizer command={terminalCommand} />
              </div>
            )}
          </div>
        </div>
        </motion.div>
      </div>
    </>
  );
}