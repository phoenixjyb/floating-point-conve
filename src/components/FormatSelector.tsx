import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FLOAT_FORMATS, type FloatFormat } from "@/lib/floatingPoint";

interface FormatSelectorProps {
  selectedFormat: string;
  onFormatChange: (format: string) => void;
}

export function FormatSelector({ selectedFormat, onFormatChange }: FormatSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-samsung-large font-semibold">Floating Point Format</h2>
      
      <Tabs value={selectedFormat} onValueChange={onFormatChange}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 gap-2 h-auto p-2">
          {Object.entries(FLOAT_FORMATS).map(([key, format]) => (
            <TabsTrigger 
              key={key} 
              value={key} 
              className="text-samsung-optimized font-medium tap-target button-enhanced data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {key.toUpperCase()}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      {/* Format details */}
      <div className="p-6 bg-secondary rounded-lg card-spacing-optimized">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-samsung-optimized">
          <div>
            <strong className="text-samsung-large">{FLOAT_FORMATS[selectedFormat].name}</strong>
            <p className="text-muted-foreground mt-2 leading-relaxed">
              {FLOAT_FORMATS[selectedFormat].description}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total bits:</span>
              <span className="font-mono font-semibold">{FLOAT_FORMATS[selectedFormat].totalBits}</span>
            </div>
            <div className="flex justify-between">
              <span>Sign:</span>
              <span className="font-mono font-semibold">{FLOAT_FORMATS[selectedFormat].signBits} bit</span>
            </div>
            <div className="flex justify-between">
              <span>Exponent:</span>
              <span className="font-mono font-semibold">{FLOAT_FORMATS[selectedFormat].exponentBits} bits</span>
            </div>
            <div className="flex justify-between">
              <span>Mantissa:</span>
              <span className="font-mono font-semibold">{FLOAT_FORMATS[selectedFormat].mantissaBits} bits</span>
            </div>
            <div className="flex justify-between">
              <span>Bias:</span>
              <span className="font-mono font-semibold">{FLOAT_FORMATS[selectedFormat].bias}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}