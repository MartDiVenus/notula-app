const sharp = require('sharp');
sharp('public/favicon.svg')
  .resize(512, 512)
  .png()
  .toFile('assets/logo.png')
  .then(() => console.log('Converted successfully'))
  .catch(err => console.error(err));
