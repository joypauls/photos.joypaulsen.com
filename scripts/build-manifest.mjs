import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const R2_BASE = process.env.R2_BASE_URL;
const INPUT_DIR = 'assets/originals';
const PREVIEW_DIR = 'assets/previews';
const MANIFEST_PATH = 'src/data/photos.json';
const PREVIEW_WIDTH = 1600;

async function ensureDir(p) { await fs.mkdir(p, { recursive: true }); }

async function main() {
  if (!R2_BASE) throw new Error('Set R2_BASE_URL in .env.local');

  await ensureDir(PREVIEW_DIR);
  const entries = await fs.readdir(INPUT_DIR, { withFileTypes: true });

  const photos = [];
  for (const e of entries) {
    if (!e.isFile()) continue;
    const ext = path.extname(e.name).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;

    const id = path.basename(e.name, ext);
    const inputPath = path.join(INPUT_DIR, e.name);
    const previewName = `${id}_1600.jpg`;
    const previewPath = path.join(PREVIEW_DIR, previewName);

    // Generate preview if missing
    try { await fs.access(previewPath); }
    catch {
      const img = sharp(inputPath);
      const meta = await img.metadata();
      const targetW = Math.min(meta.width || PREVIEW_WIDTH, PREVIEW_WIDTH);
      await img
        .resize({ width: targetW })
        .jpeg({ quality: 82, chromaSubsampling: '4:2:0' })
        .toFile(previewPath);
    }

    // Probe original dimensions for manifest
    const meta = await sharp(inputPath).metadata();

    photos.push({
      id,
      title: id.replace(/[_-]+/g, ' '),
      caption: '',
      previewUrl: `${R2_BASE}/previews/${previewName}`,
      originalUrl: `${R2_BASE}/originals/${e.name}`,
      w: meta.width || 0,
      h: meta.height || 0,
      album: 'set01'
    });
  }

  photos.sort((a, b) => a.id.localeCompare(b.id));
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(photos, null, 2));
  console.log(`Wrote ${photos.length} photos to ${MANIFEST_PATH}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
