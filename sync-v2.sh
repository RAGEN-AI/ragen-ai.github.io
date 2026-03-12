#!/bin/bash
# Sync RV-Filter-Website build to ragen-ai.github.io/public/v2/
# Usage: ./sync-v2.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
RV_FILTER_DIR="$SCRIPT_DIR/../RV-Filter-Website"
V2_PUBLIC_DIR="$SCRIPT_DIR/public/v2"

echo "Building RV-Filter-Website with base=/v2/ ..."
cd "$RV_FILTER_DIR"
SITE_URL="https://ragen-ai.github.io" SITE_BASE="/v2/" node_modules/.bin/astro build

echo "Syncing build output to public/v2/ ..."
rm -rf "$V2_PUBLIC_DIR"
cp -r "$RV_FILTER_DIR/dist/" "$V2_PUBLIC_DIR"

echo "Done. public/v2/ is up to date."
