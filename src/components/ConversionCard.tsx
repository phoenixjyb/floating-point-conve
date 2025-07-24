import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowsDownUp, Copy } from "@phosphor-icons/react";
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
  const [activeInput, setActiveInput] = useState<'binary' | 'hex' | 'decimal' | null>(null);

  const handleBinaryInputChange = useCallback((value: string) => {
    setBinaryInput(value);
    setBinaryError("");
    setActiveInput('binary');
    
    if (!value.trim()) {
      setBinaryResult("");
      setHexResult("");
      setDecimalResult("");
      onBinaryChange("");
      setActiveInput(null);
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
    setActiveInput('hex');
    
    if (!value.trim()) {
      setBinaryResult("");
      setHexResult("");
      setDecimalResult("");
      onBinaryChange("");
      setActiveInput(null);
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
    setActiveInput('decimal');
    
    if (!value.trim()) {
      setBinaryResult("");
      setHexResult("");
      setDecimalResult("");
      onBinaryChange("");
      setActiveInput(null);
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
    <Card className="card-spacing-optimized">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-samsung-large">
          Format Converter
          <Button 
            variant="outline" 
            size="sm" 
            onClick={swapInputs}
            disabled={!binaryResult || !hexResult || !decimalResult}
            className="button-enhanced tap-target"
          >
            <ArrowsDownUp className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Binary Input */}
        <div className="space-y-2">
          <Label htmlFor="binary-input" className={`text-samsung-optimized font-medium ${activeInput === 'binary' || activeInput === null ? 'text-foreground' : 'text-muted-foreground italic'}`}>Binary Input</Label>
          <div className="flex gap-3">
            <Input
              id="binary-input"
              placeholder={`Enter binary (max ${format.totalBits} bits)`}
              value={binaryInput}
              onChange={(e) => handleBinaryInputChange(e.target.value)}
              className={`font-mono text-samsung-optimized tap-target button-enhanced ${activeInput === 'binary' || activeInput === null ? 'text-foreground' : 'text-muted-foreground italic'}`}
              maxLength={format.totalBits}
              inputMode="numeric"
              pattern="[01]*"
            />
            {binaryResult && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(binaryResult, "Binary")}
                className="tap-target button-enhanced"
              >
                <Copy className="w-5 h-5" />
              </Button>
            )}
          </div>
          {binaryError && (
            <Badge variant="destructive" className="text-sm">
              {binaryError}
            </Badge>
          )}
        </div>

        {/* Hexadecimal Input */}
        <div className="space-y-2">
          <Label htmlFor="hex-input" className={`text-samsung-optimized font-medium ${activeInput === 'hex' || activeInput === null ? 'text-foreground' : 'text-muted-foreground italic'}`}>Hexadecimal Input</Label>
          <div className="flex gap-3">
            <Input
              id="hex-input"
              placeholder={`Enter hex (max ${Math.ceil(format.totalBits / 4)} digits)`}
              value={hexInput}
              onChange={(e) => handleHexInputChange(e.target.value)}
              className={`font-mono text-samsung-optimized tap-target button-enhanced ${activeInput === 'hex' || activeInput === null ? 'text-foreground' : 'text-muted-foreground italic'}`}
              maxLength={Math.ceil(format.totalBits / 4)}
              inputMode="text"
              pattern="[0-9A-Fa-f]*"
            />
            {hexResult && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(hexResult, "Hex")}
                className="tap-target button-enhanced"
              >
                <Copy className="w-5 h-5" />
              </Button>
            )}
          </div>
          {hexError && (
            <Badge variant="destructive" className="text-sm">
              {hexError}
            </Badge>
          )}
        </div>

        {/* Decimal Input */}
        <div className="space-y-2">
          <Label htmlFor="decimal-input" className={`text-samsung-optimized font-medium ${activeInput === 'decimal' || activeInput === null ? 'text-foreground' : 'text-muted-foreground italic'}`}>Decimal Input</Label>
          <div className="flex gap-3">
            <Input
              id="decimal-input"
              placeholder="Enter decimal number (or 'NaN', 'Infinity')"
              value={decimalInput}
              onChange={(e) => handleDecimalInputChange(e.target.value)}
              className={`font-mono text-samsung-optimized tap-target button-enhanced ${activeInput === 'decimal' || activeInput === null ? 'text-foreground' : 'text-muted-foreground italic'}`}
              inputMode="decimal"
            />
            {decimalResult && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(decimalResult, "Decimal")}
                className="tap-target button-enhanced"
              >
                <Copy className="w-5 h-5" />
              </Button>
            )}
          </div>
          {decimalError && (
            <Badge variant="destructive" className="text-sm">
              {decimalError}
            </Badge>
          )}
        </div>

        {/* Results Display */}
        {(binaryResult || hexResult || decimalResult) && (
          <div className="space-y-4 pt-4 border-t">
            <div className="text-samsung-optimized font-semibold">Conversion Results:</div>
            
            {binaryResult && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">Binary:</div>
                <div className={`font-mono text-samsung-large break-all ${activeInput === 'binary' ? 'text-gray-600 italic' : 'text-gray-900'}`}>{binaryResult}</div>
              </div>
            )}
            
            {hexResult && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">Hexadecimal:</div>
                <div className={`font-mono text-samsung-large ${activeInput === 'hex' ? 'text-gray-600 italic' : 'text-gray-900'}`}>{hexResult}</div>
              </div>
            )}
            
            {decimalResult && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">Decimal:</div>
                <div className={`font-mono text-samsung-large ${activeInput === 'decimal' ? 'text-gray-600 italic' : 'text-gray-900'}`}>{decimalResult}</div>
              </div>
            )}
          </div>
        )}

        {/* Quick examples */}
        <div className="space-y-3">
          <div className="text-samsung-optimized font-semibold">Quick Examples:</div>
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDecimalInputChange("1.0")}
              className="button-enhanced tap-target text-samsung-optimized"
            >
              1.0
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDecimalInputChange("-1.0")}
              className="button-enhanced tap-target text-samsung-optimized"
            >
              -1.0
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDecimalInputChange("0.5")}
              className="button-enhanced tap-target text-samsung-optimized"
            >
              0.5
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDecimalInputChange("Infinity")}
              className="button-enhanced tap-target text-samsung-optimized"
            >
              ∞
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDecimalInputChange("NaN")}
              className="button-enhanced tap-target text-samsung-optimized"
            >
              NaN
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDecimalInputChange("3.14159")}
              className="button-enhanced tap-target text-samsung-optimized"
            >
              π
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}