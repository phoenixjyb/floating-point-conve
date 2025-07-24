import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { type FloatFormat, getBitBreakdown } from "@/lib/floatingPoint";

interface BitVisualizationProps {
  binary: string;
  format: FloatFormat;
}

export function BitVisualization({ binary, format }: BitVisualizationProps) {
  if (!binary) return null;
  
  const paddedBinary = binary.padStart(format.totalBits, '0').slice(-format.totalBits);
  const breakdown = getBitBreakdown(paddedBinary, format);
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Bit Breakdown</h3>
      
      <div className="space-y-4">
        {/* Visual bit representation */}
        <div className="flex flex-wrap items-center gap-1 font-mono text-lg">
          {/* Sign bit */}
          <div className="flex flex-col items-center">
            <Badge variant="destructive" className="mb-1 text-xs">S</Badge>
            <span className="px-2 py-1 bg-red-100 text-red-800 rounded font-bold">
              {breakdown.sign}
            </span>
          </div>
          
          {/* Separator */}
          <div className="mx-2 text-muted-foreground">|</div>
          
          {/* Exponent bits */}
          <div className="flex flex-col items-center">
            <Badge variant="default" className="mb-1 text-xs">EXP</Badge>
            <div className="flex">
              {breakdown.exponent.split('').map((bit, index) => (
                <span 
                  key={index}
                  className="px-1 py-1 bg-blue-100 text-blue-800 rounded mx-0.5 font-bold"
                >
                  {bit}
                </span>
              ))}
            </div>
          </div>
          
          {/* Separator */}
          <div className="mx-2 text-muted-foreground">|</div>
          
          {/* Mantissa bits */}
          <div className="flex flex-col items-center">
            <Badge variant="secondary" className="mb-1 text-xs">MANTISSA</Badge>
            <div className="flex flex-wrap">
              {breakdown.mantissa.split('').map((bit, index) => (
                <span 
                  key={index}
                  className="px-1 py-1 bg-green-100 text-green-800 rounded mx-0.5 mb-1 font-bold"
                >
                  {bit}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bit information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-red-50 rounded-lg">
            <div className="font-semibold text-red-800">Sign Bit</div>
            <div className="text-red-600">
              Value: {breakdown.signValue} ({breakdown.signValue === 0 ? 'Positive' : 'Negative'})
            </div>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="font-semibold text-blue-800">Exponent ({format.exponentBits} bits)</div>
            <div className="text-blue-600">
              Raw: {breakdown.exponentValue}
            </div>
            <div className="text-blue-600">
              Biased: {breakdown.exponentValue - format.bias}
            </div>
          </div>
          
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="font-semibold text-green-800">Mantissa ({format.mantissaBits} bits)</div>
            <div className="text-green-600">
              Raw: {breakdown.mantissaValue}
            </div>
            <div className="text-green-600">
              Fraction: {breakdown.mantissaValue / Math.pow(2, format.mantissaBits)}
            </div>
          </div>
        </div>
        
        {/* Format info */}
        <div className="p-3 bg-muted rounded-lg">
          <div className="text-sm text-muted-foreground">
            <strong>{format.name}</strong> - {format.description}
            <br />
            Total bits: {format.totalBits}, Bias: {format.bias}
          </div>
        </div>
      </div>
    </Card>
  );
}