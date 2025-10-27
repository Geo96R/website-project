'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import StreamSelector from './StreamSelector';
import TerminalDisplay from './TerminalDisplay';
import KeyboardVisualizer from './KeyboardVisualizer';

const AnimatedFrame = dynamic(() => import('./AnimatedFrame'), { ssr: false });

export default function LandingPage() {
  const router = useRouter();
  const [terminalCommand, setTerminalCommand] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleStreamSelect = (streamId) => {
    const fullCommand = `./launch_${streamId}.sh`;
    setTerminalCommand(fullCommand);
    
    if (isMobile) {
      setTimeout(() => {
        const terminalElement = document.querySelector('.terminal-display');
        if (terminalElement) {
          terminalElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
    }
    
    const typingSpeed = isMobile ? 50 : 250;
    const delay = isMobile ? 500 : 1000;
    
    setTimeout(() => {
      router.push(`/${streamId}`);
    }, fullCommand.length * typingSpeed + delay);
  };

  return (
    <>
      <AnimatedFrame />
      
      <div className="min-h-screen p-6 sm:p-10 lg:p-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            
            <div className="space-y-4">
              <div className="border-t-2 border-b border-tron-cyan p-2">
                <div className="text-xs text-tron-cyan font-mono">
                  GEORGE DEVOPS PORTAL <span className="text-tron-blue">v2.0</span>
                </div>
              </div>

              <div className="border border-tron-cyan p-4 bg-black/50">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-tron-cyan/30">
                  <h2 className="text-base sm:text-lg font-bold text-tron-cyan font-mono">
                    README <span className="text-tron-blue">.TXT</span>
                  </h2>
                  <span className="text-[10px] text-tron-blue">END. PROGRAM</span>
                </div>
                
                <div className="space-y-3 text-xs leading-relaxed">
                  <p className="text-gray-300">
                    Hello <span className="text-tron-cyan font-semibold">Traveler</span>.
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

              <div className="border border-tron-blue p-4 bg-black/50">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-tron-blue/30">
                  <h2 className="text-sm font-bold text-tron-cyan font-mono">
                    SYSTEM <span className="text-tron-blue">.STATUS</span>
                  </h2>
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
                    <span className="text-gray-500 text-[10px]">
                      {new Date().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-tron-blue/30 pt-3">
                <p className="text-[10px] text-gray-600 text-center italic">
                  "Work hard, be kind, and amazing things will happen"
                </p>
                <p className="text-[10px] text-gray-700 text-center mt-1">
                  © 2025 George Tatevosov
                </p>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="border-t-2 border-b border-tron-cyan p-2">
                <div className="text-xs text-tron-cyan font-mono">
                  CENTRAL SYSTEM DATA ... <span className="text-tron-blue">LAUNCH GLOBAL VISUALIZATION</span>
                </div>
              </div>

              <div className="border border-tron-cyan/50 p-4 lg:p-6 bg-black/50">
                <StreamSelector onStreamSelect={handleStreamSelect} />
              </div>

              <div className="border border-tron-blue/50 p-4 bg-black/50 terminal-display">
                <TerminalDisplay command={terminalCommand} />
              </div>

              {!isMobile && (
                <div className="border border-tron-cyan/50 p-4 bg-black/50">
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-tron-cyan/30">
                    <h2 className="text-sm font-bold text-tron-cyan font-mono">
                      KEYBOARD <span className="text-tron-blue">.VISUALIZER</span>
                    </h2>
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