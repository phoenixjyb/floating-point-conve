import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Copy } from "@phosphor-icons/react";
import { toast } from "sonner";
import { 
  binaryToDecimal, 
  decimalToBinary, 
  isValidBinary, 
  formatDecimal,
  type FloatFormat 
} from "@/lib/floatingPoint";

interface ConversionCardProps {
  format: FloatFormat;
  onBinaryChange: (binary: string) => void;
}

export function ConversionCard({ format, onBinaryChange }: ConversionCardProps) {
  const [binaryInput, setBinaryInput] = useState("");
  const [decimalInput, setDecimalInput] = useState("");
  const [binaryResult, setBinaryResult] = useState("");
  const [decimalResult, setDecimalResult] = useState("");
  const [binaryError, setBinaryError] = useState("");
  const [decimalError, setDecimalError] = useState("");

  const handleBinaryInputChange = useCallback((value: string) => {
    setBinaryInput(value);
    setBinaryError("");
    
    if (!value.trim()) {
      setBinaryResult("");
      setDecimalResult("");
      onBinaryChange("");
      return;
    }
    
    if (!isValidBinary(value)) {
      setBinaryError("Please enter only 0s and 1s");
      setBinaryResult("");
      setDecimalResult("");
      onBinaryChange("");
      return;
    }
    
    try {
      const decimal = binaryToDecimal(value, format);
      const formattedDecimal = formatDecimal(decimal);
      setDecimalResult(formattedDecimal);
      setBinaryResult(value.padStart(format.totalBits, '0').slice(-format.totalBits));
      onBinaryChange(value.padStart(format.totalBits, '0').slice(-format.totalBits));
    } catch (error) {
      setBinaryError("Invalid binary format");
      setBinaryResult("");
      setDecimalResult("");
      onBinaryChange("");
    }
  }, [format, onBinaryChange]);

  const handleDecimalInputChange = useCallback((value: string) => {
    setDecimalInput(value);
    setDecimalError("");
    
    if (!value.trim()) {
      setBinaryResult("");
      setDecimalResult("");
      onBinaryChange("");
      return;
    }
    
    const decimal = parseFloat(value);
    if (isNaN(decimal) && value.toLowerCase() !== 'nan') {
      setDecimalError("Please enter a valid number");
      setBinaryResult("");
      setDecimalResult("");
      onBinaryChange("");
      return;
    }
    
    try {
      const actualDecimal = value.toLowerCase() === 'nan' ? NaN : decimal;
      const binary = decimalToBinary(actualDecimal, format);
      setBinaryResult(binary);
      setDecimalResult(formatDecimal(actualDecimal));
      onBinaryChange(binary);
    } catch (error) {
      setDecimalError("Conversion error");
      setBinaryResult("");
      setDecimalResult("");
      onBinaryChange("");
    }
  }, [format, onBinaryChange]);

  const copyToClipboard = useCallback(async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${type} copied to clipboard`);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  }, []);

  const swapInputs = useCallback(() => {
    if (binaryResult && decimalResult) {
      setBinaryInput(binaryResult);
      setDecimalInput(decimalResult);
      handleBinaryInputChange(binaryResult);
    }
  }, [binaryResult, decimalResult, handleBinaryInputChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Format Converter
          <Button 
            variant="outline" 
            size="sm" 
            onClick={swapInputs}
            disabled={!binaryResult || !decimalResult}
          >
            <ArrowUpDown className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Binary to Decimal */}
        <div className="space-y-2">
          <Label htmlFor="binary-input">Binary Input</Label>
          <div className="flex gap-2">
            <Input
              id="binary-input"
              placeholder={`Enter binary (max ${format.totalBits} bits)`}
              value={binaryInput}
              onChange={(e) => handleBinaryInputChange(e.target.value)}
              className="font-mono"
              maxLength={format.totalBits}
            />
            {binaryResult && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(binaryResult, "Binary")}
              >
                <Copy className="w-4 h-4" />
              </Button>
            )}
          </div>
          {binaryError && (
            <Badge variant="destructive" className="text-xs">
              {binaryError}
            </Badge>
          )}
          {binaryResult && (
            <div className="p-3 bg-secondary rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Normalized Binary:</div>
              <div className="font-mono text-lg break-all">{binaryResult}</div>
            </div>
          )}
        </div>

        {/* Decimal to Binary */}
        <div className="space-y-2">
          <Label htmlFor="decimal-input">Decimal Input</Label>
          <div className="flex gap-2">
            <Input
              id="decimal-input"
              placeholder="Enter decimal number (or 'NaN', 'Infinity')"
              value={decimalInput}
              onChange={(e) => handleDecimalInputChange(e.target.value)}
              className="font-mono"
            />
            {decimalResult && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(decimalResult, "Decimal")}
              >
                <Copy className="w-4 h-4" />
              </Button>
            )}
          </div>
          {decimalError && (
            <Badge variant="destructive" className="text-xs">
              {decimalError}
            </Badge>
          )}
          {decimalResult && (
            <div className="p-3 bg-secondary rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Decimal Result:</div>
              <div className="font-mono text-lg">{decimalResult}</div>
            </div>
          )}
        </div>

        {/* Quick examples */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Quick Examples:</div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDecimalInputChange("1.0")}
            >
              1.0
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDecimalInputChange("-1.0")}
            >
              -1.0
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDecimalInputChange("0.5")}
            >
              0.5
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDecimalInputChange("Infinity")}
            >
              ∞
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDecimalInputChange("NaN")}
            >
              NaN
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}