const fs = require('fs-extra');
const concat = require('concat');

var args = process.argv.slice(2);
const path = args[0]; 

(async function build() {
  const files = [
    './dist/chat-widget/runtime.js',
    './dist/chat-widget/polyfills.js',
    './dist/chat-widget/main.js',
  ];

  await fs.ensureDir('elements');

  await concat(files, path + 'chat-script.js');

  await fs.copyFile('./dist/chat-widget/styles.css',
    path + 'styles.css');

  if (fs.existsSync('./dist/chat-widget/assets/)')) {
    await fs.copy('./dist/chat-widget/assets/',
      path + 'assets');
  }
})()
