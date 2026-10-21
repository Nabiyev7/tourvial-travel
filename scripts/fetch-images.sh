#!/usr/bin/env bash
#
# Download the six hero photographs so they can be served from this project
# instead of hotlinked from Unsplash and Pexels.
#
#   ./scripts/fetch-images.sh
#
# Then, in src/data/cities.ts, change each city's `image` to the local path
# printed at the end, and drop `images.remotePatterns` from next.config.ts.
#
# next/image converts the originals to WebP/AVIF on the fly, so there is no
# separate optimisation step — just keep the sources at roughly 2000px wide.

set -euo pipefail

cd "$(dirname "$0")/.."
DEST="public/images"
mkdir -p "$DEST"

# key|url  — keep in sync with src/data/cities.ts
IMAGES=(
  "rim|https://images.unsplash.com/photo-1555992828-ca4dbe41d294?w=2000&q=80"
  "dubai|https://images.unsplash.com/photo-1566972638537-8c04edd6aa4d?w=2000&q=80"
  "istanbul|https://images.pexels.com/photos/19161622/pexels-photo-19161622.jpeg?auto=compress&cs=tinysrgb&w=2000"
  "paris|https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=2000&q=80"
  "tokyo|https://images.unsplash.com/photo-1770752609290-264c53dc54a3?w=2000&q=80"
  "newyork|https://images.pexels.com/photos/14426200/pexels-photo-14426200.jpeg?auto=compress&cs=tinysrgb&w=2000"
)

failed=0
for entry in "${IMAGES[@]}"; do
  key="${entry%%|*}"
  url="${entry#*|}"
  out="$DEST/$key.jpg"

  printf 'Fetching %-10s ' "$key"
  if curl -fsSL --max-time 120 "$url" -o "$out"; then
    printf 'ok (%s)\n' "$(du -h "$out" | cut -f1)"
  else
    printf 'FAILED\n'
    rm -f "$out"
    failed=1
  fi
done

if [ "$failed" -ne 0 ]; then
  echo
  echo "Some downloads failed. Check your network, then re-run." >&2
  exit 1
fi

cat <<'NEXT'

Downloaded. Now in src/data/cities.ts set:

  rim       image: "/images/rim.jpg"
  dubai     image: "/images/dubai.jpg"
  istanbul  image: "/images/istanbul.jpg"
  paris     image: "/images/paris.jpg"
  tokyo     image: "/images/tokyo.jpg"
  newyork   image: "/images/newyork.jpg"

and remove images.remotePatterns from next.config.ts.

Licences: Unsplash and Pexels both allow commercial use. Crediting the
photographers is good practice.
NEXT
