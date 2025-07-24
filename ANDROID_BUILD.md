# Android Build Guide for Cool FP Converter

## 📦 Build Formats

### APK (Android Package)
- **Purpose**: Direct installation and testing
- **Use cases**: 
  - Sideloading on devices
  - Manual distribution
  - Beta testing
  - Internal company distribution
- **File size**: Larger (contains all resources)
- **Installation**: Direct `.apk` file installation

### AAB (Android App Bundle)
- **Purpose**: Google Play Store distribution
- **Use cases**:
  - Play Store publishing (required since 2021)
  - Optimized app delivery
  - Dynamic feature modules
- **File size**: Smaller downloads for users
- **Installation**: Only through Google Play Store

## 🚀 Build Commands

### NPM Scripts (Recommended)
```bash
# Build release APK only
npm run build:android-apk

# Build release AAB only
npm run build:android-aab

# Build both APK and AAB
npm run build:android-all

# Build debug APK for testing
npm run build:android-debug

# Open Android Studio (for manual builds)
npm run build:android
```

### Shell Script (Advanced)
```bash
# Build release versions (APK + AAB)
./build-android.sh release

# Build debug version (APK only)
./build-android.sh debug

# Build all versions (debug APK + release APK + release AAB)
./build-android.sh all
```

### Manual Gradle Commands
```bash
# In android/ directory:
./gradlew assembleRelease     # Build release APK
./gradlew bundleRelease       # Build release AAB
./gradlew assembleDebug       # Build debug APK
```

## 📁 Output Locations

After building, files will be located at:

```
android/app/build/outputs/
├── apk/
│   ├── debug/
│   │   └── app-debug.apk
│   └── release/
│       └── app-release.apk
└── bundle/
    └── release/
        └── app-release.aab
```

## 🎯 When to Use Each Format

| Scenario | Format | Reason |
|----------|--------|--------|
| **Google Play Store** | AAB | Required for store publishing |
| **Beta Testing** | APK | Easy to share and install |
| **Internal Distribution** | APK | Direct installation without store |
| **Development Testing** | Debug APK | Includes debugging info |
| **Production Release** | Both | APK for direct distribution, AAB for store |

## 🔐 Signing Information

Your app is configured with:
- **Debug builds**: Auto-signed with debug keystore
- **Release builds**: Signed with your production keystore
- **Keystore location**: `android/app/release-key.keystore`
- **Key alias**: `release-key`

## ✅ Build Checklist

Before building for production:

- [ ] Update version in `android/app/build.gradle`
- [ ] Test on multiple devices
- [ ] Verify app signing configuration
- [ ] Test both portrait and landscape orientations
- [ ] Validate all features work offline
- [ ] Check file sizes are reasonable
- [ ] Test installation from APK
- [ ] Verify AAB uploads to Play Console successfully

## 🚀 Quick Start

For most users, this is the recommended workflow:

1. **Development & Testing**:
   ```bash
   npm run build:android-debug
   ```

2. **Release Preparation**:
   ```bash
   npm run build:android-all
   ```

3. **Distribution**:
   - Use `.apk` for direct sharing
   - Use `.aab` for Google Play Store upload
