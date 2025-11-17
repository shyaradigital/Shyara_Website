const fs = require('fs-extra');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SOURCE_DIR = path.join(ROOT, 'frontend', 'src', 'components');
const TARGET_DIR = path.join(ROOT, 'frontend', 'public', 'fonts');

// Fonts to convert (only the ones we actually use)
const FONTS_TO_CONVERT = [
  // Salena - only used weights (removed italic and light variants)
  { name: 'salena-regular', source: 'salena-regular.ttf', weight: 400 },
  { name: 'salena-medium', source: 'salena-medium.ttf', weight: 500 },
  { name: 'salena-semibold', source: 'salena-semibold.ttf', weight: 600 },
  { name: 'salena-bold', source: 'salena-bold.ttf', weight: 700 },
  // Davigo - only regular
  { name: 'davigo-regular', source: 'DavigoDemoRegular-V4Bg0.ttf', weight: 400, dir: 'davigo-font' },
];

async function prepareFonts() {
  console.log('Preparing fonts for conversion...\n');
  
  // Ensure target directory exists
  await fs.ensureDir(TARGET_DIR);

  const fontsToConvert = [];

  for (const font of FONTS_TO_CONVERT) {
    const sourceDir = font.dir ? path.join(SOURCE_DIR, font.dir) : path.join(SOURCE_DIR, 'salena-font');
    const sourceFile = path.join(sourceDir, font.source);
    
    // Try TTF first, then OTF
    let actualSource = sourceFile;
    if (!(await fs.pathExists(actualSource)) && font.source.endsWith('.ttf')) {
      actualSource = sourceFile.replace('.ttf', '.otf');
    }

    if (!(await fs.pathExists(actualSource))) {
      console.warn(`⚠️  Source file not found: ${actualSource}`);
      continue;
    }

    // Copy TTF/OTF to fonts directory for conversion
    const targetTtf = path.join(TARGET_DIR, font.source);
    await fs.copy(actualSource, targetTtf);
    fontsToConvert.push({ name: font.name, file: font.source, path: targetTtf });
    console.log(`✅ Prepared: ${font.source}`);
  }

  console.log(`\n✨ ${fontsToConvert.length} fonts prepared in: ${TARGET_DIR}`);
  console.log('\n📝 Next steps:');
  console.log('   1. Convert TTF/OTF files to WOFF2 using one of these methods:');
  console.log('      - Online: https://cloudconvert.com/ttf-to-woff2');
  console.log('      - Online: https://convertio.co/ttf-woff2/');
  console.log('      - Command line: npx @fontsource/woff2-cli (if available)');
  console.log('   2. Place converted .woff2 files in: frontend/public/fonts/');
  console.log('   3. Ensure filenames match: salena-regular.woff2, salena-medium.woff2, etc.');
  console.log('\n💡 Tip: WOFF2 files are ~30-50% smaller than TTF/OTF!');
}

prepareFonts().catch(console.error);
