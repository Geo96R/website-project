'use client';

import { useState, useEffect } from 'react';

export const useViewport = () => {
  const [viewport, setViewport] = useState({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLandscape: false,
    deviceType: 'unknown'
  });

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isLandscape = width > height;
      
      // device detection
      const isMobile = width <= 768;
      const isTablet = width > 768 && width <= 1024;
      const isDesktop = width > 1024;
      
      // device type based on screen size
      let deviceType = 'unknown';
      if (width <= 480) deviceType = 'small-mobile';
      else if (width <= 768) deviceType = 'mobile';
      else if (width <= 1024) deviceType = 'tablet';
      else if (width <= 1440) deviceType = 'laptop';
      else if (width <= 1920) deviceType = 'desktop';
      else deviceType = 'large-desktop';

      setViewport({
        width,
        height,
        isMobile,
        isTablet,
        isDesktop,
        isLandscape,
        deviceType
      });
    };

    // initial call
    updateViewport();

    // add event listeners
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', () => {
      // delay to get correct dimensions after rotation
      setTimeout(updateViewport, 100);
    });

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, []);

  return viewport;
};
