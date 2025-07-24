import { useState, useCallback, useEffect } from "react";
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
  isValidHex,
  binaryToHex,
  hexToBinary,
  hexToDecimal,
  decimalToHex,
  formatDecimal,
  type FloatFormat 
} from "@/lib/floatingPoint";

interface ConversionCardProps {
  format: FloatFormat;
  onBinaryChange: (binary: string) => void;
}

export function ConversionCard({ format, onBinaryChange }: ConversionCardProps) {
  const [binaryInput, setBinaryInput] = useState("");
  const [hexInput, setHexInput] = useState("");
  const [decimalInput, setDecimalInput] = useState("");
  const [binaryResult, setBinaryResult] = useState("");
  const [hexResult, setHexResult] = useState("");
  const [decimalResult, setDecimalResult] = useState("");
  const [binaryError, setBinaryError] = useState("");
  const [hexError, setHexError] = useState("");
  const [decimalError, setDecimalError] = useState("");

  const handleBinaryInputChange = useCallback((value: string) => {
    setBinaryInput(value);
    setBinaryError("");
    
    if (!value.trim()) {
      setBinaryResult("");
      setHexResult("");
      setDecimalResult("");
      onBinaryChange("");
      return;
    }
    
    if (!isValidBinary(value)) {
      setBinaryError("Please enter only 0s and 1s");
      setBinaryResult("");
      setHexResult("");
      setDecimalResult("");
      onBinaryChange("");
      return;
    }
    
    try {
      const paddedBinary = value.padStart(format.totalBits, '0').slice(-format.totalBits);
      const decimal = binaryToDecimal(paddedBinary, format);
      const hex = binaryToHex(paddedBinary);
      const formattedDecimal = formatDecimal(decimal);
      
      setBinaryResult(paddedBinary);
      setHexResult(hex);
      setDecimalResult(formattedDecimal);
      onBinaryChange(paddedBinary);
    } catch (error) {
      setBinaryError("Invalid binary format");
      setBinaryResult("");
      setHexResult("");
      setDecimalResult("");
      onBinaryChange("");
    }
  }, [format, onBinaryChange]);

  const handleHexInputChange = useCallback((value: string) => {
    setHexInput(value);
    setHexError("");
    
    if (!value.trim()) {
      setBinaryResult("");
      setHexResult("");
      setDecimalResult("");
      onBinaryChange("");
      return;
    }
    
    if (!isValidHex(value)) {
      setHexError("Please enter only 0-9 and A-F");
      setBinaryResult("");
      setHexResult("");
      setDecimalResult("");
      onBinaryChange("");
      return;
    }
    
    try {
      const binary = hexToBinary(value, format.totalBits);
      const decimal = hexToDecimal(value, format);
      const formattedDecimal = formatDecimal(decimal);
      
      setBinaryResult(binary);
      setHexResult(value.toUpperCase());
      setDecimalResult(formattedDecimal);
      onBinaryChange(binary);
    } catch (error) {
      setHexError("Invalid hex format");
      setBinaryResult("");
      setHexResult("");
      setDecimalResult("");
      onBinaryChange("");
    }
  }, [format, onBinaryChange]);

  const handleDecimalInputChange = useCallback((value: string) => {
    setDecimalInput(value);
    setDecimalError("");
    
    if (!value.trim()) {
      setBinaryResult("");
      setHexResult("");
      setDecimalResult("");
      onBinaryChange("");
      return;
    }
    
    const decimal = parseFloat(value);
    if (isNaN(decimal) && value.toLowerCase() !== 'nan') {
      setDecimalError("Please enter a valid number");
      setBinaryResult("");
      setHexResult("");
      setDecimalResult("");
      onBinaryChange("");
      return;
    }
    
    try {
      const actualDecimal = value.toLowerCase() === 'nan' ? NaN : decimal;
      const binary = decimalToBinary(actualDecimal, format);
      const hex = decimalToHex(actualDecimal, format);
      
      setBinaryResult(binary);
      setHexResult(hex);
      setDecimalResult(formatDecimal(actualDecimal));
      onBinaryChange(binary);
    } catch (error) {
      setDecimalError("Conversion error");
      setBinaryResult("");
      setHexResult("");
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
    if (binaryResult && hexResult && decimalResult) {
      setBinaryInput(binaryResult);
      setHexInput(hexResult);
      setDecimalInput(decimalResult);
      handleBinaryInputChange(binaryResult);
    }
  }, [binaryResult, hexResult, decimalResult, handleBinaryInputChange]);

  // Auto-update conversions when format changes
  useEffect(() => {
    // Re-convert if we have any input data
    if (binaryInput) {
      handleBinaryInputChange(binaryInput);
    } else if (hexInput) {
      handleHexInputChange(hexInput);
    } else if (decimalInput) {
      handleDecimalInputChange(decimalInput);
    }
  }, [format]); // Trigger when format changes

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Format Converter
          <Button 
            variant="outline" 
            size="sm" 
            onClick={swapInputs}
            disabled={!binaryResult || !hexResult || !decimalResult}
          >
            <ArrowUpDown className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Binary Input */}
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
        </div>

        {/* Hexadecimal Input */}
        <div className="space-y-2">
          <Label htmlFor="hex-input">Hexadecimal Input</Label>
          <div className="flex gap-2">
            <Input
              id="hex-input"
              placeholder={`Enter hex (max ${Math.ceil(format.totalBits / 4)} digits)`}
              value={hexInput}
              onChange={(e) => handleHexInputChange(e.target.value)}
              className="font-mono"
              maxLength={Math.ceil(format.totalBits / 4)}
            />
            {hexResult && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(hexResult, "Hex")}
              >
                <Copy className="w-4 h-4" />
              </Button>
            )}
          </div>
          {hexError && (
            <Badge variant="destructive" className="text-xs">
              {hexError}
            </Badge>
          )}
        </div>

        {/* Decimal Input */}
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
        </div>

        {/* Results Display */}
        {(binaryResult || hexResult || decimalResult) && (
          <div className="space-y-4 pt-4 border-t">
            <div className="text-sm font-medium">Conversion Results:</div>
            
            {binaryResult && (
              <div className="p-3 bg-secondary rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Binary:</div>
                <div className="font-mono text-lg break-all">{binaryResult}</div>
              </div>
            )}
            
            {hexResult && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Hexadecimal:</div>
                <div className="font-mono text-lg">{hexResult}</div>
              </div>
            )}
            
            {decimalResult && (
              <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                <div className="text-sm text-muted-foreground mb-1">Decimal:</div>
                <div className="font-mono text-lg font-semibold text-accent-foreground">{decimalResult}</div>
              </div>
            )}
          </div>
        )}

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