import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import pkg from './package.json' assert { type: 'json' };

export default [
  // CommonJS (for Node) and ES module (for bundlers) build.
  {
    input: 'src/Badger.js',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
        plugins: [terser()]
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true,
        exports: 'named',
        plugins: [terser()]
      }
    ],
    plugins: [
      nodeResolve(),
      commonjs()
    ],
    external: [
      "@abw/badger-codecs",
      "@abw/badger-filesystem",
      "node:fs",
      "node:path",
      "node:process",
      "node:fs/promises",
      "js-yaml",
      "commander",
      "prompts"
    ],
  }
];
