#!/usr/bin/env bash
# Builds self-contained ffmpeg and ffprobe for the desktop app from source
# archives that prepare-runtime.mjs has already downloaded and checked against
# runtime.lock.json. macOS and Linux.
#
#   build-ffmpeg.sh <ffmpeg.tar.xz> <x264.tar.bz2> <lame.tar.gz> <output-dir>
#
# The build has what CodeVideo uses: H.264 (x264) and AAC for videos, MP3
# (LAME) for speech takes, and FFmpeg's own decoders, filters and muxers. It
# links nothing from Homebrew or other package managers (--disable-autodetect),
# so the binaries run on any machine. With x264 the binaries are GPL; the
# exact sources are listed in the runtime's manifest.json.
set -euo pipefail

if [ $# -ne 4 ]; then
  echo "usage: $0 <ffmpeg.tar.xz> <x264.tar.bz2> <lame.tar.gz> <output-dir>" >&2
  exit 2
fi
FFMPEG_TAR=$(cd "$(dirname "$1")" && pwd)/$(basename "$1")
X264_TAR=$(cd "$(dirname "$2")" && pwd)/$(basename "$2")
LAME_TAR=$(cd "$(dirname "$3")" && pwd)/$(basename "$3")
mkdir -p "$4"
OUT=$(cd "$4" && pwd)

WORK=$(mktemp -d "${TMPDIR:-/tmp}/codevideo-ffmpeg.XXXXXX")
trap 'rm -rf "$WORK"' EXIT
PREFIX="$WORK/prefix"
JOBS=$(getconf _NPROCESSORS_ONLN 2>/dev/null || echo 4)
# The oldest macOS the app supports (Node 24 needs 13.5). Without this, the
# binaries would only run on the build machine's macOS version or newer.
if [ "$(uname)" = Darwin ]; then
  export MACOSX_DEPLOYMENT_TARGET="${MACOSX_DEPLOYMENT_TARGET:-13.5}"
fi
export PKG_CONFIG_PATH="$PREFIX/lib/pkgconfig"
# Nothing from the machine's own pkg-config paths (Homebrew) may leak in.
export PKG_CONFIG_LIBDIR="$PREFIX/lib/pkgconfig"

echo "==> LAME"
mkdir -p "$WORK/lame" && tar -xzf "$LAME_TAR" -C "$WORK/lame" --strip-components 1
(
  cd "$WORK/lame"
  # lame_init_old is listed for export but not defined (Homebrew patches this too).
  sed -i.bak '/lame_init_old/d' include/libmp3lame.sym
  ./configure --prefix="$PREFIX" --enable-static --disable-shared \
    --disable-frontend --disable-decoder --disable-dependency-tracking >/dev/null
  make -j"$JOBS" >/dev/null
  make install >/dev/null
)

echo "==> x264"
mkdir -p "$WORK/x264" && tar -xjf "$X264_TAR" -C "$WORK/x264" --strip-components 1
(
  cd "$WORK/x264"
  ./configure --prefix="$PREFIX" --enable-static --enable-pic --disable-cli \
    --disable-opencl --disable-lsmash --disable-swscale --disable-lavf --disable-ffms --disable-gpac >/dev/null
  make -j"$JOBS" >/dev/null
  make install-lib-static >/dev/null
)

echo "==> FFmpeg"
mkdir -p "$WORK/ffmpeg" && tar -xJf "$FFMPEG_TAR" -C "$WORK/ffmpeg" --strip-components 1
(
  cd "$WORK/ffmpeg"
  ./configure \
    --prefix="$PREFIX" \
    --pkg-config-flags=--static \
    --extra-cflags="-I$PREFIX/include" \
    --extra-ldflags="-L$PREFIX/lib" \
    --disable-autodetect \
    --disable-shared --enable-static \
    --disable-ffplay --disable-doc --disable-debug \
    --enable-gpl --enable-libx264 --enable-libmp3lame --enable-zlib \
    >"$WORK/ffmpeg-configure.log" || { tail -40 "$WORK/ffmpeg-configure.log"; tail -40 ffbuild/config.log; exit 1; }
  make -j"$JOBS" >/dev/null
)

cp "$WORK/ffmpeg/ffmpeg" "$WORK/ffmpeg/ffprobe" "$OUT/"
cp "$WORK/ffmpeg/COPYING.GPLv2" "$OUT/LICENSE-FFmpeg-GPLv2.txt"
cp "$WORK/x264/COPYING" "$OUT/LICENSE-x264.txt"
cp "$WORK/lame/COPYING" "$OUT/LICENSE-LAME.txt"

# Only the system's own libraries may be linked.
if [ "$(uname)" = Darwin ]; then
  if otool -L "$OUT/ffmpeg" "$OUT/ffprobe" | tail -n +2 | grep -v ':$' | grep -vE '^\s+(/usr/lib/|/System/Library/)'; then
    echo "ffmpeg links a library that isn't part of macOS" >&2
    exit 1
  fi
else
  if ldd "$OUT/ffmpeg" "$OUT/ffprobe" | grep -E '=> (/usr/local|/opt|/home|/nix)'; then
    echo "ffmpeg links a library that isn't part of the system" >&2
    exit 1
  fi
fi
"$OUT/ffmpeg" -hide_banner -version | head -1
"$OUT/ffmpeg" -hide_banner -encoders 2>/dev/null | grep -E ' (libx264|aac|libmp3lame) ' >/dev/null || {
  echo "ffmpeg is missing an encoder CodeVideo needs" >&2
  exit 1
}
