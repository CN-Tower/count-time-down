const fs = require('fs');
const path = require('path');
const fn = require('funclib');
const pkg = require('../package.json');

let build = fs.readFileSync('index.js', { encoding: 'utf-8' });

build = build
  // 去除多行注释后面的空行
  .replace(/\*\/(?:\r|\n)+(\s*\w*)/gm, '*/\r\n$1')
  // 去除多行注释前面留一个空行
  .replace(/(?:\r|\n)+(\s*\/\*\*)/gm, '\r\n\r\n$1');

fs.writeFileSync('index.js', build);

const version = `time-cd@${pkg.version}`;
const indexPath = path.resolve(__dirname, '../index.js');
const indexMinPath = path.resolve(__dirname, '../index.min.js');

fn.log(`
${fn.chalk('构建成功！', 'green')} ${fn.chalk(version, 'cyan')}

index.js ${fn.chalk(fn.size(indexPath) + 'kb', 'cyan')}
  ${fn.chalk(indexPath, 'blue')}

index.min.js ${fn.chalk(fn.size(indexMinPath) + 'kb', 'cyan')}
  ${fn.chalk(indexMinPath, 'blue')}
`, 'time-cd');