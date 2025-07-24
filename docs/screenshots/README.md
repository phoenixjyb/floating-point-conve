# Screenshots & Media

This directory contains screenshots, GIFs, and other visual media for the Floating Point Converter app.

## Files Organization

### Screenshots
- `android-main.png` - Main conversion interface on Android
- `android-formats.png` - Format selector view
- `android-visualization.png` - Bit visualization component
- `android-landscape.png` - Landscape mode view
- `web-desktop.png` - Desktop web interface
- `web-mobile.png` - Mobile web interface

### Animations
- `conversion-demo.gif` - Real-time conversion demonstration
- `format-switching.gif` - Format switching animation
- `bit-visualization.gif` - Interactive bit breakdown

### Icons & Assets
- `app-icon.png` - High-resolution app icon
- `feature-icons/` - Feature-specific icons

## Screenshot Guidelines

### Android Screenshots
- **Resolution**: 1080x1920 (portrait) or 1920x1080 (landscape)
- **Format**: PNG for static, GIF for animations
- **Content**: Show real conversion examples with meaningful data

### Recommended Screenshots
1. **Main Interface**: Show FP32 conversion of π (3.14159)
2. **Bit Visualization**: Demonstrate sign/exponent/mantissa breakdown
3. **Format Comparison**: Same value in different formats (FP32 vs FP16)
4. **Special Values**: NaN, Infinity, Zero handling
5. **Dark Mode**: If available

### Creating Screenshots
```bash
# Android (via ADB)
adb exec-out screencap -p > screenshot.png

# Web (via dev tools)
# Use browser dev tools to capture mobile/desktop views

# GIF Creation (via screen recording)
# Use LiceCap, Kap, or similar tools for smooth GIFs
```

### Naming Convention
- Use kebab-case: `android-main-interface.png`
- Include platform: `android-`, `web-`, `ios-`
- Be descriptive: `conversion-demo` not `demo1`
- Version when needed: `v1.0-android-main.png`
