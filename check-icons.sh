#!/bin/bash

# Cool FP Converter - Icon Verification Script
# Checks if all icons are properly accessible

echo "🎨 Cool FP Converter - Icon Verification"
echo "========================================"

BASE_URL="http://localhost:4173/floating-point-conve"

# Check if preview server is running
if ! curl -s "$BASE_URL" > /dev/null; then
    echo "⚠️  Local preview server not running!"
    echo "🚀 Starting preview server..."
    npm run preview &
    sleep 3
    BASE_URL="http://localhost:4173/floating-point-conve"
fi

echo "🔍 Checking icon accessibility..."
echo ""

# Icon files to check
icons=(
    "icon.svg"
    "icon.png" 
    "icon-192.png"
    "icon-512.png"
    "favicon-16x16.png"
    "favicon-32x32.png"
    "apple-touch-icon.png"
    "manifest.json"
)

success_count=0
total_count=${#icons[@]}

for icon in "${icons[@]}"; do
    url="$BASE_URL/$icon"
    if curl -s --head "$url" | head -n 1 | grep -q "200 OK"; then
        echo "✅ $icon - OK"
        ((success_count++))
    else
        echo "❌ $icon - FAILED"
    fi
done

echo ""
echo "📊 Results: $success_count/$total_count icons accessible"

if [ $success_count -eq $total_count ]; then
    echo "🎉 All icons are working correctly!"
    echo ""
    echo "🌐 GitHub Pages Deployment:"
    echo "   Your icons will be available at:"
    echo "   https://phoenixjyb.github.io/floating-point-conve/"
    echo ""
    echo "🔗 Quick Test:"
    echo "   - Open the web app in browser"
    echo "   - Check browser tab for favicon"
    echo "   - Try 'Add to Home Screen' for app icon"
    echo "   - Install as PWA to verify all icons"
else
    echo "⚠️  Some icons are not loading correctly!"
    echo "💡 This might be normal if preview server just started."
    echo "   Try running this script again in a few seconds."
fi

echo ""
echo "🛠️  Local Testing URLs:"
echo "   App: $BASE_URL"
echo "   Manifest: $BASE_URL/manifest.json"
echo "   Main Icon: $BASE_URL/icon.png"
