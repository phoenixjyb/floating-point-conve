import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FloatFormat, formatDecimal } from "@/lib/floatingPoint";
import { Info } from "@phosphor-icons/react";

interface ValueRangeProps {
  format: FloatFormat;
}

export function ValueRange({ format }: ValueRangeProps) {
  const { range } = format;

  const formatRangeValue = (value: number): string => {
    if (Math.abs(value) >= 1e6 || (Math.abs(value) < 1e-3 && value !== 0)) {
      return value.toExponential(3);
    }
    return value.toString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="text-accent" />
          Value Range & Precision
        </CardTitle>
        <CardDescription>
          Numerical limits and precision characteristics for {format.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Representable Range</h4>
              <div className="text-sm font-mono">
                <div>Min: <span className="text-destructive">-{formatRangeValue(Math.abs(range.min))}</span></div>
                <div>Max: <span className="text-accent">+{formatRangeValue(range.max)}</span></div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Normal Range</h4>
              <div className="text-sm font-mono">
                <div>Min Normal: <span className="text-primary">{formatRangeValue(range.minNormal)}</span></div>
                <div>Max Normal: <span className="text-primary">{formatRangeValue(range.maxNormal)}</span></div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Precision</h4>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{range.precision} decimal digits</Badge>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Smallest Positive</h4>
              <div className="text-sm font-mono">
                <span className="text-muted-foreground">{formatRangeValue(range.smallestPositive)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div className="text-center">
              <div className="font-medium">{format.totalBits}</div>
              <div className="text-muted-foreground">Total Bits</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{format.exponentBits}</div>
              <div className="text-muted-foreground">Exp Bits</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{format.mantissaBits}</div>
              <div className="text-muted-foreground">Mantissa</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{format.bias}</div>
              <div className="text-muted-foreground">Bias</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}