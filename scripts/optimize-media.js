const path = require('path');
const fs = require('fs-extra');
const fg = require('fast-glob');
const sharp = require('sharp');
const ora = require('ora');
const pc = require('picocolors');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');

if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
}

const ROOT = path.resolve(__dirname, '..');
const SOURCE_DIR = path.join(ROOT, 'frontend', 'public', 'pics');
const TARGET_DIR = path.join(ROOT, 'frontend', 'public', 'pics-optimized');

const IMAGE_PATTERNS = ['**/*.png', '**/*.jpg', '**/*.jpeg'];
const VIDEO_PATTERNS = ['**/*.mp4', '**/*.mov'];
const MAX_IMAGE_WIDTH = 1600;

const ensureFreshOutput = async (inputPath, outputPath) => {
  try {
    const [srcStat, outStat] = await Promise.all([
      fs.stat(inputPath),
      fs.stat(outputPath)
    ]);
    return outStat.mtimeMs >= srcStat.mtimeMs;
  } catch {
    return false;
  }
};

const toOptimizedPath = (relativePath, { isImage }) => {
  const ext = path.extname(relativePath);
  const baseName = path.basename(relativePath, ext);
  const optimizedExt = isImage ? '.webp' : '.mp4';
  return path.join(
    TARGET_DIR,
    path.dirname(relativePath),
    `${baseName}${optimizedExt}`
  );
};

const optimizeImages = async () => {
  const spinner = ora('Optimizing images').start();
  const files = await fg(IMAGE_PATTERNS, { cwd: SOURCE_DIR });
  let converted = 0;

  for (const relativePath of files) {
    const inputPath = path.join(SOURCE_DIR, relativePath);
    const outputPath = toOptimizedPath(relativePath, { isImage: true });

    if (await ensureFreshOutput(inputPath, outputPath)) {
      continue;
    }

    await fs.ensureDir(path.dirname(outputPath));

    const pipeline = sharp(inputPath).rotate();
    const metadata = await pipeline.metadata();

    const width =
      metadata.width && metadata.width > MAX_IMAGE_WIDTH
        ? MAX_IMAGE_WIDTH
        : metadata.width;

    await pipeline
      .resize({ width, withoutEnlargement: true })
      .webp({
        quality: 80,
        effort: 5
      })
      .toFile(outputPath);

    converted += 1;
  }

  spinner.succeed(`Optimized ${converted} image${converted === 1 ? '' : 's'}`);
};

const optimizeVideos = async () => {
  const spinner = ora('Optimizing videos').start();
  const files = await fg(VIDEO_PATTERNS, { cwd: SOURCE_DIR });
  let converted = 0;

  for (const relativePath of files) {
    const inputPath = path.join(SOURCE_DIR, relativePath);
    const outputPath = toOptimizedPath(relativePath, { isImage: false });

    if (await ensureFreshOutput(inputPath, outputPath)) {
      continue;
    }

    await fs.ensureDir(path.dirname(outputPath));

    if (!ffmpegPath) {
      spinner.warn(
        pc.yellow(
          'Skipped video optimization because ffmpeg-static could not be initialised'
        )
      );
      return;
    }

    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions([
          "-vf scale='min(1280,iw)':-2",
          '-c:v libx264',
          '-crf 27',
          '-preset faster',
          '-pix_fmt yuv420p',
          '-movflags +faststart',
          '-c:a aac',
          '-b:a 128k'
        ])
        .output(outputPath)
        .on('end', resolve)
        .on('error', reject)
        .run();
    });

    converted += 1;
  }

  spinner.succeed(`Optimized ${converted} video${converted === 1 ? '' : 's'}`);
};

const run = async () => {
  console.log(pc.cyan('→ Generating optimized media assets...'));
  await fs.ensureDir(TARGET_DIR);

  await optimizeImages();
  await optimizeVideos();

  console.log(pc.green('✓ Media optimization complete'));
};

run().catch((error) => {
  console.error(pc.red('Media optimization failed'));
  console.error(error);
  process.exit(1);
});

