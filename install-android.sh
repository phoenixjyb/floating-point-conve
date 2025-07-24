#!/bin/bash

# Install Cool FP Converter on Android Device
# Usage: ./install-android.sh [debug|release]

set -e

# Determine build type (default to release)
BUILD_TYPE=${1:-release}

echo "📱 Cool FP Converter - Android Install Script"
echo "=============================================="

# Check if ADB is available
if ! command -v adb &> /dev/null; then
    echo "❌ ADB not found. Please run: source ~/.zshrc"
    exit 1
fi

# Check if device is connected
DEVICE_COUNT=$(adb devices | grep -c "device$")
if [ $DEVICE_COUNT -eq 0 ]; then
    echo "❌ No Android device connected"
    echo "   Run 'adb devices' to check connection"
    exit 1
fi

echo "✅ Android device connected"

# Determine APK path
if [ "$BUILD_TYPE" = "debug" ]; then
    APK_PATH="android/app/build/outputs/apk/debug/app-debug.apk"
    echo "🔧 Installing DEBUG version..."
else
    APK_PATH="android/app/build/outputs/apk/release/app-release.apk"
    echo "🚀 Installing RELEASE version..."
fi

# Check if APK exists
if [ ! -f "$APK_PATH" ]; then
    echo "❌ APK not found: $APK_PATH"
    echo "   Run 'npm run build:android-$BUILD_TYPE' first"
    exit 1
fi

# Install APK
echo "📦 Installing APK..."
adb install -r "$APK_PATH"

echo ""
echo "✅ Installation complete!"
echo "🎯 Cool FP Converter is now installed on your device"
echo ""
echo "📱 Next steps:"
echo "   1. Open the app on your device"
echo "   2. Test the features and interface"
echo "   3. Run ./capture-screenshots.sh for screenshots"
