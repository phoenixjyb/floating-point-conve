#!/bin/bash

# Screenshot Capture Script for Cool FP Converter
# Usage: ./capture-screenshots.sh

echo "📸 Cool FP Converter - Screenshot Capture Script"
echo "======================================================"

# Check if ADB is available for Android screenshots
if command -v adb &> /dev/null; then
    echo "✅ ADB found - Android screenshots available"
    
    # Check if device is connected
    DEVICE_COUNT=$(adb devices | grep -c "device$")
    if [ $DEVICE_COUNT -gt 0 ]; then
        echo "📱 Android device connected"
        
        echo "📸 Capturing Android screenshots..."
        echo "   Make sure the app is open and ready"
        read -p "   Press Enter when ready for main interface screenshot..."
        
        # Capture main interface
        adb exec-out screencap -p > docs/screenshots/android-main.png
        echo "   ✅ Saved: android-main.png"
        
        read -p "   Navigate to bit visualization, then press Enter..."
        adb exec-out screencap -p > docs/screenshots/android-visualization.png
        echo "   ✅ Saved: android-visualization.png"
        
        read -p "   Rotate to landscape mode, then press Enter..."
        adb exec-out screencap -p > docs/screenshots/android-landscape.png
        echo "   ✅ Saved: android-landscape.png"
        
    else
        echo "⚠️  No Android device connected via ADB"
        echo "   Connect device and enable USB debugging"
    fi
else
    echo "⚠️  ADB not found - install Android SDK Platform Tools"
fi

echo ""
echo "🌐 Web Screenshots"
echo "=================="
echo "For web screenshots:"
echo "1. Open browser dev tools (F12)"
echo "2. Toggle device simulation (Ctrl/Cmd + Shift + M)"
echo "3. Select device or custom size"
echo "4. Use browser screenshot feature or:"
echo "   - Chrome: Ctrl/Cmd + Shift + P → 'Screenshot'"
echo "   - Firefox: Right-click → 'Take Screenshot'"

echo ""
echo "🎬 GIF Creation"
echo "==============="
echo "Recommended tools for creating demo GIFs:"
echo "• LiceCap (free, cross-platform)"
echo "• Kap (free, macOS)"
echo "• ScreenToGif (free, Windows)"
echo "• RecordIt (web-based)"
echo ""
echo "GIF Guidelines:"
echo "• Keep under 5 seconds"
echo "• Show one clear feature"
echo "• Use smooth transitions"
echo "• Optimize file size (<2MB)"

echo ""
echo "📋 Screenshot Checklist"
echo "======================="
echo "Required screenshots:"
echo "□ android-main.png - Main conversion interface"
echo "□ android-visualization.png - Bit breakdown view"
echo "□ android-landscape.png - Landscape orientation"
echo "□ web-desktop.png - Desktop browser view"
echo "□ web-mobile.png - Mobile browser view"
echo "□ conversion-demo.gif - Real-time conversion"
echo "□ bit-breakdown.png - Educational bit analysis"

echo ""
echo "🎯 Content Suggestions"
echo "======================"
echo "Show these examples in screenshots:"
echo "• π (3.14159) → FP32 conversion"
echo "• Special values: NaN, ±Infinity, ±Zero"
echo "• Format comparison: same value in FP32 vs FP16"
echo "• Bit visualization with clear labels"
echo "• Clean, professional interface"

echo ""
echo "✨ Once you have the screenshots, run:"
echo "   git add docs/screenshots/"
echo "   git commit -m 'Add app screenshots and visual showcase'"
echo "   git push origin main"
