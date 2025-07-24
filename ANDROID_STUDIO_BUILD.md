# Android Studio Build Guide - Cool FP Converter

## 🚀 Building APK and AAB in Android Studio

### 📋 Pre-Build Checklist
- ✅ Web assets built and synced (`npm run build && npx cap sync android`)
- ✅ Android Studio project opened
- ✅ Device connected or emulator running (for testing)

## 🔨 Building Release APK

### Method 1: Build Menu (Recommended)
1. **Open Build Menu:** `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
2. **Wait for build:** Android Studio will show progress in the bottom panel
3. **Success notification:** Click "locate" when build completes
4. **File location:** `android/app/build/outputs/apk/release/app-release.apk`

### Method 2: Gradle Tasks Panel
1. **Open Gradle panel:** View → Tool Windows → Gradle
2. **Navigate to:** `:app` → `Tasks` → `build` → `assembleRelease`
3. **Double-click** `assembleRelease` to start build

## 📦 Building Release AAB (Android App Bundle)

### Method 1: Build Menu (Recommended)
1. **Open Build Menu:** `Build` → `Build Bundle(s) / APK(s)` → `Build Bundle(s)`
2. **Wait for build:** Progress shown in bottom panel
3. **Success notification:** Click "locate" when build completes
4. **File location:** `android/app/build/outputs/bundle/release/app-release.aab`

### Method 2: Gradle Tasks Panel
1. **Open Gradle panel:** View → Tool Windows → Gradle
2. **Navigate to:** `:app` → `Tasks` → `build` → `bundleRelease`
3. **Double-click** `bundleRelease` to start build

## 🔧 Building Debug APK (For Testing)

### Quick Debug Build
1. **Build Menu:** `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
2. **Or use Gradle:** `:app` → `Tasks` → `build` → `assembleDebug`
3. **File location:** `android/app/build/outputs/apk/debug/app-debug.apk`

## 📱 Installing and Testing

### Install APK on Connected Device
1. **Build → Make Project** (or Ctrl+F9 / Cmd+F9)
2. **Run → Run 'app'** (or Shift+F10 / Ctrl+R)
3. **Or drag APK** from output folder to device

### Testing Checklist
- [ ] App installs successfully
- [ ] App icon appears in launcher
- [ ] All features work as expected
- [ ] Test both portrait and landscape orientations
- [ ] Test on different screen sizes if available

## 📂 Output File Locations

After successful builds, find your files here:

```
android/app/build/outputs/
├── apk/
│   ├── debug/
│   │   └── app-debug.apk           # Debug version
│   └── release/
│       └── app-release.apk         # Release APK
└── bundle/
    └── release/
        └── app-release.aab         # Release AAB for Play Store
```

## 🎯 Build Variants and Configurations

### Build Types Available
- **Debug:** Fast build, includes debugging info, auto-signed
- **Release:** Optimized build, signed with release key, ready for distribution

### Switching Build Variants
1. **Open Build Variants panel:** View → Tool Windows → Build Variants
2. **Select build type:** Debug or Release from dropdown
3. **Build accordingly**

## 📝 Build Configuration Files

### Key Configuration Files
- `android/app/build.gradle` - App-level build configuration
- `android/build.gradle` - Project-level build configuration
- `android/gradle.properties` - Gradle properties
- `android/local.properties` - Local SDK paths

### Version Management
Edit `android/app/build.gradle`:
```gradle
android {
    defaultConfig {
        versionCode 1        // Increment for each release
        versionName "1.0.0"  // User-facing version
    }
}
```

## 🔐 Signing Configuration

Your app is configured with:
- **Debug builds:** Auto-signed with debug keystore
- **Release builds:** Signed with your production keystore
- **Keystore location:** `android/app/release-key.keystore`

## 🚨 Troubleshooting

### Common Issues and Solutions

**Build Failed:**
- Clean project: `Build` → `Clean Project`
- Rebuild: `Build` → `Rebuild Project`
- Invalidate caches: `File` → `Invalidate Caches and Restart`

**Gradle Sync Issues:**
- Check internet connection
- Update Gradle wrapper if prompted
- Sync project: `File` → `Sync Project with Gradle Files`

**Signing Issues:**
- Verify keystore exists: `android/app/release-key.keystore`
- Check `gradle.properties.local` for correct keystore passwords

**Out of Memory:**
- Increase heap size in `gradle.properties`:
```properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=512m
```

## ⚡ Performance Tips

### Faster Builds
1. **Enable parallel builds:** Already configured in `gradle.properties`
2. **Use build cache:** Already enabled
3. **Close unnecessary projects:** File → Close Project for unused projects
4. **Increase RAM allocation:** Help → Edit Custom VM Options

### Build Optimization
- Use `assembleRelease` for final APK builds
- Use `bundleRelease` for Play Store uploads
- Use `assembleDebug` for quick testing

## 🎉 Success Checklist

After building:
- [ ] APK/AAB files generated in correct output directories
- [ ] File sizes are reasonable (APK ~4-5MB, AAB ~4MB)
- [ ] Test installation on real device
- [ ] Verify app functionality
- [ ] Check app appears correctly in launcher
- [ ] Test adaptive margins look good

## 📤 Next Steps

### For Google Play Store
1. Upload `app-release.aab` to Play Console
2. AAB provides optimized delivery to users

### For Direct Distribution
1. Share `app-release.apk` directly
2. Users need to enable "Install from Unknown Sources"

### For Beta Testing
1. Use either APK or AAB
2. Consider using Play Console's internal testing track

---

**💡 Pro Tip:** Keep Android Studio's Event Log open (View → Tool Windows → Event Log) to monitor build progress and catch any issues early.
