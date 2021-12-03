const babel = require('rollup-plugin-babel');
const { terser } = require('rollup-plugin-terser');
const pkg = require('./package.json');

const banner = `\
/*!
 * time-cd.js(v${pkg.version})
 * A CountDown handler, 一个js的倒计时类。
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
  }
});

export default [
  getConfig(),
  getConfig(true),
]
