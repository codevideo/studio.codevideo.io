#!/usr/bin/env bash
# Puts the bundled runtime into the macOS app and makes the disk image.
#
#   package-macos.sh <CodeVideo Studio.app> <runtime-dir> <output.dmg>
#
# Tauri's own resource copy turns symlinks into copies, which breaks Chrome's
# framework (and its signature), so the runtime goes in with ditto after
# `tauri build --bundles app`. The app is then signed again: ad-hoc unless
# APPLE_SIGNING_IDENTITY names a Developer ID (signing for real is a TODO, see
# docs/desktop.md).
set -euo pipefail

if [ $# -ne 3 ]; then
  echo "usage: $0 <app> <runtime-dir> <output.dmg>" >&2
  exit 2
fi
APP=$1
RUNTIME=$2
DMG=$3
IDENTITY=${APPLE_SIGNING_IDENTITY:--}

[ -f "$RUNTIME/manifest.json" ] || { echo "$RUNTIME has no manifest.json; run prepare-runtime.mjs first" >&2; exit 1; }

rm -rf "$APP/Contents/Resources/runtime"
ditto "$RUNTIME" "$APP/Contents/Resources/runtime"
codesign --force --sign "$IDENTITY" "$APP"
codesign --verify --deep --strict "$APP"
echo "Signed $(basename "$APP") ($IDENTITY), $(du -sh "$APP" | cut -f1)"

STAGE=$(mktemp -d "${TMPDIR:-/tmp}/codevideo-dmg.XXXXXX")
trap 'rm -rf "$STAGE"' EXIT
ditto "$APP" "$STAGE/$(basename "$APP")"
ln -s /Applications "$STAGE/Applications"
rm -f "$DMG"
mkdir -p "$(dirname "$DMG")"
# On GitHub's macOS runners hdiutil now and then fails with "Resource busy"
# (actions/runner-images#7522), so it gets a few tries.
for attempt in 1 2 3 4 5; do
  if hdiutil create -quiet -volname "CodeVideo Studio" -srcfolder "$STAGE" -fs HFS+ -format ULMO -ov "$DMG"; then
    break
  fi
  if [ "$attempt" -eq 5 ]; then
    echo "hdiutil create failed 5 times" >&2
    exit 1
  fi
  echo "hdiutil create failed (try $attempt of 5), trying again in 15 s" >&2
  sleep 15
done
echo "Made $DMG ($(du -h "$DMG" | cut -f1))"
