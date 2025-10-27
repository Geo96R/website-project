'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function StreamSelector({ onStreamSelect }) {
  const [hoveredStream, setHoveredStream] = useState(null);

  const streams = [
    { id: 'aws', name: 'AWS STREAM', subtitle: 'Global Infrastructure', active: true },
    { id: 'google', name: 'GOOGLE STREAM', subtitle: 'Cloud Platform', active: true },
    { id: 'infrastucture', name: 'INFRASTRUCTURE STREAM', subtitle: 'How it came to be', active: false },
    { id: 'learn', name: 'LEARN STREAM', subtitle: 'DevOps Knowledge Base', active: true },
    { id: 'radio', name: 'RADIO STREAM', subtitle: 'Live Audio Broadcast', active: true },
    { id: 'cv', name: 'CV STREAM', subtitle: 'Professional Profile', active: true },
  ];

  return (
    <div className="w-full space-y-2 sm:space-y-4">
      {/* Header */}
      <div className="pb-1 sm:pb-2 border-b border-tron-cyan/30">
        <h2 className="text-xs sm:text-sm md:text-base text-tron-cyan font-mono break-words">
          DEVOPS CONTROL CENTER ... PLEASE SELECT DATA <span className="text-tron-blue">.STREAM</span>
        </h2>
      </div>

      {/* Stream Grid - Responsive: 1 column on mobile, 2 on tablet, 3 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
        {streams.map((stream, index) => (
          <motion.div
            key={stream.id}
            onMouseEnter={() => setHoveredStream(stream.id)}
            onMouseLeave={() => setHoveredStream(null)}
            onClick={() => stream.active && onStreamSelect(stream.id)}
            whileHover={stream.active ? { scale: 1.02 } : {}}
            whileTap={stream.active ? { scale: 0.98 } : {}}
            className={`
              relative p-3 sm:p-4 cursor-pointer transition-all duration-300
              ${hoveredStream === stream.id && stream.active
                ? 'bg-gradient-to-br from-tron-cyan/15 to-tron-blue/10 border-tron-cyan shadow-lg shadow-tron-cyan/20' 
                : stream.active
                ? 'bg-gradient-to-br from-black/40 to-black/20 border-tron-cyan/30'
                : 'bg-gradient-to-br from-black/20 to-black/10 border-gray-700 opacity-40 cursor-not-allowed'}
              border-2 rounded-sm
            `}
            style={{
              boxShadow: hoveredStream === stream.id && stream.active 
                ? '0 0 20px rgba(0, 255, 249, 0.3), inset 0 0 20px rgba(0, 255, 249, 0.1)' 
                : 'none'
            }}
          >
            {/* Status Indicator - Top Right */}
            <div className="absolute top-1 right-1 flex items-center space-x-1 z-10">
              <div className={`
                w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse shadow-lg transition-all duration-300
                ${stream.active 
                  ? 'bg-green-400 shadow-green-400/50' 
                  : 'bg-red-500 shadow-red-500/50'}
              `} />
              <div className={`
                text-[7px] sm:text-[8px] font-mono transition-all duration-300
                ${stream.active ? 'text-green-400' : 'text-red-500'}
              `}>
                {stream.active ? 'ONLINE' : 'OFFLINE'}
              </div>
            </div>

            {/* Windows-style Folder Icon with TRON aesthetics - Responsive sizing */}
            <div className="w-12 h-10 sm:w-16 sm:h-14 mb-2 sm:mb-3 mx-auto relative">
              {/* Folder Tab */}
              <div className={`
                absolute top-0 left-0 w-5 h-1.5 sm:w-7 sm:h-2 transition-all duration-300
                ${hoveredStream === stream.id && stream.active
                  ? 'border-l-2 border-t-2 border-r border-tron-cyan bg-black' 
                  : stream.active
                  ? 'border-l border-t border-r border-tron-cyan/60 bg-black'
                  : 'border-l border-t border-r border-gray-600 bg-black/50'}
              `}
              style={{
                borderTopRightRadius: '2px',
              }} />
              
              {/* Main Folder Body */}
              <div className={`
                absolute top-1 sm:top-1.5 left-0 w-full h-8 sm:h-11 transition-all duration-300
                ${hoveredStream === stream.id && stream.active
                  ? 'bg-black shadow-lg shadow-tron-cyan/30' 
                  : stream.active
                  ? 'bg-black'
                  : 'bg-black/50'}
              `}
              style={{
                background: 'black',
              }}>
                {/* Top edge - cyan highlight */}
                <div className={`
                  absolute top-0 left-0 right-0 h-px transition-all duration-300
                  ${hoveredStream === stream.id && stream.active
                    ? 'bg-tron-cyan' 
                    : stream.active
                    ? 'bg-tron-cyan/60'
                    : 'bg-gray-600'}
                `} />
                
                {/* Right edge - cyan highlight */}
                <div className={`
                  absolute top-0 right-0 bottom-0 w-px transition-all duration-300
                  ${hoveredStream === stream.id && stream.active
                    ? 'bg-tron-cyan' 
                    : stream.active
                    ? 'bg-tron-cyan/60'
                    : 'bg-gray-600'}
                `} />
                
                {/* Left edge */}
                <div className={`
                  absolute top-0 left-0 bottom-0 w-px transition-all duration-300
                  ${hoveredStream === stream.id && stream.active
                    ? 'bg-tron-cyan/40' 
                    : stream.active
                    ? 'bg-tron-cyan/30'
                    : 'bg-gray-700'}
                `} />
                
                {/* Bottom edge */}
                <div className={`
                  absolute bottom-0 left-0 right-0 h-px transition-all duration-300
                  ${hoveredStream === stream.id && stream.active
                    ? 'bg-tron-cyan/40' 
                    : stream.active
                    ? 'bg-tron-cyan/30'
                    : 'bg-gray-700'}
                `} />
                
                {/* 3-angle rectangle - centered on folder bottom */}
                <div className={`
                  absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-2 sm:w-8 sm:h-3 transition-all duration-300
                  ${hoveredStream === stream.id && stream.active
                    ? 'bg-tron-cyan/30' 
                    : stream.active
                    ? 'bg-tron-cyan/20'
                    : 'bg-gray-700/20'}
                `} 
                style={{
                  clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 20% 100%, 0% 80%)', // Creates 3-angle shape
                }} />
                
                {/* Inner glow effect on hover */}
                {hoveredStream === stream.id && stream.active && (
                  <div className="absolute inset-0 bg-gradient-to-br from-tron-cyan/5 via-transparent to-tron-cyan/5 animate-pulse" />
                )}
              </div>
            </div>

            {/* Stream Name */}
            <div className="text-center">
              <div className={`
                text-[10px] sm:text-xs font-mono font-bold mb-0.5 sm:mb-1 transition-all duration-300
                ${stream.active ? 'text-tron-cyan' : 'text-gray-500'}
                ${hoveredStream === stream.id && stream.active ? 'drop-shadow-[0_0_8px_rgba(0,255,249,0.6)]' : ''}
              `}>
                {stream.name}
              </div>
              <div className="text-[8px] sm:text-[10px] text-gray-400 transition-colors duration-300">
                {stream.subtitle}
              </div>
            </div>

            {/* Inactive Overlay */}
            {!stream.active && (
              <div className="absolute inset-0 bg-black/60 rounded-sm flex items-center justify-center pointer-events-none">
                <div className="text-[10px] text-gray-500 font-mono opacity-0">OFFLINE</div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}