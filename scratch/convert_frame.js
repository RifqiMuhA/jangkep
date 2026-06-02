const sharp = require('sharp');
const fs = require('fs');
sharp('public/games/game3/frame_jawabangyangbenar.png')
  .webp({ quality: 80 })
  .toFile('public/games/game3/frame_jawabangyangbenar.webp')
  .then(() => {
    console.log('Converted successfully');
    fs.unlinkSync('public/games/game3/frame_jawabangyangbenar.png');
    console.log('PNG deleted');
  })
  .catch(err => console.error(err));
