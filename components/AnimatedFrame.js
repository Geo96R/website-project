'use client';

import { useEffect, useState } from 'react';

export default function AnimatedFrame() {
  const [animationProgress, setAnimationProgress] = useState(0); // 0 to 1 for single continuous animation
  const [showContent, setShowContent] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [isClient, setIsClient] = useState(false);
  const [lockedDocumentHeight, setLockedDocumentHeight] = useState(0); // Lock height after intro
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
        hideBottom: false, // Never hide bottom border on scroll - only show at bottom
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

    // Single continuous animation - start from bottom-left, go clockwise
    // Wait for dimensions to be calculated before starting animation
    let animationFrameId = null;
    let animationTimeout = null;
    
    if (containerDimensions.width > 0 && !showContent) {
      const animationDuration = 800; // Total duration in ms for smooth single motion
      
      const animate = () => {
        const startTime = Date.now();
        
        const animateLoop = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / animationDuration, 1);
          setAnimationProgress(progress);
          
          if (progress < 1) {
            animationFrameId = requestAnimationFrame(animateLoop);
          } else {
            // Lock document height when intro animation completes
            const currentHeight = getActualContentHeight();
            setLockedDocumentHeight(currentHeight);
            setShowContent(true);
            handleScroll(); // Initial scroll check
          }
        };
        
        // Small delay to ensure dimensions are set
        animationTimeout = setTimeout(() => {
          animationFrameId = requestAnimationFrame(animateLoop);
        }, 50);
      };
      
      animate();
    }

    // Initial scroll check and periodic updates for dynamic content
    handleScroll();
    const heightCheckInterval = setInterval(handleScroll, 1000); // Check every second

    return () => {
      clearInterval(heightCheckInterval);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (animationTimeout) {
        clearTimeout(animationTimeout);
      }
      window.removeEventListener('resize', calculateDimensions);
      window.removeEventListener('orientationchange', calculateDimensions);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleZoom);
    };
  }, [isClient, containerDimensions.width, showContent]);

  // --- Layout Math ---
  const borderOffset = 20;

  // Responsive border offset for smaller screens
  const responsiveBorderOffset = containerDimensions.width < 600 ? 12 : borderOffset;

  // Center positioning
  const left = `calc(50vw - ${containerDimensions.width / 2}px - ${responsiveBorderOffset}px)`;
  const top = `0px`;

  const width = containerDimensions.width + responsiveBorderOffset * 2;
  const frameHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

  // Use locked document height after intro, otherwise use calculated height
  const documentHeight = showContent && lockedDocumentHeight > 0 ? lockedDocumentHeight :
    (scrollState.documentHeight > 0 ? scrollState.documentHeight : 
      (typeof window !== 'undefined' ? 
        Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight,
          frameHeight
        ) : frameHeight));

  // Left and right border heights should extend to full document height when scrolling
  const sidesBorderHeight = scrollState.isAtBottom ? documentHeight : Math.max(documentHeight, frameHeight);

  // Calculate border progressions for single continuous animation
  // Animation goes: bottom-left -> up (left border) -> right (top border) -> down (right border) -> left (bottom border)
  // Only calculate if we have valid dimensions
  let leftProgress = 0;
  let topProgress = 0;
  let rightProgress = 0;
  let bottomProgress = 0;
  
  if (width > 0 && sidesBorderHeight > 0) {
    // Total perimeter = 2 * (width + height)
    const perimeter = 2 * (width + sidesBorderHeight);
    
    // Calculate progress for each border segment based on animation progress
    // Left border: 0 to height/perimeter (grows from bottom to top)
    // Top border: height/perimeter to (height + width)/perimeter (grows from left to right)
    // Right border: (height + width)/perimeter to (2*height + width)/perimeter (grows from top to bottom)
    // Bottom border: (2*height + width)/perimeter to 1 (grows from right to left)
    
    const currentDistance = animationProgress * perimeter;
    
    // Left border progress (0 to height)
    leftProgress = Math.min(1, Math.max(0, currentDistance / sidesBorderHeight));
    
    // Top border progress (height to height + width)
    topProgress = Math.min(1, Math.max(0, (currentDistance - sidesBorderHeight) / width));
    
    // Right border progress (height + width to 2*height + width)
    rightProgress = Math.min(1, Math.max(0, (currentDistance - sidesBorderHeight - width) / sidesBorderHeight));
    
    // Bottom border progress (2*height + width to perimeter)
    bottomProgress = Math.min(1, Math.max(0, (currentDistance - 2 * sidesBorderHeight - width) / width));
  }
  
  // After intro animation, use simple border system
  // Bottom border is always at the bottom of the frame, only shows when at bottom of page
  const bottomBorderTop = documentHeight - 2; // For intro animation only
  const bottomBorderWidth = showContent ? (scrollState.isAtBottom ? width : 0) : (width * bottomProgress); // Use progress during intro

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
        {/* LEFT BORDER (Cyan) - Starts from bottom-left, goes up */}
        <div
          className="absolute w-0.5 bg-tron-cyan"
          style={{
            filter: 'drop-shadow(0 0 10px #00fff9)',
            left: '0px',
            bottom: '0px', // Start from bottom
            height: showContent ? `${sidesBorderHeight}px` : `${sidesBorderHeight * leftProgress}px`,
            transition: showContent ? 'height 0.4s ease-out' : 'none', // No transition during intro for smooth animation
          }}
        />

        {/* BOTTOM BORDER (Cyan) - Last segment, goes left from bottom-right */}
        <div
          className="absolute h-0.5 bg-tron-cyan"
          style={{
            filter: 'drop-shadow(0 0 10px #00fff9)',
            bottom: '0px',
            right: '0px', // Start from right
            width: showContent ? (scrollState.isAtBottom ? `${width}px` : '0px') : `${width * bottomProgress}px`,
            transition: showContent ? 'width 0.3s ease-out' : 'none', // No transition during intro
          }}
        />

        {/* RIGHT BORDER (Cyan) - Goes down from top-right */}
        <div
          className="absolute w-0.5 bg-tron-cyan"
          style={{
            filter: 'drop-shadow(0 0 10px #00fff9)',
            right: '0px',
            top: '0px', // Start from top
            height: showContent ? `${sidesBorderHeight}px` : `${sidesBorderHeight * rightProgress}px`,
            transition: showContent ? 'height 0.4s ease-out' : 'none', // No transition during intro
          }}
        />

        {/* TOP BORDER (Cyan) - Goes right from top-left */}
        <div
          className="absolute h-0.5 bg-tron-cyan"
          style={{
            filter: 'drop-shadow(0 0 10px #00fff9)',
            top: '0px',
            left: showContent && scrollState.hideTop && !scrollState.isAtTop ? `${width / 2}px` : '0px', // Retract to center when scrolling
            width: showContent ? 
              (scrollState.hideTop && !scrollState.isAtTop ? '0px' : `${width}px`) : 
              `${width * topProgress}px`,
            transition: showContent ? 
              'width 0.3s ease-out, left 0.3s ease-out' : 
              'none', // No transition during intro
          }}
        />

        {/* INNER BORDER LEFT (Blue Glow) - Starts from bottom-left */}
        <div
          className="absolute w-px bg-tron-blue"
          style={{
            filter: 'drop-shadow(0 0 5px #0099ff)',
            left: '12px',
            bottom: '12px', // Start from bottom
            height: showContent ? `${sidesBorderHeight - 24}px` : `${(sidesBorderHeight - 24) * leftProgress}px`,
            transition: showContent ? 'height 0.4s ease-out' : 'none',
          }}
        />

        {/* INNER BORDER BOTTOM (Blue Glow) - Last segment, goes left from bottom-right */}
        <div
          className="absolute h-px bg-tron-blue"
          style={{
            filter: 'drop-shadow(0 0 5px #0099ff)',
            bottom: '12px',
            right: '12px', // Start from right
            width: showContent ? (scrollState.isAtBottom ? `${width - 24}px` : '0px') : `${(width - 24) * bottomProgress}px`,
            transition: showContent ? 'width 0.3s ease-out' : 'none',
          }}
        />

        {/* INNER BORDER RIGHT (Blue Glow) - Goes down from top-right */}
        <div
          className="absolute w-px bg-tron-blue"
          style={{
            filter: 'drop-shadow(0 0 5px #0099ff)',
            right: '12px',
            top: '12px', // Start from top
            height: showContent ? `${sidesBorderHeight - 24}px` : `${(sidesBorderHeight - 24) * rightProgress}px`,
            transition: showContent ? 'height 0.4s ease-out' : 'none',
          }}
        />

        {/* INNER BORDER TOP (Blue Glow) - Goes right from top-left */}
        <div
          className="absolute h-px bg-tron-blue"
          style={{
            filter: 'drop-shadow(0 0 5px #0099ff)',
            top: '12px',
            left: showContent && scrollState.hideTop && !scrollState.isAtTop ? `${12 + (width - 24) / 2}px` : '12px',
            width: showContent ? 
              (scrollState.hideTop && !scrollState.isAtTop ? '0px' : `${width - 24}px`) : 
              `${(width - 24) * topProgress}px`,
            transition: showContent ? 
              'width 0.3s ease-out, left 0.3s ease-out' : 
              'none',
          }}
        />

        {/* CORNER ACCENTS - Show when animation completes */}
        {[
          { side: 'top-left', top: '0px', left: '0px', hideCondition: scrollState.hideTop && !scrollState.isAtTop },
          { side: 'top-right', top: '0px', right: '0px', hideCondition: scrollState.hideTop && !scrollState.isAtTop },
          { side: 'bottom-left', bottom: '0px', left: '0px', hideCondition: !scrollState.isAtBottom },
          { side: 'bottom-right', bottom: '0px', right: '0px', hideCondition: !scrollState.isAtBottom },
        ].map((corner, idx) => {
          const shouldShow = animationProgress >= 1 && !corner.hideCondition;

          return (
            <div
              key={idx}
              className="absolute w-10 h-10"
              style={{
                ...corner,
                opacity: shouldShow ? 1 : 0,
                transition: showContent ? 
                  'opacity 0.3s ease-out' : 
                  'opacity 0.2s ease-out',
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