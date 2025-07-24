# ADB Setup and Android Device Connection Guide

## ✅ ADB Installation Complete!

ADB (Android Debug Bridge) has been successfully installed and added to your PATH.

**Version:** Android Debug Bridge version 1.0.41  
**Location:** `/Users/yanbo/Library/Android/sdk/platform-tools/adb`

## 📱 Connecting Your Android Device

### Step 1: Enable Developer Options
1. Go to **Settings** → **About Phone**
2. Tap **Build Number** 7 times
3. You'll see "You are now a developer!"

### Step 2: Enable USB Debugging
1. Go to **Settings** → **Developer Options**
2. Turn on **USB Debugging**
3. Optionally enable **Stay Awake** (keeps screen on while charging)

### Step 3: Connect Device
1. Connect your Android device via USB cable
2. When prompted on your device, select:
   - **File Transfer (MTP)** or **USB for file transfer**
   - **Allow USB Debugging** (check "Always allow from this computer")

### Step 4: Verify Connection
```bash
adb devices
```

You should see something like:
```
List of devices attached
ABC123DEF456    device
```

## 🚀 Ready for Screenshots!

Once your device is connected, you can:

1. **Take screenshots automatically:**
   ```bash
   ./capture-screenshots.sh
   ```

2. **Install your app for testing:**
   ```bash
   adb install android/app/build/outputs/apk/release/app-release.apk
   ```

3. **Manual screenshot commands:**
   ```bash
   adb exec-out screencap -p > screenshot.png
   ```

## 🔧 Troubleshooting

### Device Not Showing?
- Try a different USB cable
- Restart ADB: `adb kill-server && adb start-server`
- Check device is in File Transfer mode
- Re-allow USB debugging on device

### Permission Denied?
- Check USB debugging is enabled
- Accept the debugging prompt on your device
- Try `adb devices` again

### Device Shows as "Unauthorized"?
- Check your device screen for debugging permission prompt
- Select "Always allow from this computer"
- Run `adb devices` again

## 📋 Quick Commands

```bash
# Check connected devices
adb devices

# Install APK
adb install path/to/app.apk

# Take screenshot
adb exec-out screencap -p > screenshot.png

# Start ADB server
adb start-server

# Stop ADB server
adb kill-server
```

## ✨ You're All Set!

ADB is now configured and ready to use. Connect your Android device and start taking screenshots for your app showcase!
