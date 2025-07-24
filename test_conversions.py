#!/usr/bin/env python3
"""
Floating Point Conversion Test Suite
====================================

This script validates the accuracy of floating-point conversions across multiple formats.
It serves as a reference implementation and test suite for the Cool FP Converter app.

Supported formats:
- FP32 (IEEE 754 Single Precision)
- FP64 (IEEE 754 Double Precision)  
- FP16 (IEEE 754 Half Precision)
- BF16 (Brain Float 16)
- FP8 (E4M3 - 8-bit floating point)
- NVFP4 (E2M1 - 4-bit experimental)

Author: Cool FP Converter Team
Date: July 2025
"""

import struct
import math
import numpy as np
from typing import Dict, Tuple, Union, List
from dataclasses import dataclass
import json

@dataclass
class FloatFormat:
    """Floating point format specification"""
    name: str
    total_bits: int
    sign_bits: int
    exponent_bits: int
    mantissa_bits: int
    bias: int
    description: str

# Format definitions matching the JavaScript implementation
FORMATS = {
    'fp32': FloatFormat(
        name='FP32',
        total_bits=32,
        sign_bits=1,
        exponent_bits=8,
        mantissa_bits=23,
        bias=127,
        description='IEEE 754 Single Precision'
    ),
    'fp64': FloatFormat(
        name='FP64', 
        total_bits=64,
        sign_bits=1,
        exponent_bits=11,
        mantissa_bits=52,
        bias=1023,
        description='IEEE 754 Double Precision'
    ),
    'fp16': FloatFormat(
        name='FP16',
        total_bits=16,
        sign_bits=1,
        exponent_bits=5,
        mantissa_bits=10,
        bias=15,
        description='IEEE 754 Half Precision'
    ),
    'bf16': FloatFormat(
        name='BF16',
        total_bits=16,
        sign_bits=1,
        exponent_bits=8,
        mantissa_bits=7,
        bias=127,
        description='Brain Float 16'
    ),
    'fp8': FloatFormat(
        name='FP8',
        total_bits=8,
        sign_bits=1,
        exponent_bits=4,
        mantissa_bits=3,
        bias=7,
        description='8-bit Floating Point (E4M3)'
    ),
    'nvfp4': FloatFormat(
        name='NVFP4',
        total_bits=4,
        sign_bits=1,
        exponent_bits=2,
        mantissa_bits=1,
        bias=1,
        description='4-bit NVIDIA Experimental (E2M1)'
    )
}

