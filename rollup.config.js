import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';

export default [
  // browser-friendly UMD build
  {
    input: 'src/badger.js',
    output: {
      name: 'badger',
      file: pkg.browser,
      format: 'umd'
    },
    plugins: [
      resolve(), // so Rollup can find `ms`
      commonjs() // so Rollup can convert `ms` to an ES module
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  {
    input: 'src/badger.js',
    external: ['ms'],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ]
  }
];
