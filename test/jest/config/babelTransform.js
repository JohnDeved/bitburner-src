/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import babelJest from "babel-jest";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

export function process(sourceText, sourcePath, options) {
  const babelTransformer = babelJest.createTransformer({
    presets: [
      [require.resolve('@babel/preset-react')],
      [require.resolve('@babel/preset-env')],
      [require.resolve('@babel/preset-typescript')]
    ],
    plugins: [],  // Removed transform-barrels for npx compatibility
    babelrc: false,
    configFile: false,
  });

  return babelTransformer.process(sourceText, sourcePath, options);
}
