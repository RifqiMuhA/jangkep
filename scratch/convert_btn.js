const sharp = require('sharp');
const fs = require('fs');
sharp('public/games/game3/button_selesai.png')
  .webp({ quality: 80 })
  .toFile('public/games/game3/button_selesai.webp')
  .then(() => {
    console.log('Converted successfully');
    fs.unlinkSync('public/games/game3/button_selesai.png');
    console.log('PNG deleted');
  })
  .catch(err => console.error(err));
