'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import StreamSelector from './StreamSelector';
import TerminalDisplay from './TerminalDisplay';
import InteractiveKeyboard from './InteractiveKeyboard';

// dynamic import to prevent SSR issues
const AnimatedFrame = dynamic(() => import('./AnimatedFrame'), { ssr: false });

export default function LandingPage() {
  const router = useRouter();
  const [terminalCommand, setTerminalCommand] = useState('');
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // only run on client side
    if (typeof window === 'undefined') return;
    
    // check if mobile device
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isTablet = /iPad|Android/i.test(navigator.userAgent) && 'ontouchstart' in window;
      setIsMobile(isMobileDevice || isTablet);
    };
    
    checkMobile();
    
    // Calculate the same dimensions as AnimatedFrame
    const calculateDimensions = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      
      // Mobile landscape optimizations
      let contentWidth, contentHeight;
      if (isMobile && vh < vw) {
        // Landscape mobile - use more screen space
        contentWidth = Math.min(vw * 0.95, 1200);
        contentHeight = Math.min(vh * 0.9, 600);
      } else {
        // Desktop or portrait mobile
        contentWidth = Math.min(vw * 0.8, 1200);
        contentHeight = Math.min(vh * 0.85, 800);
      }
      
      setContainerDimensions({
        width: contentWidth,
        height: contentHeight,
      });
    };

    calculateDimensions();
    window.addEventListener('resize', calculateDimensions);
    window.addEventListener('orientationchange', calculateDimensions);
    
    const handleZoom = () => {
      setTimeout(calculateDimensions, 100);
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
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const typingSpeed = isMobile ? 50 : 250; // slower on PC, faster on mobile
    const delay = isMobile ? 500 : 1000; // shorter delay on mobile
    
    setTimeout(() => {
      router.push(`/${streamId}`);
    }, fullCommand.length * typingSpeed + delay);
  };

  return (
    <>
      <AnimatedFrame />
      <div className="min-h-screen flex items-center justify-center">
        {/* Synchronized container - same dimensions as border */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="relative"
          style={{
            width: `${containerDimensions.width}px`,
            height: `${containerDimensions.height}px`,
            padding: '20px',
          }}
        >
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          
          {/* LEFT COLUMN - README stacked vertically */}
          <div className="space-y-4">
            {/* Header */}
            <div className="border-t-2 border-b border-tron-cyan p-2">
              <div className="text-xs text-tron-cyan font-mono">GEORGE DEVOPS PORTAL <span className="text-tron-blue">v2.0</span></div>
            </div>

            {/* README Section - Vertical */}
            <div className="border border-tron-cyan p-4 bg-black/50">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-tron-cyan/30">
                <h2 className="text-lg font-bold text-tron-cyan font-mono">README <span className="text-tron-blue">.TXT</span></h2>
                <span className="text-[10px] text-tron-blue">END. PROGRAM</span>
              </div>
              
              <div className="space-y-3 text-xs leading-relaxed">
                <p className="text-gray-300">
                  Hello <span className="text-tron-cyan font-semibold">User</span>.
                </p>
                <p className="text-gray-300">
                  I'm <span className="text-tron-cyan font-semibold">George Tatevosov</span>, DevOps Engineer at Kadara Inc.
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
            <div className="border border-tron-blue p-4 bg-black/50">
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
            <div className="border-t border-tron-blue/30 pt-3">
              <p className="text-[10px] text-gray-600 text-center italic">
                "Work hard, be kind, and amazing things will happen"
              </p>
              <p className="text-[10px] text-gray-700 text-center mt-1">
                © 2025 George Tatevosov
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN - Streams and Terminal */}
          <div className="lg:col-span-2 space-y-4">
            {/* Header */}
            <div className="border-t-2 border-b border-tron-cyan p-2">
              <div className="text-xs text-tron-cyan font-mono">
                CENTRAL SYSTEM DATA ... <span className="text-tron-blue">LAUNCH GLOBAL VISUALIZATION</span>
              </div>
            </div>

            {/* Stream Selector */}
            <div className="border border-tron-cyan/50 p-6 bg-black/50">
              <StreamSelector onStreamSelect={handleStreamSelect} />
            </div>

            {/* Terminal Display */}
            <div className="border border-tron-blue/50 p-4 bg-black/50">
              <TerminalDisplay command={terminalCommand} />
            </div>

            {/* Interactive Keyboard - SEPARATE PANEL */}
            <div className="border border-tron-cyan/50 p-4 bg-black/50">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-tron-cyan/30">
                <h2 className="text-sm font-bold text-tron-cyan font-mono">INTERACTIVE <span className="text-tron-blue">.KEYBOARD</span></h2>
              </div>
              <InteractiveKeyboard command={terminalCommand} />
            </div>
          </div>
        </div>
        </motion.div>
      </div>
    </>
  );
}
