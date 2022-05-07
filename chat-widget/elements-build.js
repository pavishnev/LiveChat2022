const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/chat-widget/runtime.js',
    './dist/chat-widget/polyfills.js',
    './dist/chat-widget/main.js',
  ];

  await fs.ensureDir('elements');

  await concat(files, 'elements/chat-script.js');

  await fs.copyFile('./dist/chat-widget/styles.css',
    'elements/styles.css');

  if (fs.existsSync('./dist/chat-widget/assets/)')) {
    await fs.copy('./dist/chat-widget/assets/',
      'elements/assets');
  }
})()
