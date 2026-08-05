#!/bin/sh
set -eu

LOCKFILE=/app/package-lock.json
STAMPFILE=/app/node_modules/.dexta-package-lock.sha256

current_lock_hash="$(sha256sum "$LOCKFILE" | cut -d ' ' -f 1)"
installed_lock_hash=""
swc_installed=false

if [ -f "$STAMPFILE" ]; then
  installed_lock_hash="$(sed -n '1p' "$STAMPFILE")"
fi

for swc_package in /app/node_modules/@next/swc-linux-*-musl; do
  if [ -d "$swc_package" ]; then
    swc_installed=true
    break
  fi
done

if [ ! -d /app/node_modules/next ] || [ "$current_lock_hash" != "$installed_lock_hash" ] || [ "$swc_installed" != true ]; then
  echo "Dependencies changed; synchronizing the development volume..."
  npm ci --include=optional
  printf '%s\n' "$current_lock_hash" > "$STAMPFILE"
fi

chown -R node:node /app/node_modules /app/.next
exec su-exec node "$@"
