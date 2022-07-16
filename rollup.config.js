//import resolve from '@rollup/plugin-node-resolve';
//import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';

// Silence circular dependency warnings
const ignoreWarnings = {
  'Circular dependency: src/Badger/Filesystem/File.js -> src/Badger/Filesystem/Directory.js -> src/Badger/Filesystem/File.js': true,
};

const onwarn = (warning, warn) => {
  if (
    warning.code === 'CIRCULAR_DEPENDENCY'
    && ignoreWarnings[warning.message]
  ) {
    return
  }
  warn(warning);
}

export default [
  //// browser-friendly UMD build
  //{
  //  input: 'src/Badger.js',
  //  output: {
  //    name: 'badger',
  //    file: pkg.browser,
  //    format: 'umd',
  //    exports: 'named'
  //  },
  //  plugins: [
  //    resolve(),
  //    commonjs()
  //  ]
  //},

  // CommonJS (for Node) and ES module (for bundlers) build.
  {
    input: 'src/Badger.js',
    //plugins: [
    //  resolve(),
    //  commonjs()
    //],
    external: ["fs", "js-yaml", "fs-extra", "path", "fs/promises"],
    onwarn,
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        exports: 'named'
      },
      {
        file: pkg.module,
        format: 'es',
        exports: 'named'
      }
    ]
  }
];
