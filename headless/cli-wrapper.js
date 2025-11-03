#!/usr/bin/env node

/**
 * Wrapper script to run the TypeScript CLI using tsx
 */

const path = require('path');
const { execSync } = require('child_process');

// Get the path to the CLI script
const cliPath = path.join(__dirname, 'cli.ts');

// Forward all arguments to the CLI
const args = process.argv.slice(2);

// Prepare the command with proper escaping
const escapedArgs = args.map(arg => {
  // Escape quotes in the argument
  const escaped = arg.replace(/"/g, '\\"');
  return `"${escaped}"`;
}).join(' ');

// Use tsx to run the TypeScript CLI directly with tsconfig
const tsconfig = path.join(__dirname, 'tsconfig.cli.json');

try {
  execSync(`npx tsx --tsconfig "${tsconfig}" "${cliPath}" ${escapedArgs}`, {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
} catch (error) {
  process.exit(error.status || 1);
}
