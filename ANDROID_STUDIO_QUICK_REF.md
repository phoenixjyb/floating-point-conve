# Quick Android Studio Build Reference

## 🚀 Most Common Build Tasks

### 📱 For Testing (Debug APK)
```
Build → Build Bundle(s) / APK(s) → Build APK(s)
```
**Output:** `android/app/build/outputs/apk/debug/app-debug.apk`

### 🎯 For Distribution (Release APK)
```
Build → Build Bundle(s) / APK(s) → Build APK(s)
```
**Make sure:** Build variant is set to "Release"
**Output:** `android/app/build/outputs/apk/release/app-release.apk`

### 📦 For Play Store (Release AAB)
```
Build → Build Bundle(s) / APK(s) → Build Bundle(s)
```
**Output:** `android/app/build/outputs/bundle/release/app-release.aab`

## ⚡ Keyboard Shortcuts

| Task | Windows/Linux | macOS |
|------|---------------|-------|
| Build Project | `Ctrl+F9` | `Cmd+F9` |
| Run App | `Shift+F10` | `Ctrl+R` |
| Clean Project | - | - |
| Rebuild Project | - | - |

## 🔧 Before Building

1. **Update Web Assets:**
   ```bash
   npm run build && npx cap sync android
   ```

2. **Check Build Variant:**
   - View → Tool Windows → Build Variants
   - Select "release" for production builds

3. **Verify Signing:**
   - Check `gradle.properties.local` exists
   - Ensure keystore file is present

## 📂 Where to Find Built Files

```
android/app/build/outputs/
├── apk/debug/app-debug.apk       # For testing
├── apk/release/app-release.apk   # For sharing
└── bundle/release/app-release.aab # For Play Store
```

## 🚨 If Build Fails

1. **Clean & Rebuild:**
   ```
   Build → Clean Project
   Build → Rebuild Project
   ```

2. **Sync Gradle:**
   ```
   File → Sync Project with Gradle Files
   ```

3. **Invalidate Caches:**
   ```
   File → Invalidate Caches and Restart
   ```
