const sharp = require('sharp');
sharp('public/games/game3/frame_background.png')
  .webp({ quality: 80 })
  .toFile('public/games/game3/frame_background.webp')
  .then(() => console.log('Converted successfully'))
  .catch(err => console.error(err));
