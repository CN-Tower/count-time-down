const fn = require('funclib');
const path = require('path');
const pkg = require('../package.json');

/**
 * 打印构建信息
 */
const version = fn.chalk(`count-time-down@${pkg.version}`, 'cyan');
const indexPath = path.resolve(__dirname, '../index.js');
const indexMinPath = path.resolve(__dirname, '../index.min.js');
fn.log(`
${fn.chalk('构建成功！', 'green')} ${version}

index.js ${fn.chalk(fn.size(indexPath) + 'kb', 'cyan')}
  ${fn.chalk(indexPath, 'blue')}

index.min.js ${fn.chalk(fn.size(indexMinPath) + 'kb', 'cyan')}
  ${fn.chalk(indexMinPath, 'blue')}
`, 'count-time-down');
