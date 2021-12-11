import nresolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import formatter from 'rollup-plugin-formatter';
const { terser } = require('rollup-plugin-terser');
const pkg = require('./package.json');

const banner = `\
/*!
 * count-time-down@${pkg.version}
 * A helpful countdown class, 一个实用的的倒计时类
 */`;

const getConfig = isMinify => ({
  input: 'src/index.js',
  plugins: [
    nresolve(),
    commonjs(),
    babel(),
    ...(isMinify ? [terser()] : []),
    formatter(),
  ],
  external: [],
  output: {
    file: `index.${isMinify ? 'min.' : ''}js`,
    format: 'umd',
    banner: banner,
    name: 'CountDown',
    exports: 'auto',
    ...(isMinify ? { sourcemap: true } : {}),
  },
});

export default [
  getConfig(),
  getConfig(true),
];
