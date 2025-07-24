export interface FloatFormat {
  name: string;
  totalBits: number;
  signBits: number;
  exponentBits: number;
  mantissaBits: number;
  bias: number;
  description: string;
}

export const FLOAT_FORMATS: Record<string, FloatFormat> = {
  fp32: {
    name: "FP32 (IEEE 754 Single)",
    totalBits: 32,
    signBits: 1,
    exponentBits: 8,
    mantissaBits: 23,
    bias: 127,
    description: "32-bit IEEE 754 single precision"
  },
  fp64: {
    name: "FP64 (IEEE 754 Double)",
    totalBits: 64,
    signBits: 1,
    exponentBits: 11,
    mantissaBits: 52,
    bias: 1023,
    description: "64-bit IEEE 754 double precision"
  },
  fp16: {
    name: "FP16 (IEEE 754 Half)",
    totalBits: 16,
    signBits: 1,
    exponentBits: 5,
    mantissaBits: 10,
    bias: 15,
    description: "16-bit IEEE 754 half precision"
  },
  bf16: {
    name: "BF16 (Brain Float)",
    totalBits: 16,
    signBits: 1,
    exponentBits: 8,
    mantissaBits: 7,
    bias: 127,
    description: "16-bit Google Brain floating point"
  },
  fp8: {
    name: "FP8 (E4M3)",
    totalBits: 8,
    signBits: 1,
    exponentBits: 4,
    mantissaBits: 3,
    bias: 7,
    description: "8-bit floating point (4-bit exp, 3-bit mantissa)"
  },
  nvfp4: {
    name: "NVFP4 (E2M1)",
    totalBits: 4,
    signBits: 1,
    exponentBits: 2,
    mantissaBits: 1,
    bias: 1,
    description: "4-bit NVIDIA floating point"
  }
};

export interface BitBreakdown {
  sign: string;
  exponent: string;
  mantissa: string;
  signValue: number;
  exponentValue: number;
  mantissaValue: number;
}

export function binaryToDecimal(binary: string, format: FloatFormat): number {
  // Pad or truncate to correct length
  const paddedBinary = binary.padStart(format.totalBits, '0').slice(-format.totalBits);
  
  const signBit = paddedBinary[0];
  const exponentBits = paddedBinary.slice(1, 1 + format.exponentBits);
  const mantissaBits = paddedBinary.slice(1 + format.exponentBits);
  
  const sign = signBit === '1' ? -1 : 1;
  const exponent = parseInt(exponentBits, 2);
  
  // Handle special cases
  const maxExponent = (1 << format.exponentBits) - 1;
  
  if (exponent === maxExponent) {
    // Infinity or NaN
    const mantissa = parseInt(mantissaBits, 2);
    if (mantissa === 0) {
      return sign * Infinity;
    } else {
      return NaN;
    }
  }
  
  if (exponent === 0) {
    // Subnormal numbers
    const mantissa = parseInt(mantissaBits, 2) / Math.pow(2, format.mantissaBits);
    return sign * mantissa * Math.pow(2, 1 - format.bias);
  }
  
  // Normal numbers
  const mantissa = 1 + parseInt(mantissaBits, 2) / Math.pow(2, format.mantissaBits);
  return sign * mantissa * Math.pow(2, exponent - format.bias);
}

export function decimalToBinary(decimal: number, format: FloatFormat): string {
  if (isNaN(decimal)) {
    // NaN representation
    const sign = '0';
    const exponent = '1'.repeat(format.exponentBits);
    const mantissa = '1' + '0'.repeat(format.mantissaBits - 1);
    return sign + exponent + mantissa;
  }
  
  if (!isFinite(decimal)) {
    // Infinity representation
    const sign = decimal < 0 ? '1' : '0';
    const exponent = '1'.repeat(format.exponentBits);
    const mantissa = '0'.repeat(format.mantissaBits);
    return sign + exponent + mantissa;
  }
  
  if (decimal === 0) {
    // Zero representation
    return '0'.repeat(format.totalBits);
  }
  
  const sign = decimal < 0 ? '1' : '0';
  const absValue = Math.abs(decimal);
  
  // Find exponent
  let exponent = Math.floor(Math.log2(absValue));
  let mantissaValue = absValue / Math.pow(2, exponent);
  
  // Adjust for bias
  const biasedExponent = exponent + format.bias;
  
  // Handle subnormal numbers
  if (biasedExponent <= 0) {
    exponent = 1 - format.bias;
    mantissaValue = absValue / Math.pow(2, exponent);
    const exponentBits = '0'.repeat(format.exponentBits);
    const mantissaBits = Math.round(mantissaValue * Math.pow(2, format.mantissaBits))
      .toString(2)
      .padStart(format.mantissaBits, '0')
      .slice(0, format.mantissaBits);
    return sign + exponentBits + mantissaBits;
  }
  
  // Handle overflow
  const maxExponent = (1 << format.exponentBits) - 2;
  if (biasedExponent >= maxExponent) {
    // Infinity
    const exponentBits = '1'.repeat(format.exponentBits);
    const mantissaBits = '0'.repeat(format.mantissaBits);
    return sign + exponentBits + mantissaBits;
  }
  
  // Normal numbers
  const exponentBits = biasedExponent.toString(2).padStart(format.exponentBits, '0');
  const mantissaFraction = mantissaValue - 1; // Remove implicit leading 1
  const mantissaBits = Math.round(mantissaFraction * Math.pow(2, format.mantissaBits))
    .toString(2)
    .padStart(format.mantissaBits, '0')
    .slice(0, format.mantissaBits);
  
  return sign + exponentBits + mantissaBits;
}

export function getBitBreakdown(binary: string, format: FloatFormat): BitBreakdown {
  const paddedBinary = binary.padStart(format.totalBits, '0').slice(-format.totalBits);
  
  const sign = paddedBinary[0];
  const exponent = paddedBinary.slice(1, 1 + format.exponentBits);
  const mantissa = paddedBinary.slice(1 + format.exponentBits);
  
  return {
    sign,
    exponent,
    mantissa,
    signValue: parseInt(sign, 2),
    exponentValue: parseInt(exponent, 2),
    mantissaValue: parseInt(mantissa, 2)
  };
}

export function isValidBinary(input: string): boolean {
  return /^[01]*$/.test(input);
}

export function formatDecimal(value: number): string {
  if (isNaN(value)) return "NaN";
  if (!isFinite(value)) return value > 0 ? "+Infinity" : "-Infinity";
  if (value === 0) return "0";
  
  // Use scientific notation for very large or very small numbers
  if (Math.abs(value) >= 1e6 || Math.abs(value) < 1e-4) {
    return value.toExponential(6);
  }
  
  return value.toString();
}