'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileOrientationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [userDismissed, setUserDismissed] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isTablet = /iPad|Android/i.test(navigator.userAgent) && 'ontouchstart' in window;
      const isMobileDevice = isMobile || isTablet;
      
      if (isMobileDevice) {
        const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
        setIsLandscape(orientation === 'landscape');
        
        // Show prompt if in portrait mode and user hasn't dismissed it
        if (orientation === 'portrait' && !userDismissed) {
          setShowPrompt(true);
        } else {
          setShowPrompt(false);
        }
      }
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', () => {
      setTimeout(checkOrientation, 100);
    });

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, [userDismissed]);

  const handleDismiss = () => {
    // check if device can rotate
    if (screen.orientation && screen.orientation.lock) {
      // try to lock to landscape
      screen.orientation.lock('landscape').then(() => {
        // success - device rotated
        setUserDismissed(true);
        setShowPrompt(false);
      }).catch((error) => {
        // failed - device might be locked or doesn't support it
        console.log('Rotation failed:', error);
        // just dismiss without alert - let user manually rotate
        setUserDismissed(true);
        setShowPrompt(false);
      });
    } else {
      // no rotation api available - just dismiss
      setUserDismissed(true);
      setShowPrompt(false);
    }
  };

  const handleEnterAnyway = () => {
    setUserDismissed(true);
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black flex items-center justify-center"
        style={{ zIndex: 9999 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-tron-darker border-2 border-tron-cyan p-6 max-w-sm mx-4 text-center"
        >
          {/* Phone rotation animation - More realistic phone */}
          <motion.div
            animate={{ rotate: [0, 90, 0] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="w-20 h-32 mx-auto mb-4 relative"
          >
            {/* Phone body */}
            <div className="w-full h-full bg-gray-800 border-2 border-tron-cyan rounded-2xl relative overflow-hidden">
              {/* Screen */}
              <div className="absolute inset-1 bg-black rounded-xl border border-tron-cyan/30">
                <div className="w-full h-full bg-tron-cyan/5 flex items-center justify-center">
                  <div className="text-tron-cyan text-xs font-mono">GEORGE</div>
                </div>
              </div>
              
              {/* Home button */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-gray-600 rounded-full"></div>
              
              {/* Speaker */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gray-600 rounded-full"></div>
              
              {/* Camera */}
              <div className="absolute top-3 right-3 w-2 h-2 bg-gray-600 rounded-full"></div>
            </div>
          </motion.div>

          <h2 className="text-tron-cyan font-mono text-lg mb-2">
            ORIENTATION <span className="text-tron-blue">.REQUIRED</span>
          </h2>
          
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            For the optimal cyberpunk experience, please rotate your device to landscape mode.
          </p>

          <div className="space-y-3">
            <button
              onClick={handleDismiss}
              className="w-full bg-tron-cyan text-black font-mono text-sm py-2 px-4 border border-tron-cyan hover:bg-tron-cyan/80 transition-colors"
            >
              ROTATE DEVICE
            </button>
            
            <button
              onClick={handleEnterAnyway}
              className="w-full border border-tron-cyan text-tron-cyan font-mono text-sm py-2 px-4 hover:bg-tron-cyan/10 transition-colors"
            >
              ENTER ANYWAY
            </button>
          </div>

          <p className="text-gray-500 text-xs mt-4 font-mono">
            TAP SCREEN TO CONTINUE
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
