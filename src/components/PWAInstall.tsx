import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, X } from "@phosphor-icons/react";

interface PWAInstallProps {
  onInstallPrompt?: () => void;
}

export function PWAInstall({ onInstallPrompt }: PWAInstallProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebApp = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isInWebApp);
    };

    checkInstalled();

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show install banner only for Samsung devices
      const userAgent = navigator.userAgent;
      const isSamsung = userAgent.includes('Samsung') || userAgent.includes('SM-');
      
      if (isSamsung && !isInstalled) {
        setShowInstallBanner(true);
      }
      
      onInstallPrompt?.();
    };

    const handleAppInstalled = () => {
      console.log('PWA was installed on Samsung device');
      setDeferredPrompt(null);
      setShowInstallBanner(false);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [onInstallPrompt, isInstalled]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
  };

  if (!showInstallBanner || isInstalled) {
    return null;
  }

  return (
    <Card className="fixed top-4 left-4 right-4 z-50 border-primary shadow-lg bg-card/95 backdrop-blur">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Download className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <div className="text-samsung-optimized font-semibold">Install DataConvert</div>
              <div className="text-sm text-muted-foreground">
                Optimized for Samsung Galaxy S24 Ultra
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleInstallClick}
              className="button-enhanced tap-target text-samsung-optimized"
            >
              Install
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="tap-target"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}