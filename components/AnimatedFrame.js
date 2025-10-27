'use client';

import { useEffect, useState } from 'react';

export default function AnimatedFrame() {
  const [animationStep, setAnimationStep] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [hideTopBorder, setHideTopBorder] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationStep(1), 50);
    const timer2 = setTimeout(() => setShowContent(true), 1500);

    const handleScroll = () => {
      setHideTopBorder(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {!showContent && (
        <div className="fixed inset-0 bg-black z-40" />
      )}

      <div className="fixed inset-4 sm:inset-8 lg:inset-16 pointer-events-none z-50">
        
        <div 
          className={`absolute inset-0 border-2 border-tron-cyan shadow-[0_0_10px_rgba(0,255,249,0.5)] ${hideTopBorder ? 'border-t-transparent' : ''}`}
          style={{
            transition: showContent ? 'border-color 0.3s' : 'none',
            animation: animationStep === 0 ? 'none' : 'borderDraw 0.7s ease-out forwards'
          }}
        />
        
        <div 
          className={`absolute inset-3 border border-tron-blue shadow-[0_0_5px_rgba(0,153,255,0.5)] ${hideTopBorder ? 'border-t-transparent' : ''}`}
          style={{
            transition: showContent ? 'border-color 0.3s' : 'none',
            animation: animationStep === 0 ? 'none' : 'borderDraw 0.7s ease-out 0.05s forwards',
            opacity: animationStep === 0 ? 0 : 1
          }}
        />
        
        {!hideTopBorder && (
          <>
            <div 
              className="absolute top-0 left-0 w-10 h-10"
              style={{
                opacity: animationStep === 0 ? 0 : 1,
                transition: 'opacity 0.3s ease-out 1.05s'
              }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-tron-cyan shadow-[0_0_5px_rgba(0,255,249,0.7)]" />
              <div className="absolute top-0 left-0 w-1 h-full bg-tron-cyan shadow-[0_0_5px_rgba(0,255,249,0.7)]" />
            </div>
            
            <div 
              className="absolute top-0 right-0 w-10 h-10"
              style={{
                opacity: animationStep === 0 ? 0 : 1,
                transition: 'opacity 0.3s ease-out 1.1s'
              }}
            >
              <div className="absolute top-0 right-0 w-full h-1 bg-tron-cyan shadow-[0_0_5px_rgba(0,255,249,0.7)]" />
              <div className="absolute top-0 right-0 w-1 h-full bg-tron-cyan shadow-[0_0_5px_rgba(0,255,249,0.7)]" />
            </div>
          </>
        )}
        
        <div 
          className="absolute bottom-0 left-0 w-10 h-10"
          style={{
            opacity: animationStep === 0 ? 0 : 1,
            transition: 'opacity 0.3s ease-out 1.15s'
          }}
        >
          <div className="absolute bottom-0 left-0 w-full h-1 bg-tron-cyan shadow-[0_0_5px_rgba(0,255,249,0.7)]" />
          <div className="absolute bottom-0 left-0 w-1 h-full bg-tron-cyan shadow-[0_0_5px_rgba(0,255,249,0.7)]" />
        </div>
        
        <div 
          className="absolute bottom-0 right-0 w-10 h-10"
          style={{
            opacity: animationStep === 0 ? 0 : 1,
            transition: 'opacity 0.3s ease-out 1.2s'
          }}
        >
          <div className="absolute bottom-0 right-0 w-full h-1 bg-tron-cyan shadow-[0_0_5px_rgba(0,255,249,0.7)]" />
          <div className="absolute bottom-0 right-0 w-1 h-full bg-tron-cyan shadow-[0_0_5px_rgba(0,255,249,0.7)]" />
        </div>
      </div>

      <style jsx>{`
        @keyframes borderDraw {
          from {
            clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
          }
          to {
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
          }
        }
      `}</style>
    </>
  );
}