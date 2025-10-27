'use client';

import { useEffect, useState } from 'react';

export default function AnimatedFrame() {
  const [animationStep, setAnimationStep] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [isClient, setIsClient] = useState(false);
  const [scrollState, setScrollState] = useState({
    hideTop: false,
    hideBottom: false,
    scrollY: 0,
    isAtBottom: false,
    isAtTop: true,
    documentHeight: 0,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run on client side
    if (!isClient || typeof window === 'undefined') return;
    
    const calculateDimensions = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Responsive content sizing based on device type
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

    // Get actual content height (where content actually ends)
    const getActualContentHeight = () => {
      // Get the body's actual content height
      const body = document.body;
      const html = document.documentElement;
      
      // Find the last element in the body
      const allElements = document.body.getElementsByTagName('*');
      let maxBottom = 0;
      
      for (let i = 0; i < allElements.length; i++) {
        const rect = allElements[i].getBoundingClientRect();
        const bottom = rect.bottom + window.scrollY;
        if (bottom > maxBottom) {
          maxBottom = bottom;
        }
      }
      
      // Return the maximum of various height calculations
      return Math.max(
        maxBottom,
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );
    };

    // Handle scroll behavior
    const handleScroll = () => {
      if (!showContent) return; // Don't handle scroll during initial animation

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = getActualContentHeight();
      
      // IMMEDIATE triggers - start hiding as soon as scroll begins
      const topThreshold = 5; // Start hiding top border almost immediately
      const bottomThreshold = 1; // Start hiding bottom border IMMEDIATELY on any scroll
      
      // Check if at bottom of page (with small buffer)
      const isAtBottom = (scrollY + windowHeight) >= (documentHeight - 50);
      
      // Check if at top of page (very small threshold)
      const isAtTop = scrollY < topThreshold;

      setScrollState({
        hideTop: scrollY > topThreshold,
        hideBottom: scrollY > bottomThreshold, // Triggers immediately
        scrollY,
        isAtBottom,
        isAtTop,
        documentHeight,
      });
    };

    // Event listeners
    window.addEventListener('resize', () => {
      calculateDimensions();
      handleScroll();
    });
    window.addEventListener('orientationchange', () => {
      calculateDimensions();
      handleScroll();
    });
    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleZoom = () => {
      setTimeout(() => {
        calculateDimensions();
        handleScroll();
      }, 100);
    };
    window.addEventListener('wheel', handleZoom, { passive: true });
    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=')) {
        handleZoom();
      }
    });

    // Animation timers
    const timer1 = setTimeout(() => setAnimationStep(1), 50);
    const timer2 = setTimeout(() => {
      setShowContent(true);
      handleScroll(); // Initial scroll check
    }, 1500);

    // Initial scroll check and periodic updates for dynamic content
    handleScroll();
    const heightCheckInterval = setInterval(handleScroll, 1000); // Check every second

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearInterval(heightCheckInterval);
      window.removeEventListener('resize', calculateDimensions);
      window.removeEventListener('orientationchange', calculateDimensions);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleZoom);
    };
  }, [isClient, showContent]);

  // --- Layout Math ---
  const borderOffset = 20;

  // Responsive border offset for smaller screens
  const responsiveBorderOffset = containerDimensions.width < 600 ? 12 : borderOffset;

  // Center positioning
  const left = `calc(50vw - ${containerDimensions.width / 2}px - ${responsiveBorderOffset}px)`;
  const top = `0px`;

  const width = containerDimensions.width + responsiveBorderOffset * 2;
  const frameHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

  // Use the actual document height from scroll state, or fallback to calculated
  const documentHeight = scrollState.documentHeight > 0 ? scrollState.documentHeight : 
    (typeof window !== 'undefined' ? 
      Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        frameHeight
      ) : frameHeight);

  // Left and right border heights should extend to actual content height when scrolling
  const sidesBorderHeight = scrollState.hideBottom ? documentHeight : frameHeight;

  // Calculate bottom border position (moves to bottom of document when at bottom)
  const bottomBorderTop = scrollState.isAtBottom ? documentHeight - 2 : frameHeight - 2;

  // Bottom border width animation (retracts from both sides)
  // Start retracting IMMEDIATELY when hideBottom is true
  const bottomBorderWidth = scrollState.hideBottom && !scrollState.isAtBottom ? 0 : width;

  return (
    <>
      {/* Black overlay before animation */}
      {!showContent && <div className="fixed inset-0 bg-black z-40" />}

      {/* Tron Animated Frame */}
      <div
        className="absolute pointer-events-none z-50"
        style={{
          left,
          top,
          width: `${width}px`,
          height: `${documentHeight}px`,
        }}
      >
        {/* LEFT BORDER (Cyan) - Extends to full document height */}
        <div
          className="absolute w-0.5 bg-tron-cyan"
          style={{
            filter: 'drop-shadow(0 0 10px #00fff9)',
            left: '0px',
            top: '0px',
            height: animationStep === 0 ? '0px' : `${sidesBorderHeight}px`,
            transition: showContent ? 'height 0.4s ease-out' : 'height 0.7s ease-out',
          }}
        />

        {/* BOTTOM BORDER (Cyan) - Retracts IMMEDIATELY on scroll */}
        <div
          className="absolute h-0.5 bg-tron-cyan"
          style={{
            filter: 'drop-shadow(0 0 10px #00fff9)',
            top: `${bottomBorderTop}px`,
            left: `${(width - bottomBorderWidth) / 2}px`, // Center the retraction
            width: animationStep === 0 ? '0px' : `${bottomBorderWidth}px`,
            transition: showContent ? 
              'width 0.4s ease-out, left 0.4s ease-out, top 0.4s ease-out' : 
              'width 0.7s ease-out',
          }}
        />

        {/* RIGHT BORDER (Cyan) - Extends to full document height */}
        <div
          className="absolute w-0.5 bg-tron-cyan"
          style={{
            filter: 'drop-shadow(0 0 10px #00fff9)',
            right: '0px',
            top: '0px',
            height: animationStep === 0 ? '0px' : `${sidesBorderHeight}px`,
            transition: showContent ? 'height 0.4s ease-out' : 'height 0.7s ease-out 0.7s',
          }}
        />

        {/* TOP BORDER (Cyan) - Hides when scrolling, reappears at page top */}
        <div
          className="absolute h-0.5 bg-tron-cyan"
          style={{
            filter: 'drop-shadow(0 0 10px #00fff9)',
            top: '0px',
            left: `${scrollState.hideTop && !scrollState.isAtTop ? (width / 2) : 0}px`, // Retract to center
            width: animationStep === 0 ? '0px' : 
                   (scrollState.hideTop && !scrollState.isAtTop ? '0px' : `${width}px`),
            transition: showContent ? 
              'width 0.3s ease-out, left 0.3s ease-out' : 
              'width 0.7s ease-out 0.7s',
          }}
        />

        {/* INNER BORDER LEFT (Blue Glow) */}
        <div
          className="absolute w-px bg-tron-blue"
          style={{
            filter: 'drop-shadow(0 0 5px #0099ff)',
            left: '12px',
            top: '12px',
            height: animationStep === 0 ? '0px' : `${sidesBorderHeight - 24}px`,
            transition: showContent ? 'height 0.4s ease-out' : 'height 0.7s ease-out 0.05s',
          }}
        />

        {/* INNER BORDER BOTTOM (Blue Glow) */}
        <div
          className="absolute h-px bg-tron-blue"
          style={{
            filter: 'drop-shadow(0 0 5px #0099ff)',
            top: `${bottomBorderTop - 12}px`,
            left: `${12 + (width - 24 - (bottomBorderWidth - 24)) / 2}px`,
            width: animationStep === 0 ? '0px' : `${Math.max(0, bottomBorderWidth - 24)}px`,
            transition: showContent ? 
              'width 0.4s ease-out, left 0.4s ease-out, top 0.4s ease-out' : 
              'width 0.7s ease-out 0.05s',
          }}
        />

        {/* INNER BORDER RIGHT (Blue Glow) */}
        <div
          className="absolute w-px bg-tron-blue"
          style={{
            filter: 'drop-shadow(0 0 5px #0099ff)',
            right: '12px',
            top: '12px',
            height: animationStep === 0 ? '0px' : `${sidesBorderHeight - 24}px`,
            transition: showContent ? 'height 0.4s ease-out' : 'height 0.7s ease-out 0.75s',
          }}
        />

        {/* INNER BORDER TOP (Blue Glow) */}
        <div
          className="absolute h-px bg-tron-blue"
          style={{
            filter: 'drop-shadow(0 0 5px #0099ff)',
            top: '12px',
            left: `${12 + (scrollState.hideTop && !scrollState.isAtTop ? (width - 24) / 2 : 0)}px`,
            width: animationStep === 0 ? '0px' : 
                   (scrollState.hideTop && !scrollState.isAtTop ? '0px' : `${width - 24}px`),
            transition: showContent ? 
              'width 0.3s ease-out, left 0.3s ease-out' : 
              'width 0.7s ease-out 0.75s',
          }}
        />

        {/* CORNER ACCENTS - Only show when borders are visible */}
        {[
          { side: 'top-left', top: '0px', left: '0px', delay: '1.05s', hideCondition: scrollState.hideTop && !scrollState.isAtTop },
          { side: 'top-right', top: '0px', right: '0px', delay: '1.1s', hideCondition: scrollState.hideTop && !scrollState.isAtTop },
          { side: 'bottom-left', bottom: '0px', left: '0px', delay: '1.15s', hideCondition: scrollState.hideBottom && !scrollState.isAtBottom },
          { side: 'bottom-right', bottom: '0px', right: '0px', delay: '1.2s', hideCondition: scrollState.hideBottom && !scrollState.isAtBottom },
        ].map((corner, idx) => {
          const shouldShow = animationStep !== 0 && !corner.hideCondition;
          const isBottomCorner = corner.side.includes('bottom');

          return (
            <div
              key={idx}
              className="absolute w-10 h-10"
              style={{
                ...corner,
                ...(isBottomCorner && { 
                  bottom: 'auto',
                  top: `${bottomBorderTop - (corner.side.includes('bottom') ? 40 : 0)}px` 
                }),
                opacity: shouldShow ? 1 : 0,
                transition: showContent ? 
                  `opacity 0.3s ease-out${isBottomCorner ? ', top 0.4s ease-out' : ''}` : 
                  `opacity 0.3s ease-out ${corner.delay}`,
              }}
            >
              <div
                className="absolute w-10 h-1 bg-tron-cyan"
                style={{ 
                  [corner.side.includes('bottom') ? 'bottom' : 'top']: 0, 
                  [corner.side.includes('right') ? 'right' : 'left']: 0, 
                  filter: 'drop-shadow(0 0 5px #00fff9)' 
                }}
              />
              <div
                className="absolute w-1 h-10 bg-tron-cyan"
                style={{ 
                  [corner.side.includes('bottom') ? 'bottom' : 'top']: 0, 
                  [corner.side.includes('right') ? 'right' : 'left']: 0, 
                  filter: 'drop-shadow(0 0 5px #00fff9)' 
                }}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}