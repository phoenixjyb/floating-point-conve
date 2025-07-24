import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { FormatSelector } from "@/components/FormatSelector";
import { ConversionCard } from "@/components/ConversionCard";
import { BitVisualization } from "@/components/BitVisualization";
import { ValueRange } from "@/components/ValueRange";
import { FLOAT_FORMATS } from "@/lib/floatingPoint";

function App() {
  const [selectedFormat, setSelectedFormat] = useState("fp32");
  const [currentBinary, setCurrentBinary] = useState("");

  const format = FLOAT_FORMATS[selectedFormat];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Data Conversion App</h1>
          <p className="text-lg text-muted-foreground">
            Convert between binary and decimal representations across multiple floating-point formats
          </p>
        </header>

        <div className="space-y-8">
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