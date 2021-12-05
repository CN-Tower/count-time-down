const babel = require('rollup-plugin-babel');
const { terser } = require('rollup-plugin-terser');
const pkg = require('./package.json');

const banner = `\
/*!
 * count-time-down@${pkg.version}
 * A helpful countdown class, 一个实用的的倒计时类
 */
`;

const getConfig = isMinify => ({
  input: 'src/index.js',
  plugins: [babel(), ...(isMinify ? [terser()] : [])],
  external: [],
  output: {
    name: 'CountDown',
    file: `index.${isMinify ? 'min.' : ''}js`,
    format: 'umd',
    banner: banner,
    exports: 'named',
    ...(
      isMinify ? { sourcemap: true } : {}
    ),
  },
});

export default [
  getConfig(),
  getConfig(true),
];
