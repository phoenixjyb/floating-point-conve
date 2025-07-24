import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FLOAT_FORMATS, type FloatFormat } from "@/lib/floatingPoint";

interface FormatSelectorProps {
  selectedFormat: string;
  onFormatChange: (format: string) => void;
}

export function FormatSelector({ selectedFormat, onFormatChange }: FormatSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Floating Point Format</h2>
      
      <Tabs value={selectedFormat} onValueChange={onFormatChange}>
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          {Object.entries(FLOAT_FORMATS).map(([key, format]) => (
            <TabsTrigger key={key} value={key} className="text-xs">
              {key.toUpperCase()}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      {/* Format details */}
      <div className="p-4 bg-secondary rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>{FLOAT_FORMATS[selectedFormat].name}</strong>
            <p className="text-muted-foreground mt-1">
              {FLOAT_FORMATS[selectedFormat].description}
            </p>
          </div>
          <div className="space-y-1">
            <div>Total bits: <span className="font-mono">{FLOAT_FORMATS[selectedFormat].totalBits}</span></div>
            <div>Sign: <span className="font-mono">{FLOAT_FORMATS[selectedFormat].signBits}</span> bit</div>
            <div>Exponent: <span className="font-mono">{FLOAT_FORMATS[selectedFormat].exponentBits}</span> bits</div>
            <div>Mantissa: <span className="font-mono">{FLOAT_FORMATS[selectedFormat].mantissaBits}</span> bits</div>
            <div>Bias: <span className="font-mono">{FLOAT_FORMATS[selectedFormat].bias}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}