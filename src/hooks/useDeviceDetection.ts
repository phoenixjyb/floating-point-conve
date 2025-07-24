import { useState, useEffect } from 'react';

export interface DeviceInfo {
  isSamsungS24Ultra: boolean;
  isAndroid: boolean;
  isIOS: boolean;
  isTablet: boolean;
  isFoldable: boolean;
  screenSize: 'small' | 'medium' | 'large' | 'xlarge';
  orientation: 'portrait' | 'landscape';
  pixelRatio: number;
  viewportWidth: number;
  viewportHeight: number;
  supportsTouch: boolean;
  prefersDarkMode: boolean;
}

/**
 * Advanced device detection hook for optimal Android adaptation
 * Specifically detects Samsung S24 Ultra for premium optimization
 */
export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isSamsungS24Ultra: false,
    isAndroid: false,
    isIOS: false,
    isTablet: false,
    isFoldable: false,
    screenSize: 'medium',
    orientation: 'portrait',
    pixelRatio: 1,
    viewportWidth: 0,
    viewportHeight: 0,
    supportsTouch: false,
    prefersDarkMode: false,
  });

  useEffect(() => {
    const detectDevice = () => {
      const ua = navigator.userAgent;
      const isAndroid = /Android/i.test(ua);
      const isIOS = /iPad|iPhone|iPod/i.test(ua);
      
      // Samsung S24 Ultra specific detection
      const isSamsungS24Ultra = detectSamsungS24Ultra(ua);
      
      // Screen dimensions and characteristics
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const pixelRatio = window.devicePixelRatio || 1;
      
      // Screen size classification
      const screenSize = classifyScreenSize(viewportWidth, isAndroid);
      
      // Tablet detection (more sophisticated for Android)
      const isTablet = detectTablet(viewportWidth, viewportHeight, ua);
      
      // Foldable detection
      const isFoldable = detectFoldable(ua, viewportWidth, viewportHeight);
      
      // Orientation
      const orientation = viewportWidth > viewportHeight ? 'landscape' : 'portrait';
      
      // Touch support
      const supportsTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Dark mode preference
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

      setDeviceInfo({
        isSamsungS24Ultra,
        isAndroid,
        isIOS,
        isTablet,
        isFoldable,
        screenSize,
        orientation,
        pixelRatio,
        viewportWidth,
        viewportHeight,
        supportsTouch,
        prefersDarkMode,
      });
    };

    // Initial detection
    detectDevice();

    // Listen for changes
    const handleResize = () => detectDevice();
    const handleOrientationChange = () => {
      // Delay to get accurate dimensions after rotation
      setTimeout(detectDevice, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Listen for dark mode changes
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleDarkModeChange = () => detectDevice();
    darkModeQuery.addEventListener('change', handleDarkModeChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      darkModeQuery.removeEventListener('change', handleDarkModeChange);
    };
  }, []);

  return deviceInfo;
}

/**
 * Samsung Galaxy S24 Ultra specific detection
 * Checks for device characteristics specific to S24 Ultra
 */
function detectSamsungS24Ultra(userAgent: string): boolean {
  // Check for Samsung device
  if (!/Samsung|SM-/i.test(userAgent)) {
    return false;
  }

  // S24 Ultra model identifiers
  const s24UltraModels = [
    'SM-S928',  // S24 Ultra model code prefix
    'Galaxy S24 Ultra',
    'SM-S928B', // International
    'SM-S928U', // US
    'SM-S928N', // Korea
  ];

  const hasS24UltraIdentifier = s24UltraModels.some(model => 
    userAgent.includes(model)
  );

  if (hasS24UltraIdentifier) {
    return true;
  }

  // Fallback: Check screen characteristics specific to S24 Ultra
  // S24 Ultra: 1440x3120 pixels, 6.8" display, ~501 PPI
  const width = window.screen.width;
  const height = window.screen.height;
  const pixelRatio = window.devicePixelRatio || 1;
  
  // S24 Ultra physical dimensions (accounting for pixel ratio)
  const physicalWidth = width * pixelRatio;
  const physicalHeight = height * pixelRatio;
  
  const isS24UltraResolution = (
    (physicalWidth === 1440 && physicalHeight === 3120) ||
    (physicalWidth === 3120 && physicalHeight === 1440) ||
    // Also check for common scaled resolutions
    (width === 480 && height === 1040 && pixelRatio === 3) ||
    (width === 360 && height === 780 && pixelRatio >= 3.5)
  );

  return isS24UltraResolution && /Samsung/i.test(userAgent);
}

/**
 * Classify screen size based on viewport width and platform
 */
function classifyScreenSize(width: number, isAndroid: boolean): 'small' | 'medium' | 'large' | 'xlarge' {
  if (isAndroid) {
    // Android-specific breakpoints
    if (width < 360) return 'small';        // Compact phones
    if (width < 428) return 'medium';       // Standard phones  
    if (width < 768) return 'large';        // Large phones/small tablets
    return 'xlarge';                        // Tablets/foldables
  } else {
    // General breakpoints
    if (width < 480) return 'small';
    if (width < 768) return 'medium';
    if (width < 1024) return 'large';
    return 'xlarge';
  }
}

/**
 * Enhanced tablet detection for Android devices
 */
function detectTablet(width: number, height: number, userAgent: string): boolean {
  // Check user agent for tablet indicators
  const hasTabletUA = /Tablet|iPad/i.test(userAgent);
  
  // Android tablet detection based on screen size
  const minDimension = Math.min(width, height);
  const maxDimension = Math.max(width, height);
  
  // Tablets typically have minimum 600dp width in portrait
  const isTabletSize = minDimension >= 600 || maxDimension >= 960;
  
  // Aspect ratio check (tablets are usually closer to square)
  const aspectRatio = maxDimension / minDimension;
  const isTabletAspectRatio = aspectRatio < 2.1; // Less elongated than phones
  
  return hasTabletUA || (isTabletSize && isTabletAspectRatio);
}

/**
 * Detect foldable devices
 */
function detectFoldable(userAgent: string, width: number, height: number): boolean {
  // Known foldable device patterns
  const foldablePatterns = [
    'Galaxy Fold', 'Galaxy Z', 'Surface Duo', 'Pixel Fold',
    'SM-F', // Samsung Fold series model prefix
    'SM-Z', // Samsung Z series
  ];
  
  const hasFoldableUA = foldablePatterns.some(pattern => 
    userAgent.includes(pattern)
  );
  
  // Unusual aspect ratios that might indicate foldable
  const aspectRatio = Math.max(width, height) / Math.min(width, height);
  const hasUnusualAspectRatio = aspectRatio > 2.5 || aspectRatio < 1.2;
  
  // Check for CSS environment support (foldable-specific)
  const supportsFoldableCSS = CSS.supports('(display-mode: browser)') && 
    'screen' in window && 'orientation' in window.screen;
  
  return hasFoldableUA || (hasUnusualAspectRatio && supportsFoldableCSS);
}
