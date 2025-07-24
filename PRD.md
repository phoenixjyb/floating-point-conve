# Data Conversion App PRD

A specialized tool for converting between binary representations and human-readable decimal numbers across multiple floating-point formats.

**Experience Qualities**:
1. **Precise** - Accurate conversions with clear format specifications and bit-level visualization
2. **Educational** - Helps users understand floating-point representation through visual breakdown of sign, exponent, and mantissa
3. **Efficient** - Fast, real-time conversions with instant feedback as users type

**Complexity Level**: Light Application (multiple features with basic state)
- Supports multiple floating-point formats with real-time bidirectional conversion and educational bit visualization

## Essential Features

### Binary to Decimal Conversion
- **Functionality**: Convert binary strings to decimal numbers across FP32, FP64, FP16, BF16, FP8, NVFP4 formats
- **Purpose**: Allow engineers to decode binary floating-point data into human-readable values
- **Trigger**: User enters binary string in input field
- **Progression**: Enter binary → Select format → View decimal result → See bit breakdown
- **Success criteria**: Accurate conversion matching IEEE standards for each format

### Decimal to Binary Conversion  
- **Functionality**: Convert decimal numbers to binary representation in selected floating-point format
- **Purpose**: Help users understand how decimal values are encoded in different FP formats
- **Trigger**: User enters decimal number in input field
- **Progression**: Enter decimal → Select format → View binary result → See bit breakdown
- **Success criteria**: Accurate encoding following format specifications

### Format Selection
- **Functionality**: Choose between FP32, FP64, FP16, BF16, FP8, NVFP4 formats
- **Purpose**: Support multiple precision levels and specialized formats
- **Trigger**: User clicks format selector
- **Progression**: Click format → Update conversion → Refresh bit visualization
- **Success criteria**: All conversions update correctly when format changes

### Bit Visualization
- **Functionality**: Visual breakdown showing sign bit, exponent bits, and mantissa bits
- **Purpose**: Educational tool to understand floating-point structure
- **Trigger**: Automatic when conversion occurs
- **Progression**: Conversion happens → Bits highlighted by component → Labels shown
- **Success criteria**: Clear visual separation with accurate bit counts per format

## Edge Case Handling
- **Invalid Binary Input**: Show clear error message for non-binary characters
- **Overflow Values**: Display "Infinity" or "NaN" appropriately for each format
- **Underflow Values**: Handle subnormal numbers correctly
- **Empty Input**: Show placeholder examples for expected input format
- **Special Values**: Properly handle +/-0, +/-Infinity, NaN for each format

## Design Direction
The design should feel precise and technical while remaining approachable - like a professional engineering tool that's intuitive enough for learning. Clean, monospace typography for binary/hex values with clear visual hierarchy between input, output, and educational components.

## Color Selection
Monochromatic with technical accents - using a complementary scheme of cool blues and warm oranges to distinguish between binary and decimal representations.

- **Primary Color**: Deep Blue (oklch(0.4 0.15 240)) - Professional, technical feeling for primary actions
- **Secondary Colors**: Light Gray (oklch(0.95 0.02 240)) - Clean backgrounds that don't compete with data
- **Accent Color**: Warm Orange (oklch(0.65 0.15 45)) - Highlights important conversions and results
- **Foreground/Background Pairings**: 
  - Background (White oklch(1 0 0)): Dark Gray text (oklch(0.2 0.02 240)) - Ratio 15.8:1 ✓
  - Primary (Deep Blue oklch(0.4 0.15 240)): White text (oklch(1 0 0)) - Ratio 8.2:1 ✓
  - Accent (Warm Orange oklch(0.65 0.15 45)): White text (oklch(1 0 0)) - Ratio 4.8:1 ✓

## Font Selection
Technical precision requires a monospace font for binary/decimal values with a clean sans-serif for interface elements - using JetBrains Mono for code and Inter for UI text.

- **Typographic Hierarchy**: 
  - H1 (App Title): Inter Bold/32px/tight letter spacing
  - H2 (Section Headers): Inter SemiBold/24px/normal spacing  
  - Body (Interface): Inter Regular/16px/relaxed spacing
  - Code (Binary/Decimal): JetBrains Mono Regular/18px/normal spacing
  - Labels: Inter Medium/14px/wide letter spacing

## Animations
Subtle and functional - animations should guide attention to conversion results and provide feedback without distracting from precise technical work.

- **Purposeful Meaning**: Smooth transitions when switching formats, gentle highlighting when conversions complete
- **Hierarchy of Movement**: Conversion results get priority animation, format switches get secondary movement, bit visualization updates smoothly

## Component Selection
- **Components**: Card for main converter, Tabs for format selection, Input for binary/decimal entry, Badge for bit labels, Separator for bit group divisions
- **Customizations**: Custom bit visualization component showing sign/exponent/mantissa breakdown, custom format selector with technical specifications
- **States**: Input validation states (valid/invalid), conversion states (loading/complete), format selection states
- **Icon Selection**: Binary (code icon), decimal (calculator), conversion arrows, info icons for format details
- **Spacing**: Consistent 4/6/8 spacing scale, generous padding around conversion areas
- **Mobile**: Single column layout, larger touch targets for format selection, collapsible bit visualization