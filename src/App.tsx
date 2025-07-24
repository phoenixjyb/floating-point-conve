import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { FormatSelector } from "@/components/FormatSelector";
import { ConversionCard } from "@/components/ConversionCard";
import { BitVisualization } from "@/components/BitVisualization";
import { ValueRange } from "@/components/ValueRange";
import { PWAInstall } from "@/components/PWAInstall";
import { FLOAT_FORMATS } from "@/lib/floatingPoint";

function App() {
  const [selectedFormat, setSelectedFormat] = useState("fp32");
  const [currentBinary, setCurrentBinary] = useState("");

  const format = FLOAT_FORMATS[selectedFormat];

  return (
    <div className="min-h-screen bg-background touch-manipulation safe-area-inset">
      <PWAInstall />
      <div className="container mx-auto px-4 py-6 max-w-6xl keyboard-adjust">
        <header className="text-center mb-6">
          <h1 className="text-samsung-xl font-bold mb-2">Cool FP Converter</h1>
          <p className="text-samsung-optimized text-muted-foreground">
            Convert between binary, hex, and decimal across multiple floating-point formats
          </p>
        </header>

        <div className="space-y-6">
          <FormatSelector 
            selectedFormat={selectedFormat}
            onFormatChange={setSelectedFormat}
          />
          
          <ValueRange format={format} />
          
          <ConversionCard 
            format={format}
            onBinaryChange={setCurrentBinary}
          />
          
          {currentBinary && (
            <BitVisualization 
              binary={currentBinary}
              format={format}
            />
          )}
        </div>
      </div>
      
      <Toaster />
    </div>
  );
}

export default App;