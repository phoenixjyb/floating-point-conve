#!/bin/bash

# Android Build Script for Cool FP Converter
# Builds both APK and AAB (Android App Bundle) formats
# Usage: ./build-android.sh [debug|release|all]

set -e  # Exit on any error

echo "🚀 Cool FP Converter - Android Build Script"
echo "=============================================="

# Build mode (default to release)
BUILD_MODE=${1:-release}

# Check if Android SDK is available
if ! command -v android &> /dev/null && ! [ -d "$ANDROID_HOME" ]; then
    echo "❌ Android SDK not found"
    echo "   Please install Android SDK and set ANDROID_HOME"
    exit 1
fi

# Check if Java is available
if ! command -v java &> /dev/null; then
    echo "❌ Java not found"
    echo "   Please install Java 17 or higher"
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf android/app/build/outputs/

# Build web assets
echo "📦 Building web assets..."
npm run build

# Sync Capacitor
echo "🔄 Syncing Capacitor..."
npx cap sync android

# Navigate to Android directory
cd android

echo ""
echo "🏗️  Building Android packages..."
echo "================================="

case $BUILD_MODE in
    "debug")
        echo "🔧 Building DEBUG APK..."
        ./gradlew assembleDebug
        
        echo ""
        echo "✅ DEBUG BUILD COMPLETE"
        echo "📱 APK Location: android/app/build/outputs/apk/debug/"
        ls -la app/build/outputs/apk/debug/
        ;;
        
    "release")
        echo "🏭 Building RELEASE APK..."
        ./gradlew assembleRelease
        
        echo ""
        echo "🏭 Building RELEASE AAB (Android App Bundle)..."
        ./gradlew bundleRelease
        
        echo ""
        echo "✅ RELEASE BUILD COMPLETE"
        echo "📱 APK Location: android/app/build/outputs/apk/release/"
        echo "📦 AAB Location: android/app/build/outputs/bundle/release/"
        
        echo ""
        echo "📱 APK Files:"
        ls -la app/build/outputs/apk/release/ 2>/dev/null || echo "   No APK files found"
        
        echo ""
        echo "📦 AAB Files:"
        ls -la app/build/outputs/bundle/release/ 2>/dev/null || echo "   No AAB files found"
        ;;
        
    "all")
        echo "🔧 Building DEBUG APK..."
        ./gradlew assembleDebug
        
        echo ""
        echo "🏭 Building RELEASE APK..."
        ./gradlew assembleRelease
        
        echo ""
        echo "🏭 Building RELEASE AAB..."
        ./gradlew bundleRelease
        
        echo ""
        echo "✅ ALL BUILDS COMPLETE"
        echo "======================================="
        echo "🔧 DEBUG APK: android/app/build/outputs/apk/debug/"
        echo "🏭 RELEASE APK: android/app/build/outputs/apk/release/"
        echo "📦 RELEASE AAB: android/app/build/outputs/bundle/release/"
        
        echo ""
        echo "📊 Build Summary:"
        echo "----------------"
        
        if [ -d "app/build/outputs/apk/debug/" ]; then
            echo "🔧 Debug APK files:"
            ls -la app/build/outputs/apk/debug/
            echo ""
        fi
        
        if [ -d "app/build/outputs/apk/release/" ]; then
            echo "🏭 Release APK files:"
            ls -la app/build/outputs/apk/release/
            echo ""
        fi
        
        if [ -d "app/build/outputs/bundle/release/" ]; then
            echo "📦 Release AAB files:"
            ls -la app/build/outputs/bundle/release/
        fi
        ;;
        
    *)
        echo "❌ Invalid build mode: $BUILD_MODE"
        echo "   Usage: ./build-android.sh [debug|release|all]"
        exit 1
        ;;
esac

# Return to project root
cd ..

echo ""
echo "🎯 Distribution Guide"
echo "===================="
echo "📱 APK (Android Package):"
echo "   • For direct installation and testing"
echo "   • Sideloading and manual distribution"
echo "   • File sharing and internal testing"
echo ""
echo "📦 AAB (Android App Bundle):"
echo "   • For Google Play Store upload"
echo "   • Optimized delivery by Google Play"
echo "   • Smaller download sizes for users"
echo "   • Required for Play Store publishing"
echo ""
echo "🚀 Next Steps:"
echo "   1. Test APK on devices for functionality"
echo "   2. Upload AAB to Google Play Console"
echo "   3. Use APK for beta testing and distribution"

echo ""
echo "✨ Build completed successfully! 🎉"
