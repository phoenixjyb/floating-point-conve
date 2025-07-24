import React from 'react';

interface ResponsiveAndroidLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Universal Android-adaptive layout component
 * Optimized for multiple Android devices and form factors:
 * - Phones: 5" to 7" displays (360px to 428px width)
 * - Tablets: 7" to 12" displays
 * - Foldables: Both folded and unfolded states
 * - Different aspect ratios and pixel densities
 */
export function ResponsiveAndroidLayout({ children, className = "" }: ResponsiveAndroidLayoutProps) {
  return (
    <div className={`
      min-h-screen 
      safe-area-inset 
      touch-manipulation
      adaptive-layout
      max-w-none
      ${className}
    `}>
      {/* Status bar safe area */}
      <div className="h-safe-top" />
      
      {/* Main content with adaptive padding */}
      <div className="adaptive-padding">
        {children}
      </div>
      
      {/* Bottom safe area for gesture navigation */}
      <div className="h-safe-bottom" />
    </div>
  );
}

/**
 * Hook to detect Android device characteristics and capabilities
 */
export function useAndroidFeatures() {
  const [deviceInfo, setDeviceInfo] = React.useState({
    screenSize: 'medium' as 'small' | 'medium' | 'large' | 'xlarge',
    density: 'mdpi' as 'ldpi' | 'mdpi' | 'hdpi' | 'xhdpi' | 'xxhdpi' | 'xxxhdpi',
    isTablet: false,
    isFoldable: false,
    supportsHDR: false,
    prefersDarkMode: false,
    hasNotch: false,
    orientation: 'portrait' as 'portrait' | 'landscape'
  });

  React.useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent;
      const screen = window.screen;
      const viewport = {
        width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
        height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
      };

      // Determine screen size category
      let screenSize: typeof deviceInfo.screenSize = 'medium';
      if (viewport.width < 360) screenSize = 'small';
      else if (viewport.width >= 600) screenSize = 'large';
      else if (viewport.width >= 900) screenSize = 'xlarge';

      // Estimate pixel density
      const pixelRatio = window.devicePixelRatio || 1;
      let density: typeof deviceInfo.density = 'mdpi';
      if (pixelRatio >= 4) density = 'xxxhdpi';
      else if (pixelRatio >= 3) density = 'xxhdpi';
      else if (pixelRatio >= 2) density = 'xhdpi';
      else if (pixelRatio >= 1.5) density = 'hdpi';
      else if (pixelRatio < 1) density = 'ldpi';

      // Detect tablet vs phone
      const isTablet = screenSize === 'large' || screenSize === 'xlarge' || 
                      (viewport.width >= 600 && viewport.height >= 800);

      // Detect foldable devices
      const isFoldable = userAgent.includes('Fold') || 
                        userAgent.includes('Flip') || 
                        (screen.width > 1800 && screen.height > 2400);

      // Check for HDR support
      const supportsHDR = screen.colorDepth >= 30 || 
                         (window as any).screen?.colorGamut === 'p3';

      // Check dark mode preference
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

      // Detect notch/cutout (approximate)
      const hasNotch = viewport.height < screen.height * 0.95;

      // Determine orientation
      const orientation = viewport.width > viewport.height ? 'landscape' : 'portrait';

      setDeviceInfo({
        screenSize,
        density,
        isTablet,
        isFoldable,
        supportsHDR,
        prefersDarkMode,
        hasNotch,
        orientation
      });
    };

    detectDevice();
    
    // Listen for screen changes
    const handleResize = () => detectDevice();
    const handleOrientationChange = () => {
      // Delay to allow viewport to update
      setTimeout(detectDevice, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return deviceInfo;
}