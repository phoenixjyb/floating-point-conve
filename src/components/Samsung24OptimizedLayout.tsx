import React from 'react';

interface Samsung24OptimizedLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Layout component optimized for Samsung Galaxy S24 Ultra
 * - 6.8" Dynamic AMOLED 2X display
 * - 3120 x 1440 resolution (516 ppi)
 * - Curved edge display considerations
 * - One-handed use optimizations
 */
export function Samsung24OptimizedLayout({ children, className = "" }: Samsung24OptimizedLayoutProps) {
  return (
    <div className={`
      min-h-screen 
      safe-area-inset 
      touch-manipulation
      /* Samsung-specific optimizations */
      max-w-none
      ${className}
    `}>
      {/* Status bar safe area */}
      <div className="h-safe-top" />
      
      {/* Main content with edge padding for curved display */}
      <div className="px-4 md:px-6 lg:px-8">
        {children}
      </div>
      
      {/* Bottom safe area for gesture navigation */}
      <div className="h-safe-bottom" />
    </div>
  );
}

/**
 * Hook to detect Samsung Galaxy S24 Ultra specific features
 */
export function useSamsung24Features() {
  const [isS24Ultra, setIsS24Ultra] = React.useState(false);
  const [supportsHDR, setSupportsHDR] = React.useState(false);
  const [prefersDarkMode, setPrefersDarkMode] = React.useState(false);

  React.useEffect(() => {
    // Detect Samsung Galaxy S24 Ultra characteristics
    const checkDevice = () => {
      const userAgent = navigator.userAgent;
      const screen = window.screen;
      
      // Check for S24 Ultra screen characteristics
      const isHighRes = screen.width >= 1440 && screen.height >= 3120;
      const isLargeScreen = screen.width >= 428; // Portrait width
      const isSamsung = userAgent.includes('Samsung') || userAgent.includes('SM-');
      
      setIsS24Ultra(isHighRes && isLargeScreen);
      
      // Check for HDR support
      if ('screen' in window && 'colorDepth' in screen) {
        setSupportsHDR(screen.colorDepth >= 30);
      }
      
      // Check dark mode preference
      setPrefersDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    };

    checkDevice();
    
    // Listen for orientation changes
    window.addEventListener('orientationchange', checkDevice);
    
    return () => {
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  return {
    isS24Ultra,
    supportsHDR,
    prefersDarkMode
  };
}