'use client';

import { useEffect, useState } from 'react';

export default function AnimatedFrame() {
  const [animationStep, setAnimationStep] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // only run on client side
    if (!isClient || typeof window === 'undefined') return;
    
    const calculateDimensions = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // define content area
      const contentWidth = Math.min(vw * 0.8, 1200);
      const contentHeight = Math.min(vh * 0.85, 800);

      setContainerDimensions({
        width: contentWidth,
        height: contentHeight,
      });
    };

    calculateDimensions();

    window.addEventListener('resize', calculateDimensions);
    window.addEventListener('orientationchange', calculateDimensions);

    const handleZoom = () => setTimeout(calculateDimensions, 100);
    window.addEventListener('wheel', handleZoom);
    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=')) {
        handleZoom();
      }
    });

    const timer1 = setTimeout(() => setAnimationStep(1), 50);
    const timer2 = setTimeout(() => setShowContent(true), 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('resize', calculateDimensions);
      window.removeEventListener('orientationchange', calculateDimensions);
      window.removeEventListener('wheel', handleZoom);
    };
  }, [isClient]);

  // --- Layout Math ---
  const borderOffset = 20;   // Border distance from content
  const bottomBuffer = 60;   // Space at the bottom for keyboard area

  // Shift frame upward slightly to leave breathing room at bottom
  const left = `calc(50vw - ${containerDimensions.width / 2}px - ${borderOffset}px)`;
  const top = `calc(50vh - ${containerDimensions.height / 2}px - ${borderOffset}px - ${bottomBuffer / 2}px)`;

  const width = containerDimensions.width + borderOffset * 2;
  const height = containerDimensions.height + borderOffset * 2 + bottomBuffer;

  return (
    <>
      {/* Black overlay before animation */}
      {!showContent && <div className="fixed inset-0 bg-black z-40" />}

      {/* Tron Animated Frame */}
      <div
        className="fixed pointer-events-none z-50"
        style={{
          left,
          top,
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        {/* OUTER BORDER (Cyan) */}
        <div
          className="absolute w-0.5 bg-tron-cyan"
          style={{
            filter: 'drop-shadow(0 0 10px #00fff9)',
            left: '0px',
            bottom: '0px',
            height: animationStep === 0 ? '0px' : `${height}px`,
            transition: 'height 0.7s ease-out',
          }}
        />

        <div
          className="absolute h-0.5 bg-tron-cyan"
          style={{
            filter: 'drop-shadow(0 0 10px #00fff9)',
            bottom: '0px',
            left: '0px',
            width: animationStep === 0 ? '0px' : `${width}px`,
            transition: 'width 0.7s ease-out',
          }}
        />

        <div
          className="absolute w-0.5 bg-tron-cyan"
          style={{
            filter: 'drop-shadow(0 0 10px #00fff9)',
            right: '0px',
            bottom: '0px',
            height: animationStep === 0 ? '0px' : `${height}px`,
            transition: 'height 0.7s ease-out 0.7s',
          }}
        />

        <div
          className="absolute h-0.5 bg-tron-cyan"
          style={{
            filter: 'drop-shadow(0 0 10px #00fff9)',
            top: '0px',
            left: '0px',
            width: animationStep === 0 ? '0px' : `${width}px`,
            transition: 'width 0.7s ease-out 0.7s',
          }}
        />

        {/* INNER BORDER (Blue Glow) */}
        <div
          className="absolute w-px bg-tron-blue"
          style={{
            filter: 'drop-shadow(0 0 5px #0099ff)',
            left: '12px',
            bottom: '12px',
            height: animationStep === 0 ? '0px' : `${height - 24}px`,
            transition: 'height 0.7s ease-out 0.05s',
          }}
        />

        <div
          className="absolute h-px bg-tron-blue"
          style={{
            filter: 'drop-shadow(0 0 5px #0099ff)',
            bottom: '12px',
            left: '12px',
            width: animationStep === 0 ? '0px' : `${width - 24}px`,
            transition: 'width 0.7s ease-out 0.05s',
          }}
        />

        <div
          className="absolute w-px bg-tron-blue"
          style={{
            filter: 'drop-shadow(0 0 5px #0099ff)',
            right: '12px',
            bottom: '12px',
            height: animationStep === 0 ? '0px' : `${height - 24}px`,
            transition: 'height 0.7s ease-out 0.75s',
          }}
        />

        <div
          className="absolute h-px bg-tron-blue"
          style={{
            filter: 'drop-shadow(0 0 5px #0099ff)',
            top: '12px',
            left: '12px',
            width: animationStep === 0 ? '0px' : `${width - 24}px`,
            transition: 'width 0.7s ease-out 0.75s',
          }}
        />

        {/* CORNER ACCENTS */}
        {[
          { side: 'top-left', top: '0px', left: '0px', delay: '1.05s' },
          { side: 'top-right', top: '0px', right: '0px', delay: '1.1s' },
          { side: 'bottom-left', bottom: '0px', left: '0px', delay: '1.15s' },
          { side: 'bottom-right', bottom: '0px', right: '0px', delay: '1.2s' },
        ].map((corner, idx) => (
          <div
            key={idx}
            className="absolute w-10 h-10"
            style={{
              ...corner,
              opacity: animationStep === 0 ? 0 : 1,
              transition: `opacity 0.3s ease-out ${corner.delay}`,
            }}
          >
            <div
              className="absolute w-10 h-1 bg-tron-cyan"
              style={{ [corner.side.includes('bottom') ? 'bottom' : 'top']: 0, [corner.side.includes('right') ? 'right' : 'left']: 0, filter: 'drop-shadow(0 0 5px #00fff9)' }}
            />
            <div
              className="absolute w-1 h-10 bg-tron-cyan"
              style={{ [corner.side.includes('bottom') ? 'bottom' : 'top']: 0, [corner.side.includes('right') ? 'right' : 'left']: 0, filter: 'drop-shadow(0 0 5px #00fff9)' }}
            />
          </div>
        ))}
      </div>
    </>
  );
}
