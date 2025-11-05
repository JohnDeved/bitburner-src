#!/bin/bash
# Build the headless module to JavaScript

cd "$(dirname "$0")/.."

echo "Building headless module..."

# Compile TypeScript to JavaScript
npx tsc -p headless/tsconfig.json --noEmit false

echo "✅ Build complete!"
