#!/usr/bin/env bash
set -euo pipefail

export MOBILE_TARGET=emulator
export ANDROID_VERSION=14

APP_TARGET="${APP_TARGET:-chargezone}"
SPEC="${SPEC:-}"

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
    APK="apk/healync.apk"            # CHANGE to your real Healync APK file name
    PKG="com.healync.healync_mobile"
    DEFAULT_SPECS="Healync_Login.js"
    ;;
  *)
    echo "Unknown APP_TARGET: $APP_TARGET"
    exit 1
    ;;
esac

echo "Installing $APK"
adb install -r "$APK"

echo "Verifying installation"
adb shell pm list packages | grep "$PKG"

echo "Resolving launch activity (for debugging)"
adb shell cmd package resolve-activity --brief "$PKG" || true

# Use the typed specs, or fall back to the app's default list
LIST="${SPEC:-$DEFAULT_SPECS}"

SPEC_ARGS=()
IFS=',' read -ra NAMES <<< "$LIST"
for name in "${NAMES[@]}"; do
  name="$(echo "$name" | xargs)"      # trim spaces
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