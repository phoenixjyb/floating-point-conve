#!/bin/bash

# Cool FP Converter - Web Deployment Script
# Builds and serves the web application locally

echo "🚀 Cool FP Converter - Web Deployment"
echo "======================================"

# Build the application
echo "📦 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo ""
echo "🌐 Deployment Options:"
echo ""
echo "1. 📱 Local Development Server:"
echo "   npm run dev"
echo "   → http://localhost:5173"
echo ""
echo "2. 🌍 Local Production Preview:"
echo "   npm run preview"  
echo "   → http://localhost:4173"
echo ""
echo "3. 📤 GitHub Pages (Automatic):"
echo "   → Push to main branch for auto-deployment"
echo "   → Will be available at: https://phoenixjyb.github.io/floating-point-conve"
echo ""
echo "4. 🔧 Manual Static Hosting:"
echo "   → Upload 'dist/' folder to any web server"
echo "   → Works with Netlify, Vercel, Firebase Hosting, etc."
echo ""

# Check if we should start preview
read -p "🎯 Start local preview now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🎉 Starting local preview server..."
    npm run preview
fi
