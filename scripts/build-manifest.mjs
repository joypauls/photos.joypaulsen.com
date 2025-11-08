import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import ExifParser from "exif-parser";

const R2_BASE = process.env.R2_BASE_URL;
const INPUT_DIR = "assets/originals";
const PREVIEW_DIR = "assets/previews";
const MANIFEST_PATH = "src/data/photos.json";
const CAPTIONS_PATH = "src/data/captions.json";
const PREVIEW_WIDTH = 1600;

async function ensureDir(p) { await fs.mkdir(p, { recursive: true }); }

async function main() {
  if (!R2_BASE) throw new Error("Set R2_BASE_URL in .env.local");

  await ensureDir(PREVIEW_DIR);
  const entries = await fs.readdir(INPUT_DIR, { withFileTypes: true });

  // Load existing captions/metadata if exists
  let captions = {};
  try {
    const captionsData = await fs.readFile(CAPTIONS_PATH, "utf-8");
    captions = JSON.parse(captionsData);
  } catch (err) {
    console.log("No captions file found, will create new one");
  }

  // Track which photo IDs we encounter
  const currentPhotoIds = new Set();
  const photos = [];
  for (const e of entries) {
    if (!e.isFile()) continue;
    const ext = path.extname(e.name).toLowerCase();
    if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;

    const id = path.basename(e.name, ext);
    currentPhotoIds.add(id);
    
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
        .jpeg({ quality: 82, chromaSubsampling: "4:2:0" })
        .toFile(previewPath);
    }

    // Probe original dimensions and EXIF for manifest
    const meta = await sharp(inputPath).metadata();
    
    // Extract EXIF data if available
    const exif = meta.exif ? parseExif(meta.exif) : {};
    
    // Get manual metadata for this photo
    const manual = captions[id] || {};
    
    // Initialize captions entry if it doesn't exist
    if (!captions[id]) {
      captions[id] = {
        title: "",
        caption: "",
        location: "",
        tags: []
      };
    }

    photos.push({
      id,
      title: manual.title || id.replace(/[_-]+/g, " "),
      caption: manual.caption || "",
      previewUrl: `${R2_BASE}/previews/${previewName}`,
      originalUrl: `${R2_BASE}/originals/${e.name}`,
      w: meta.width || 0,
      h: meta.height || 0,
      album: manual.album || "set01",
      // Manual metadata takes precedence
      location: manual.location || null,
      tags: manual.tags || [],
      // EXIF metadata (auto-extracted)
      dateTaken: exif.DateTimeOriginal || null,
      camera: exif.Model || null,
      lens: exif.LensModel || null,
      focalLength: exif.FocalLength ? `${exif.FocalLength}mm` : null,
      aperture: exif.FNumber || null,
      iso: exif.ISO || null,
      shutterSpeed: exif.ExposureTime || null
    });
  }

  // Clean up captions file: remove entries for deleted photos
  const updatedCaptions = {};
  for (const id of currentPhotoIds) {
    updatedCaptions[id] = captions[id];
  }
  
  const removedCount = Object.keys(captions).length - Object.keys(updatedCaptions).length;
  const addedCount = currentPhotoIds.size - (Object.keys(captions).length - removedCount);
  
  // Write updated captions file
  await fs.writeFile(CAPTIONS_PATH, JSON.stringify(updatedCaptions, null, 2));
  console.log(`Updated ${CAPTIONS_PATH}: ${addedCount} added, ${removedCount} removed`);

  // Write photos manifest
  photos.sort((a, b) => a.id.localeCompare(b.id));
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(photos, null, 2));
  console.log(`Wrote ${photos.length} photos to ${MANIFEST_PATH}`);
}

// Helper to parse EXIF buffer
function parseExif(exifBuffer) {
  try {
    const parser = ExifParser.create(exifBuffer);
    const result = parser.parse();
    return result.tags || {};
  } catch (err) {
    return {};
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
