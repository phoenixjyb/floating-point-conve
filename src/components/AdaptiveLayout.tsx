import React from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

interface AdaptiveLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Intelligent adaptive layout that optimizes for specific devices
 * - Samsung S24 Ultra: Premium optimization with specific spacing and typography
 * - Other Android devices: Universal responsive design
 * - iOS devices: iOS-specific adaptations
 * - Desktop: Standard responsive layout
 */
export function AdaptiveLayout({ children, className = "" }: AdaptiveLayoutProps) {
  const deviceInfo = useDeviceDetection();

  // Samsung S24 Ultra specific optimization
  if (deviceInfo.isSamsungS24Ultra) {
    return (
      <div className={`
        min-h-screen 
        bg-background 
        touch-manipulation 
        safe-area-inset
        samsung-s24-optimized
        ${className}
      `}>
        {/* S24 Ultra status bar (44px) */}
        <div className="h-11" />
        
        {/* Optimized content area for S24 Ultra */}
        <div className="samsung-s24-container">
          {children}
        </div>
        
        {/* S24 Ultra gesture navigation area (34px) */}
        <div className="h-8" />
      </div>
    );
  }

  // Android tablet optimization
  if (deviceInfo.isAndroid && deviceInfo.isTablet) {
    return (
      <div className={`
        min-h-screen 
        bg-background 
        touch-manipulation 
        android-tablet-layout
        ${className}
      `}>
        <div className="h-safe-top" />
        <div className="android-tablet-container">
          {children}
        </div>
        <div className="h-safe-bottom" />
      </div>
    );
  }

  // Android foldable optimization
  if (deviceInfo.isAndroid && deviceInfo.isFoldable) {
    return (
      <div className={`
        min-h-screen 
        bg-background 
        touch-manipulation 
        foldable-layout
        ${deviceInfo.orientation === 'landscape' ? 'foldable-landscape' : 'foldable-portrait'}
        ${className}
      `}>
        <div className="h-safe-top" />
        <div className="foldable-container">
          {children}
        </div>
        <div className="h-safe-bottom" />
      </div>
    );
  }

  // Standard Android phone optimization
  if (deviceInfo.isAndroid) {
    return (
      <div className={`
        min-h-screen 
        bg-background 
        touch-manipulation 
        android-phone-layout
        screen-${deviceInfo.screenSize}
        ${className}
      `}>
        <div className="h-safe-top" />
        <div className="android-phone-container">
          {children}
        </div>
        <div className="h-safe-bottom" />
      </div>
    );
  }

  // iOS optimization
  if (deviceInfo.isIOS) {
    return (
      <div className={`
        min-h-screen 
        bg-background 
        touch-manipulation 
        ios-layout
        ${deviceInfo.isTablet ? 'ios-tablet' : 'ios-phone'}
        ${className}
      `}>
        <div className="h-safe-top" />
        <div className="ios-container">
          {children}
        </div>
        <div className="h-safe-bottom" />
      </div>
    );
  }

  // Desktop/default fallback
  return (
    <div className={`
      min-h-screen 
      bg-background 
      desktop-layout
      ${className}
    `}>
      <div className="desktop-container">
        {children}
      </div>
    </div>
  );
}

/**
 * Device-specific header component with adaptive styling
 */
export function AdaptiveHeader({ title, subtitle }: { title: string; subtitle: string }) {
  const deviceInfo = useDeviceDetection();

  // Samsung S24 Ultra premium typography
  if (deviceInfo.isSamsungS24Ultra) {
    return (
      <header className="text-center mb-6 samsung-s24-header">
        <h1 className="text-samsung-xl font-bold mb-2 samsung-s24-title">{title}</h1>
        <p className="text-samsung-optimized text-muted-foreground samsung-s24-subtitle">
          {subtitle}
        </p>
      </header>
    );
  }

  // Android tablet larger typography
  if (deviceInfo.isAndroid && deviceInfo.isTablet) {
    return (
      <header className="text-center mb-8 android-tablet-header">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">{title}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      </header>
    );
  }

  // Foldable specific layout
  if (deviceInfo.isFoldable) {
    return (
      <header className="text-center mb-6 foldable-header">
        <h1 className="text-2xl md:text-4xl font-bold mb-2">{title}</h1>
        <p className="text-base md:text-lg text-muted-foreground">
          {subtitle}
        </p>
      </header>
    );
  }

  // Standard responsive header
  return (
    <header className="text-center mb-6">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">{title}</h1>
      <p className="text-sm md:text-base text-muted-foreground">
        {subtitle}
      </p>
    </header>
  );
}

/**
 * Device-adaptive content spacing component
 */
export function AdaptiveContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const deviceInfo = useDeviceDetection();

  let spacingClass = "space-y-6"; // default

  if (deviceInfo.isSamsungS24Ultra) {
    spacingClass = "space-y-samsung-optimized";
  } else if (deviceInfo.isAndroid && deviceInfo.isTablet) {
    spacingClass = "space-y-8";
  } else if (deviceInfo.isFoldable) {
    spacingClass = deviceInfo.orientation === 'landscape' ? "space-y-4" : "space-y-6";
  } else if (deviceInfo.isAndroid && deviceInfo.screenSize === 'small') {
    spacingClass = "space-y-4";
  }

  return (
    <div className={`${spacingClass} ${className}`}>
      {children}
    </div>
  );
}
