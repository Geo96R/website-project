'use client';

import { useEffect, useState } from 'react';

export default function AnimatedFrame() {
  const [showContent, setShowContent] = useState(false);
  const [hideTopBorder, setHideTopBorder] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 1500);

    const handleScroll = () => {
      setHideTopBorder(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {!showContent && (
        <div className="fixed inset-0 bg-black z-40" />
      )}

      <div className="fixed inset-4 sm:inset-8 lg:inset-16 pointer-events-none z-50">
        
        <div className={`
          absolute inset-0 
          border-2 border-tron-cyan
          shadow-[0_0_10px_rgba(0,255,249,0.5)]
          transition-all duration-300
          ${hideTopBorder ? 'border-t-transparent' : ''}
        `} />
        
        <div className={`
          absolute inset-3
          border border-tron-blue
          shadow-[0_0_5px_rgba(0,153,255,0.5)]
          transition-all duration-300
          ${hideTopBorder ? 'border-t-transparent' : ''}
        `} />
        
        {!hideTopBorder && (
          <>
            <div className="absolute top-0 left-0 w-10 h-10">
              <div className="absolute top-0 left-0 w-full h-1 bg-tron-cyan shadow-[0_0_5px_rgba(0,255,249,0.7)]" />
              <div className="absolute top-0 left-0 w-1 h-full bg-tron-cyan shadow-[0_0_5px_rgba(0,255,249,0.7)]" />
            </div>
            
            <div className="absolute top-0 right-0 w-10 h-10">
              <div className="absolute top-0 right-0 w-full h-1 bg-tron-cyan shadow-[0_0_5px_rgba(0,255,249,0.7)]" />
              <div className="absolute top-0 right-0 w-1 h-full bg-tron-cyan shadow-[0_0_5px_rgba(0,255,249,0.7)]" />
            </div>
          </>
        )}
        
        <div className="absolute bottom-0 left-0 w-10 h-10">
          <div className="absolute bottom-0 left-0 w-full h-1 bg-tron-cyan shadow-[0_0_5px_rgba(0,255,249,0.7)]" />
          <div className="absolute bottom-0 left-0 w-1 h-full bg-tron-cyan shadow-[0_0_5px_rgba(0,255,249,0.7)]" />
        </div>
        
        <div className="absolute bottom-0 right-0 w-10 h-10">
          <div className="absolute bottom-0 right-0 w-full h-1 bg-tron-cyan shadow-[0_0_5px_rgba(0,255,249,0.7)]" />
          <div className="absolute bottom-0 right-0 w-1 h-full bg-tron-cyan shadow-[0_0_5px_rgba(0,255,249,0.7)]" />
        </div>
      </div>
    </>
  );
}