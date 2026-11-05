#!/bin/sh
set -eu

LOCKFILE=/app/package-lock.json
STAMPFILE=/app/node_modules/.dexta-package-lock.sha256

current_lock_hash=""
if [ -f "$LOCKFILE" ]; then
  current_lock_hash="$(sha256sum "$LOCKFILE" | cut -d ' ' -f 1)"
fi

installed_lock_hash=""
swc_installed=false
oxide_installed=false
lightningcss_installed=false

if [ -f "$STAMPFILE" ]; then
  installed_lock_hash="$(sed -n '1p' "$STAMPFILE")"
fi

for swc_package in /app/node_modules/@next/swc-linux-*-musl; do
  if [ -d "$swc_package" ]; then
    swc_installed=true
    break
  fi
done

for oxide_package in /app/node_modules/@tailwindcss/oxide-linux-*-musl; do
  if [ -d "$oxide_package" ]; then
    oxide_installed=true
    break
  fi
done

for lightningcss_package in /app/node_modules/lightningcss-linux-*-musl; do
  if [ -d "$lightningcss_package" ]; then
    lightningcss_installed=true
    break
  fi
done

if [ ! -d /app/node_modules/next ] || \
  [ -n "$current_lock_hash" -a "$current_lock_hash" != "$installed_lock_hash" ] || \
  [ "$swc_installed" != true ] || \
  [ "$oxide_installed" != true ] || \
  [ "$lightningcss_installed" != true ]; then
  echo "Dependencies changed or missing native packages; synchronizing the development volume..."
  npm ci --include=optional
  if [ -n "$current_lock_hash" ]; then
    printf '%s\n' "$current_lock_hash" > "$STAMPFILE"
  fi
  chown -R node:node /app/node_modules
fi

mkdir -p /app/.next
chown -R node:node /app/.next

if [ "$(stat -c '%u' /app/node_modules 2>/dev/null || true)" != "1000" ]; then
  chown -R node:node /app/node_modules
fi

exec su-exec node "$@"
