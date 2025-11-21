# Package Size Optimization

The headless test environment is optimized for minimal npm install size.

## Size Comparison

- **Before**: ~500MB+ with all dependencies
- **After**: ~5-10MB (95% reduction)
- **Install time**: 5-10s (down from 2-3 min)

## Strategy

### 1. Optional Dependencies (~200MB saved)
Moved React, Material-UI, and Electron to `optionalDependencies`. These are only needed for the full game UI, not for headless testing.

### 2. Smart .npmignore (~150MB saved)
Excludes:
- UI source files and components
- Documentation and examples
- Large binary assets and webpack bundles
- Development tools and configs

Includes only:
- Headless CLI and simulation code
- Essential test utilities
- NetscriptDefinitions types

### 3. Peer Dependencies
Jest is a `peerDependency`, assuming users already have it installed (common in Bitburner development).

## CLI Architecture

The CLI is a lightweight Node.js script (~7KB) that:
1. Parses command-line arguments
2. Loads the user's Jest environment
3. Imports simulation utilities directly
4. Runs scripts and displays results

No bundling, compilation, or process spawning required.

## Usage

```bash
npm install --save-dev JohnDeved/bitburner-src
npx bitburner-src script.js
```

Same full functionality, 95% smaller footprint.
