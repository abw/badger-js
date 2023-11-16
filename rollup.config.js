import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy'
import { nodeResolve } from '@rollup/plugin-node-resolve';
import pkg from './package.json' assert { type: 'json' };

export default {
  // CommonJS (for Node) and ES module (for bundlers) build.
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
  external: [
    "@abw/badger-codecs",
    "@abw/badger-filesystem",
    "@abw/badger-timestamp",
    "@abw/badger-utils",
    "node:fs",
    "node:path",
    "node:process",
    "node:fs/promises",
    "dotenv",
    "js-yaml",
    "commander",
    "prompts",
    "chokidar"
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    copy({
      targets: [
        {
          src: 'bin/*',
          dest: 'dist/bin',
          transform: (contents) =>
            contents.toString().replace('../src/Badger.js', '@abw/badger')
        },
      ],
    }),
  ],
}
