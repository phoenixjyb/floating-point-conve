import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { FormatSelector } from "@/components/FormatSelector";
import { ConversionCard } from "@/components/ConversionCard";
import { BitVisualization } from "@/components/BitVisualization";
import { ValueRange } from "@/components/ValueRange";
import { PWAInstall } from "@/components/PWAInstall";
import { AdaptiveLayout, AdaptiveHeader, AdaptiveContent } from "@/components/AdaptiveLayout";
import { FLOAT_FORMATS } from "@/lib/floatingPoint";

function App() {
  const [selectedFormat, setSelectedFormat] = useState("fp32");
  const [currentBinary, setCurrentBinary] = useState("");

  const format = FLOAT_FORMATS[selectedFormat];

  return (
    <AdaptiveLayout>
      <PWAInstall />
      <div className="container mx-auto py-6 max-w-6xl keyboard-adjust">
        <AdaptiveHeader 
          title="Cool FP Converter"
          subtitle="Convert between binary, hex, and decimal across multiple floating-point formats"
        />

        <AdaptiveContent>
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
        </AdaptiveContent>
      </div>
      
      <Toaster />
    </AdaptiveLayout>
  );
}

export default App;