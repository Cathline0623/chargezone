#!/usr/bin/env bash
set -euo pipefail

export MOBILE_TARGET=emulator
export ANDROID_VERSION=15

echo "Waiting for device to be fully booted"
adb wait-for-device
until [ "$(adb shell getprop sys.boot_completed | tr -d '\r')" = "1" ]; do
  sleep 2
done

echo "Android version: $(adb shell getprop ro.build.version.release)"
echo "SDK level: $(adb shell getprop ro.build.version.sdk)"
adb devices

echo "Installing Chargezone APK"
adb install -r apk/merged-uat-new-2.apk

echo "Verifying installation"
adb shell pm list packages | grep chargezone

echo "Resolving launch activity (for debugging)"
adb shell cmd package resolve-activity --brief com.dev.chargezone || true

echo "Starting WebdriverIO automation"
npx wdio run ./wdio.conf.js