class FloatingPointConverter:
    """High-precision floating point converter and validator"""
    
    def __init__(self):
        self.test_values = [
            0.0, -0.0, 1.0, -1.0, 2.0, -2.0,
            0.5, -0.5, 0.25, -0.25,
            3.14159, -3.14159,
            1.5, -1.5, 
            10.0, -10.0,
            100.0, -100.0,
            0.1, -0.1,
            0.01, -0.01,
            1e6, -1e6,
            1e-6, -1e-6,
            float('inf'), float('-inf'),
            float('nan')
        ]
    
    def decimal_to_binary(self, value: float, fmt: FloatFormat) -> str:
        """Convert decimal to binary representation"""
        if math.isnan(value):
            # NaN: all exponent bits 1, mantissa non-zero
            sign = '0'
            exponent = '1' * fmt.exponent_bits
            mantissa = '1' + '0' * (fmt.mantissa_bits - 1)
            return sign + exponent + mantissa
            
        if math.isinf(value):
            # Infinity: all exponent bits 1, mantissa zero
            sign = '1' if value < 0 else '0'
            exponent = '1' * fmt.exponent_bits
            mantissa = '0' * fmt.mantissa_bits
            return sign + exponent + mantissa
            
        if value == 0.0:
            # Zero (positive or negative)
            sign = '1' if math.copysign(1.0, value) < 0 else '0'
            exponent = '0' * fmt.exponent_bits
            mantissa = '0' * fmt.mantissa_bits
            return sign + exponent + mantissa
        
        # Regular number
        sign = '1' if value < 0 else '0'
        abs_value = abs(value)
        
        # Find exponent
        if abs_value >= 1.0:
            exp = int(math.floor(math.log2(abs_value)))
        else:
            exp = int(math.floor(math.log2(abs_value)))
            
        biased_exp = exp + fmt.bias
        
        # Handle subnormal numbers
        if biased_exp <= 0:
            # Subnormal number
            exponent = '0' * fmt.exponent_bits
            # Calculate mantissa for subnormal
            mantissa_value = abs_value * (2 ** (fmt.bias - 1)) * (2 ** fmt.mantissa_bits)
            mantissa_int = int(mantissa_value)
            mantissa = format(mantissa_int, f'0{fmt.mantissa_bits}b')
        elif biased_exp >= (2 ** fmt.exponent_bits) - 1:
            # Overflow to infinity
            exponent = '1' * fmt.exponent_bits
            mantissa = '0' * fmt.mantissa_bits
        else:
            # Normal number
            exponent = format(biased_exp, f'0{fmt.exponent_bits}b')
            
            # Calculate mantissa
            normalized_value = abs_value / (2 ** exp)
            mantissa_value = (normalized_value - 1.0) * (2 ** fmt.mantissa_bits)
            mantissa_int = int(round(mantissa_value))
            mantissa = format(mantissa_int, f'0{fmt.mantissa_bits}b')
        
        return sign + exponent + mantissa
    
    def binary_to_decimal(self, binary: str, fmt: FloatFormat) -> float:
        """Convert binary representation to decimal"""
        if len(binary) != fmt.total_bits:
            raise ValueError(f"Binary string must be {fmt.total_bits} bits long")
        
        sign_bit = binary[0]
        exponent_bits = binary[1:1+fmt.exponent_bits]
        mantissa_bits = binary[1+fmt.exponent_bits:]
        
        # Parse components
        sign = -1 if sign_bit == '1' else 1
        exponent = int(exponent_bits, 2)
        mantissa = int(mantissa_bits, 2)
        
        # Special cases
        max_exponent = (2 ** fmt.exponent_bits) - 1
        
        if exponent == max_exponent:
            if mantissa == 0:
                return float('inf') * sign
            else:
                return float('nan')
        
        if exponent == 0:
            if mantissa == 0:
                return 0.0 * sign
            else:
                # Subnormal number
                value = mantissa * (2 ** -(fmt.bias - 1 + fmt.mantissa_bits))
                return value * sign
        
        # Normal number
        mantissa_value = 1.0 + mantissa / (2 ** fmt.mantissa_bits)
        actual_exponent = exponent - fmt.bias
        value = mantissa_value * (2 ** actual_exponent)
        
        return value * sign
    
    def binary_to_hex(self, binary: str) -> str:
        """Convert binary to hexadecimal"""
        # Pad to multiple of 4 bits
        padded = binary.zfill((len(binary) + 3) // 4 * 4)
        hex_value = hex(int(padded, 2))[2:].upper()
        return hex_value
    
    def hex_to_binary(self, hex_str: str, total_bits: int) -> str:
        """Convert hexadecimal to binary"""
        clean_hex = hex_str.replace('0x', '').replace('0X', '')
        binary = bin(int(clean_hex, 16))[2:]
        return binary.zfill(total_bits)
    
    def get_bit_breakdown(self, binary: str, fmt: FloatFormat) -> Dict:
        """Get detailed bit breakdown"""
        sign = binary[0]
        exponent = binary[1:1+fmt.exponent_bits]
        mantissa = binary[1+fmt.exponent_bits:]
        
        return {
            'sign': sign,
            'exponent': exponent,
            'mantissa': mantissa,
            'signValue': int(sign),
            'exponentValue': int(exponent, 2),
            'mantissaValue': int(mantissa, 2)
        }
    
    def test_format(self, fmt_name: str) -> Dict:
        """Test a specific format with various values"""
        fmt = FORMATS[fmt_name]
        results = {
            'format': fmt_name,
            'description': fmt.description,
            'tests': [],
            'passed': 0,
            'failed': 0,
            'errors': []
        }
        
        print(f"\nTesting {fmt.name} ({fmt.description})")
        print("=" * 60)
        
        for value in self.test_values:
            try:
                # Convert decimal to binary
                binary = self.decimal_to_binary(value, fmt)
                
                # Convert back to decimal
                recovered = self.binary_to_decimal(binary, fmt)
                
                # Convert to hex
                hex_value = self.binary_to_hex(binary)
                
                # Get bit breakdown
                breakdown = self.get_bit_breakdown(binary, fmt)
                
                # Check accuracy (special handling for NaN)
                if math.isnan(value):
                    passed = math.isnan(recovered)
                elif math.isinf(value):
                    passed = math.isinf(recovered) and math.copysign(1.0, recovered) == math.copysign(1.0, value)
                elif value == 0.0:
                    passed = recovered == 0.0 and math.copysign(1.0, recovered) == math.copysign(1.0, value)
                else:
                    # For finite values, check relative error
                    if abs(value) > 1e-10:
                        relative_error = abs((recovered - value) / value)
                        passed = relative_error < 0.01  # 1% tolerance for low precision formats
                    else:
                        passed = abs(recovered - value) < 1e-10
                
                test_result = {
                    'input': str(value),
                    'binary': binary,
                    'hex': hex_value,
                    'recovered': str(recovered),
                    'breakdown': breakdown,
                    'passed': passed
                }
                
                results['tests'].append(test_result)
                
                if passed:
                    results['passed'] += 1
                    status = "✓ PASS"
                else:
                    results['failed'] += 1
                    status = "✗ FAIL"
                    results['errors'].append(f"Value {value}: expected {recovered}, got difference")
                
                print(f"{status} | {str(value):>12} → {binary} → {hex_value:>8} → {str(recovered):>12}")
                
            except Exception as e:
                results['failed'] += 1
                results['errors'].append(f"Value {value}: {str(e)}")
                print(f"✗ ERROR | {str(value):>12} → {str(e)}")
        
        success_rate = results['passed'] / (results['passed'] + results['failed']) * 100
        print(f"\nResults: {results['passed']}/{results['passed'] + results['failed']} passed ({success_rate:.1f}%)")
        
        return results
    
    def run_comprehensive_tests(self) -> Dict:
        """Run tests for all formats"""
        print("Cool FP Converter - Comprehensive Validation Suite")
        print("=" * 60)
        
        all_results = {
            'timestamp': '2025-07-25',
            'total_tests': 0,
            'total_passed': 0,
            'total_failed': 0,
            'formats': {}
        }
        
        for fmt_name in FORMATS.keys():
            results = self.test_format(fmt_name)
            all_results['formats'][fmt_name] = results
            all_results['total_tests'] += results['passed'] + results['failed']
            all_results['total_passed'] += results['passed']
            all_results['total_failed'] += results['failed']
        
        # Summary
        overall_success = all_results['total_passed'] / all_results['total_tests'] * 100
        print(f"\n" + "=" * 60)
        print(f"OVERALL RESULTS")
        print(f"=" * 60)
        print(f"Total Tests: {all_results['total_tests']}")
        print(f"Passed: {all_results['total_passed']}")
        print(f"Failed: {all_results['total_failed']}")
        print(f"Success Rate: {overall_success:.1f}%")
        
        if all_results['total_failed'] == 0:
            print("🎉 ALL TESTS PASSED! The conversion algorithms are working correctly.")
        else:
            print("⚠️  Some tests failed. Review the errors above.")
        
        return all_results
    
    def save_results(self, results: Dict, filename: str = 'test_results.json'):
        """Save test results to JSON file"""
        with open(filename, 'w') as f:
            json.dump(results, f, indent=2, default=str)
        print(f"\nResults saved to {filename}")
    
    def compare_with_numpy(self):
        """Compare our implementations with NumPy for FP32 and FP64"""
        print("\n" + "=" * 60)
        print("NUMPY COMPARISON")
        print("=" * 60)
        
        test_values = [1.0, -1.0, 3.14159, 0.1, 1e6, 1e-6]
        
        for value in test_values:
            print(f"\nValue: {value}")
            
            # FP32 comparison
            np_fp32_bytes = np.float32(value).tobytes()
            np_fp32_binary = ''.join(format(b, '08b') for b in np_fp32_bytes)
            our_fp32_binary = self.decimal_to_binary(value, FORMATS['fp32'])
            
            print(f"FP32 NumPy:  {np_fp32_binary}")
            print(f"FP32 Ours:   {our_fp32_binary}")
            print(f"FP32 Match:  {'✓' if np_fp32_binary == our_fp32_binary else '✗'}")
            
            # FP64 comparison  
            np_fp64_bytes = np.float64(value).tobytes()
            np_fp64_binary = ''.join(format(b, '08b') for b in np_fp64_bytes)
            our_fp64_binary = self.decimal_to_binary(value, FORMATS['fp64'])
            
            print(f"FP64 NumPy:  {np_fp64_binary}")
            print(f"FP64 Ours:   {our_fp64_binary}")
            print(f"FP64 Match:  {'✓' if np_fp64_binary == our_fp64_binary else '✗'}")

def main():
    """Main test runner"""
    converter = FloatingPointConverter()
    
    # Run comprehensive tests
    results = converter.run_comprehensive_tests()
    
    # Save results
    converter.save_results(results)
    
    # Compare with NumPy
    converter.compare_with_numpy()
    
    print(f"\n" + "=" * 60)
    print("Testing complete! Check test_results.json for detailed results.")
    print("Use this data to validate your JavaScript implementation.")

if __name__ == "__main__":
    main()
