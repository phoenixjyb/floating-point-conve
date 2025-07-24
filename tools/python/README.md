# Python Validation Tools

This directory contains Python scripts for validating the floating-point conversion algorithms used in the Cool FP Converter application.

## Setup

### 1. Create and Activate Virtual Environment
```bash
cd tools/python
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

## Scripts

### `test_conversions.py`
Comprehensive validation suite that tests floating-point conversions across all supported formats.

**Features:**
- Tests FP32, FP64, FP16, BF16, FP8, and NVFP4 formats
- Validates conversion accuracy against known values
- Compares with NumPy implementations for FP32/FP64
- Generates detailed test reports in JSON format
- Handles special values (NaN, ±Infinity, ±Zero)

**Usage:**
```bash
# Activate virtual environment first
source .venv/bin/activate

# Run the test suite
python test_conversions.py
```

**Output:**
- Console output with test results and status
- `test_results.json` with detailed results for analysis
- Comparison with NumPy for verification

## Dependencies

- **numpy**: For IEEE 754 standard reference implementations
- **matplotlib**: For potential visualization of test results
- **scipy**: For advanced mathematical operations

## Test Coverage

The validation suite tests the following conversion operations:

1. **Decimal → Binary → Decimal** round-trip accuracy
2. **Binary ↔ Hexadecimal** conversion correctness
3. **Special value handling** (NaN, Infinity, Zero)
4. **Edge cases** for each format's precision limits
5. **Cross-format compatibility** verification

## Expected Results

All test values should pass conversion accuracy checks within the precision limits of each format:

- **FP32**: ~7 decimal digits precision
- **FP64**: ~15 decimal digits precision  
- **FP16**: ~3 decimal digits precision
- **BF16**: ~2 decimal digits precision
- **FP8**: ~1 decimal digit precision
- **NVFP4**: Limited precision (experimental)

## Troubleshooting

If tests fail:

1. Check that all dependencies are installed correctly
2. Verify the virtual environment is activated
3. Review the detailed error messages in console output
4. Examine `test_results.json` for specific failure details

## Integration with JavaScript

Use the test results to validate and debug the JavaScript implementation in `src/lib/floatingPoint.ts`. The Python script serves as a reference implementation to ensure accuracy.
