import { Jimp } from 'jimp';
import fs from 'fs';
import path from 'path';

// Helper to recursively list files in a directory
function getFilesRecursively(dir, filter) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath, filter));
    } else {
      if (!filter || filter(filePath)) {
        results.push(filePath);
      }
    }
  });
  return results;
}

async function optimizeProductImages() {
  const productsDir = 'public/images/products';
  if (!fs.existsSync(productsDir)) {
    console.error('Products directory does not exist:', productsDir);
    return;
  }

  console.log('Scanning for PNG images in:', productsDir);
  const pngFiles = getFilesRecursively(productsDir, filePath => filePath.toLowerCase().endsWith('.png'));
  console.log(`Found ${pngFiles.length} PNG product images.`);

  let successCount = 0;
  let errorCount = 0;
  let totalSavedBytes = 0;

  for (let i = 0; i < pngFiles.length; i++) {
    const pngPath = pngFiles[i];
    const relativePath = path.relative('public', pngPath);
    console.log(`[${i + 1}/${pngFiles.length}] Processing: ${relativePath}`);

    try {
      const origSize = fs.statSync(pngPath).size;
      const image = await Jimp.read(pngPath);
      
      // Target width 800px
      const targetWidth = 800;
      if (image.width > targetWidth) {
        image.resize({ w: targetWidth });
      }

      // Create white background for transparency blending
      const whiteBg = new Jimp({
        width: image.width,
        height: image.height,
        color: 0xFFFFFFFF
      });

      whiteBg.composite(image, 0, 0);

      // Write as JPEG
      const jpegPath = pngPath.substring(0, pngPath.length - 4) + '.jpg';
      const jpegBuffer = await whiteBg.getBuffer('image/jpeg', { quality: 80 });
      fs.writeFileSync(jpegPath, jpegBuffer);

      const newSize = fs.statSync(jpegPath).size;
      const savedBytes = origSize - newSize;
      totalSavedBytes += savedBytes;

      console.log(`  Done: ${(origSize / (1024 * 1024)).toFixed(2)}MB -> ${(newSize / 1024).toFixed(1)}KB (Saved: ${(savedBytes / (1024 * 1024)).toFixed(2)}MB)`);

      // Delete the original PNG file
      fs.unlinkSync(pngPath);
      successCount++;
    } catch (err) {
      console.error(`  Error processing ${relativePath}:`, err.message);
      errorCount++;
    }
  }

  console.log(`\nProduct image optimization complete.`);
  console.log(`Success: ${successCount}, Errors: ${errorCount}`);
  console.log(`Total space saved in product images: ${(totalSavedBytes / (1024 * 1024)).toFixed(2)} MB`);
}

async function optimizeStandaloneImages() {
  const standaloneImages = [
    { src: 'public/images/about_hero.png', dest: 'public/images/about_hero.jpg', maxWidth: 1200 },
    { src: 'public/hero-main.png', dest: 'public/hero-main.jpg', maxWidth: 1600 }
  ];

  for (const img of standaloneImages) {
    if (fs.existsSync(img.src)) {
      console.log(`Optimizing standalone image: ${img.src}`);
      try {
        const origSize = fs.statSync(img.src).size;
        const image = await Jimp.read(img.src);
        
        if (image.width > img.maxWidth) {
          image.resize({ w: img.maxWidth });
        }

        const whiteBg = new Jimp({
          width: image.width,
          height: image.height,
          color: 0xFFFFFFFF
        });
        whiteBg.composite(image, 0, 0);

        const jpegBuffer = await whiteBg.getBuffer('image/jpeg', { quality: 80 });
        fs.writeFileSync(img.dest, jpegBuffer);

        const newSize = fs.statSync(img.dest).size;
        console.log(`  Done: ${(origSize / 1024).toFixed(1)}KB -> ${(newSize / 1024).toFixed(1)}KB`);
        
        fs.unlinkSync(img.src);
      } catch (err) {
        console.error(`  Error optimizing ${img.src}:`, err.message);
      }
    } else {
      console.log(`Standalone image not found (might already be optimized): ${img.src}`);
    }
  }
}

function updateCodebaseReferences() {
  console.log('\nUpdating codebase references from .png to .jpg...');

  // Update products data
  const productsFile = 'src/data/products.js';
  if (fs.existsSync(productsFile)) {
    let content = fs.readFileSync(productsFile, 'utf8');
    // Replace product png references with jpg
    // String looks like "/images/products/... .png"
    const regex = /(\/images\/products\/[^"]+)\.png/g;
    const matches = content.match(regex);
    if (matches) {
      console.log(`  Found ${matches.length} PNG references in ${productsFile}. Replacing with .jpg.`);
      content = content.replace(regex, '$1.jpg');
      fs.writeFileSync(productsFile, content, 'utf8');
      console.log(`  Updated ${productsFile}.`);
    } else {
      console.log(`  No PNG references to update in ${productsFile}.`);
    }
  }

  // Update AboutPage.jsx
  const aboutFile = 'src/pages/AboutPage.jsx';
  if (fs.existsSync(aboutFile)) {
    let content = fs.readFileSync(aboutFile, 'utf8');
    if (content.includes('/images/about_hero.png')) {
      content = content.replace('/images/about_hero.png', '/images/about_hero.jpg');
      fs.writeFileSync(aboutFile, content, 'utf8');
      console.log(`  Updated /images/about_hero.png reference in ${aboutFile}.`);
    }
  }

  // Update Hero.jsx
  const heroFile = 'src/components/home/Hero.jsx';
  if (fs.existsSync(heroFile)) {
    let content = fs.readFileSync(heroFile, 'utf8');
    if (content.includes('/hero-main.png')) {
      content = content.replace('/hero-main.png', '/hero-main.jpg');
      fs.writeFileSync(heroFile, content, 'utf8');
      console.log(`  Updated /hero-main.png reference in ${heroFile}.`);
    }
  }
}

async function run() {
  await optimizeProductImages();
  await optimizeStandaloneImages();
  updateCodebaseReferences();
  console.log('\nAll done! Optimization process finished.');
}

run();
