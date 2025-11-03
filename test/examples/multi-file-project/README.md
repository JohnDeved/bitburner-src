# Multi-File Project Example

This example demonstrates how to work with multiple files in your Bitburner scripts, just like in the game.

## Files

- `main.js` - Main entry point
- `calculator.js` - Worker script that performs calculations
- `math-utils.js` - Utility library with helper functions
- `config.txt` - Configuration file with settings

## Usage

Upload all files to the home server at once:

```bash
npx JohnDeved/bitburner-src test/examples/multi-file-project/main.js \
  --files calculator.js,math-utils.js,config.txt
```

Or with the short form:

```bash
npx JohnDeved/bitburner-src test/examples/multi-file-project/main.js \
  -f calculator.js,math-utils.js,config.txt
```

## How it works

1. **Main script** is automatically uploaded
2. **--files** explicitly uploads additional files to home server
3. **Auto-detection** also finds files referenced in your code
4. All files are available for `ns.read()`, `ns.exec()`, `ns.scp()`, etc.

This matches how you'd work with files in the actual Bitburner game!
