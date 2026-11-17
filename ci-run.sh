#!/usr/bin/env bash
set -euo pipefail

export MOBILE_TARGET=emulator
export ANDROID_VERSION=14

APP_TARGET="${APP_TARGET:-chargezone}"
SPEC="${SPEC:-}"

mkdir -p screenshots logs

# Save logcat even when tests fail, and stop the dialog watcher
WATCHER_PID=""
cleanup() {
  adb logcat -d -t 1500 > logs/logcat.txt 2>&1 || true
  if [ -n "$WATCHER_PID" ]; then kill "$WATCHER_PID" 2>/dev/null || true; fi
}
trap cleanup EXIT

echo "App target : $APP_TARGET"
echo "Spec       : ${SPEC:-default for app}"

echo "Waiting for device to be fully booted"
adb wait-for-device
until [ "$(adb shell getprop sys.boot_completed | tr -d '\r')" = "1" ]; do
  sleep 2
done

echo "Android version: $(adb shell getprop ro.build.version.release)"
echo "SDK level: $(adb shell getprop ro.build.version.sdk)"
adb devices

case "$APP_TARGET" in
  chargezone)
    APK="apk/merged-uat-new-2.apk"
    PKG="com.dev.chargezone"
    DEFAULT_SPECS="chargezone_AddWallet.js,chargezone_Home.js,chargezone.js,Edit_Profile.js,My_EV.js"
    ;;
  healync)
    APK="apk/healyncapp-release-1.apk"
    PKG="com.healync.healync_mobile"
    DEFAULT_SPECS="Healync_Login.js"
    ;;
  *)
    echo "Unknown APP_TARGET: $APP_TARGET"
    exit 1
    ;;
esac

# Reduce load and hide error dialogs on the slow CI emulator
adb shell settings put global hide_error_dialogs 1 || true
adb shell settings put global window_animation_scale 0 || true
adb shell settings put global transition_animation_scale 0 || true
adb shell settings put global animator_duration_scale 0 || true

# Let the system finish background work (launcher, Play services) after boot
echo "Letting the system settle"
sleep 45

echo "Installing $APK"
adb install -r "$APK"

echo "Verifying installation"
adb shell pm list packages | grep "$PKG"

echo "Resolving launch activity (for debugging)"
adb shell cmd package resolve-activity --brief "$PKG" || true

# Background watcher: if an "isn't responding" dialog appears, tap "Wait"
dismiss_anr() {
  while true; do
    if adb shell dumpsys window 2>/dev/null | grep -qi "isn't responding\|Application Not Responding"; then
      echo "ANR dialog detected, pressing Wait"
      adb shell input keyevent KEYCODE_DPAD_DOWN || true
      adb shell input keyevent KEYCODE_DPAD_DOWN || true
      adb shell input keyevent KEYCODE_ENTER || true
    fi
    sleep 3
  done
}
dismiss_anr &
WATCHER_PID=$!

# Warm-up launch so the first real launch is not slow
echo "Warm-up launch"
adb shell monkey -p "$PKG" -c android.intent.category.LAUNCHER 1 || true
sleep 25
echo "Focused window after warm-up:"
adb shell dumpsys window | grep -E "mCurrentFocus|mFocusedApp" || true
adb exec-out screencap -p > screenshots/warmup.png || true
adb shell am force-stop "$PKG" || true
sleep 3

# Use the selected specs, or fall back to the app's default list
LIST="${SPEC:-$DEFAULT_SPECS}"

SPEC_ARGS=()
IFS=',' read -ra NAMES <<< "$LIST"
for name in "${NAMES[@]}"; do
  name="$(echo "$name" | xargs)"
  [ -z "$name" ] && continue
  if [ ! -f "test/specs/$name" ]; then
    echo "ERROR: test/specs/$name not found (names are case-sensitive)"
    exit 1
  fi
  SPEC_ARGS+=(--spec "./test/specs/$name")
done

echo "Running specs: $LIST"
npx wdio run ./wdio.conf.js "${SPEC_ARGS[@]}"































# #!/usr/bin/env bash
# set -euo pipefail

# export MOBILE_TARGET=emulator
# export ANDROID_VERSION=15

# echo "Waiting for device to be fully booted"
# adb wait-for-device
# until [ "$(adb shell getprop sys.boot_completed | tr -d '\r')" = "1" ]; do
#   sleep 2
# done

# echo "Android version: $(adb shell getprop ro.build.version.release)"
# echo "SDK level: $(adb shell getprop ro.build.version.sdk)"
# adb devices

# echo "Installing Chargezone APK"
# adb install -r apk/merged-uat-new-2.apk

# echo "Verifying installation"
# adb shell pm list packages | grep chargezone

# echo "Resolving launch activity (for debugging)"
# adb shell cmd package resolve-activity --brief com.dev.chargezone || true

# echo "Starting WebdriverIO automation"
# npx wdio run ./wdio.conf.js