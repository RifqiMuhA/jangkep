const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const methodsDir = path.join(__dirname, '../public/kuliner/methods');

async function processImages() {
  console.log('Starting image conversion in:', methodsDir);
  const files = fs.readdirSync(methodsDir);

  for (const file of files) {
    if (file.endsWith('.png')) {
      const inputPath = path.join(methodsDir, file);
      const outputFilename = file.replace('.png', '.webp');
      const outputPath = path.join(methodsDir, outputFilename);

      console.log(`Processing: ${file}`);
      
      try {
        await sharp(inputPath)
          .webp({ quality: 80 })
          .toFile(outputPath);
        
        console.log(`✓ Converted to ${outputFilename}`);

        // If it's tombol_kiri.png, we also create a flipped version
        if (file === 'tombol_kiri.png') {
          const rightOutputPath = path.join(methodsDir, 'tombol_kanan.webp');
          await sharp(inputPath)
            .flop() // horizontally flip
            .webp({ quality: 80 })
            .toFile(rightOutputPath);
          console.log(`✓ Flipped and saved to tombol_kanan.webp`);
        }

        // Delete the original PNG
        fs.unlinkSync(inputPath);
        console.log(`✗ Deleted original ${file}`);

      } catch (err) {
        console.error(`Error processing ${file}:`, err);
      }
    }
  }
  console.log('All done!');
}

processImages();
