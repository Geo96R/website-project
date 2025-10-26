'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useViewport } from '../hooks/useViewport';

export default function AnimatedFrame() {
  const [showContent, setShowContent] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const viewport = useViewport();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // start animation sequence
    const timer1 = setTimeout(() => setAnimationStep(1), 100);
    const timer2 = setTimeout(() => setAnimationStep(2), 800);
    const timer3 = setTimeout(() => setAnimationStep(3), 1500);
    const timer4 = setTimeout(() => setShowContent(true), 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;

    const handleZoom = (e) => {
      e.preventDefault();
    };

    window.addEventListener('wheel', handleZoom, { passive: false });
    return () => window.removeEventListener('wheel', handleZoom);
  }, [isClient]);

  if (!isClient) return null;

  // responsive calculations based on actual viewport
  const getResponsiveDimensions = () => {
    const { width: vw, height: vh, deviceType } = viewport;
    
    // base content dimensions
    let contentWidth, contentHeight, borderOffset, bottomBuffer;
    
    switch (deviceType) {
      case 'small-mobile':
        contentWidth = Math.min(vw * 0.95, 400);
        contentHeight = Math.min(vh * 0.9, 600);
        borderOffset = 15;
        bottomBuffer = 40;
        break;
      case 'mobile':
        contentWidth = Math.min(vw * 0.9, 500);
        contentHeight = Math.min(vh * 0.85, 700);
        borderOffset = 18;
        bottomBuffer = 50;
        break;
      case 'tablet':
        contentWidth = Math.min(vw * 0.85, 800);
        contentHeight = Math.min(vh * 0.8, 800);
        borderOffset = 20;
        bottomBuffer = 60;
        break;
      case 'laptop':
        contentWidth = Math.min(vw * 0.8, 1000);
        contentHeight = Math.min(vh * 0.75, 800);
        borderOffset = 20;
        bottomBuffer = 60;
        break;
      case 'desktop':
        contentWidth = Math.min(vw * 0.75, 1200);
        contentHeight = Math.min(vh * 0.7, 800);
        borderOffset = 25;
        bottomBuffer = 70;
        break;
      case 'large-desktop':
        contentWidth = Math.min(vw * 0.7, 1400);
        contentHeight = Math.min(vh * 0.65, 900);
        borderOffset = 30;
        bottomBuffer = 80;
        break;
      default:
        contentWidth = Math.min(vw * 0.8, 1200);
        contentHeight = Math.min(vh * 0.75, 800);
        borderOffset = 20;
        bottomBuffer = 60;
    }

    return { contentWidth, contentHeight, borderOffset, bottomBuffer };
  };

  const { contentWidth, contentHeight, borderOffset, bottomBuffer } = getResponsiveDimensions();
  
  // positioning calculations
  const frameWidth = contentWidth + borderOffset * 2;
  const frameHeight = contentHeight + borderOffset * 2 + bottomBuffer;
  
  // center the frame
  const left = `calc(50vw - ${frameWidth / 2}px)`;
  const top = `calc(50vh - ${frameHeight / 2}px)`;

  return (
    <>
      {/* Black overlay before animation */}
      {!showContent && <div className="fixed inset-0 bg-black z-40" />}

      {/* Responsive Animated Frame */}
      <div
        className="fixed pointer-events-none z-50"
        style={{
          left,
          top,
          width: `${frameWidth}px`,
          height: `${frameHeight}px`,
        }}
      >
        {/* OUTER BORDER (Cyan) */}
        <div
          className="absolute w-0.5 bg-tron-cyan"
          style={{
            filter: 'drop-shadow(0 0 10px #00fff9)',
            top: '0px',
            left: '0px',
            width: animationStep >= 1 ? `${frameWidth}px` : '0px',
            transition: 'width 0.7s ease-out 0.7s',
          }}
        />
        <div
          className="absolute w-0.5 bg-tron-cyan"
          style={{
            filter: 'drop-shadow(0 0 10px #00fff9)',
            top: '0px',
            right: '0px',
            height: animationStep >= 2 ? `${frameHeight}px` : '0px',
            transition: 'height 0.7s ease-out 0.8s',
          }}
        />
        <div
          className="absolute w-0.5 bg-tron-cyan"
          style={{
            filter: 'drop-shadow(0 0 10px #00fff9)',
            bottom: '0px',
            right: '0px',
            width: animationStep >= 3 ? `${frameWidth}px` : '0px',
            transition: 'width 0.7s ease-out 0.9s',
          }}
        />
        <div
          className="absolute w-0.5 bg-tron-cyan"
          style={{
            filter: 'drop-shadow(0 0 10px #00fff9)',
            bottom: '0px',
            left: '0px',
            height: animationStep >= 3 ? `${frameHeight}px` : '0px',
            transition: 'height 0.7s ease-out 1.0s',
          }}
        />

        {/* INNER BORDER (Blue) */}
        <div
          className="absolute h-px bg-tron-blue"
          style={{
            filter: 'drop-shadow(0 0 5px #0099ff)',
            top: '12px',
            left: '12px',
            width: animationStep >= 1 ? `${frameWidth - 24}px` : '0px',
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
            className="absolute"
            style={{
              [corner.side.includes('bottom') ? 'bottom' : 'top']: 0,
              [corner.side.includes('right') ? 'right' : 'left']: 0,
              opacity: animationStep >= 3 ? 1 : 0,
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