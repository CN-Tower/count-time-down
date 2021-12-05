const fs = require('fs');
const path = require('path');
const fn = require('funclib');
const pkg = require('../package.json');

/**
 * 美化打包出来的index.js中的注释
 */
fs.writeFileSync(
  'index.js',
  fs.readFileSync('index.js', { encoding: 'utf-8' })
    // 去除多行注释后面的空行
    .replace(/\*\/(?:\r|\n)+(\s*\w*)/gm, '*/\r\n$1')
    // 去除多行注释前面留一个空行
    .replace(/(?:\r|\n)+(\s*\/\*\*)/gm, '\r\n\r\n$1')
    // 行尾的双斜杆注释优化
    .replace(/(?<!^\s*\*.*?)(;|})\s(\/\/.*)(?:[\r|\n]*)(\s*)/gm, `$1\r\n\r\n$3$2\r\n$3`)
    // 去除双斜杆注释后面的空行
    .replace(/(\s*\/\/\s.*)(?:[\r|\n]*)/gm, `$1\r\n`)
);

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
