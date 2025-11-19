import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import ExifParser from "exif-parser";

const R2_BASE = process.env.R2_BASE_URL;
const INPUT_DIR = "assets/originals";
const PREVIEW_DIR = "assets/previews";
const MANIFEST_PATH = "src/data/manifest.json";
const PHOTO_METADATA_PATH = "src/data/photos.json";
const PREVIEW_WIDTH = 1600;

async function ensureDir(p) { await fs.mkdir(p, { recursive: true }); }

async function main() {
  if (!R2_BASE) throw new Error("Set R2_BASE_URL in .env.local");

  await ensureDir(PREVIEW_DIR);
  const entries = await fs.readdir(INPUT_DIR, { withFileTypes: true });

  // Load existing metadata if exists
  let metadata = {};
  try {
    const metadataData = await fs.readFile(PHOTO_METADATA_PATH, "utf-8");
    metadata = JSON.parse(metadataData);
  } catch (err) {
    console.log("No metadata file found, will create new one");
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
    const img = sharp(inputPath);
    const meta = await img.metadata();
    
    // Extract EXIF data if available
    const exif = meta.exif ? parseExif(await fs.readFile(inputPath)) : {};
    
    // Get manual metadata for this photo
    const manual = metadata[id] || {};
    
    // Initialize metadata entry if it doesn't exist
    if (!metadata[id]) {
      metadata[id] = {
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

  // Clean up metadata file: remove entries for deleted photos
  const updatedMetadata = {};
  for (const id of currentPhotoIds) {
    updatedMetadata[id] = metadata[id];
  }
  
  const removedCount = Object.keys(metadata).length - Object.keys(updatedMetadata).length;
  const addedCount = currentPhotoIds.size - (Object.keys(metadata).length - removedCount);
  
  // Write updated metadata file
  await fs.writeFile(PHOTO_METADATA_PATH, JSON.stringify(updatedMetadata, null, 2));
  console.log(`Updated ${PHOTO_METADATA_PATH}: ${addedCount} added, ${removedCount} removed`);

  // Write photos manifest
  // Sort by date taken descending (newest first), fallback to ID if no date
  photos.sort((a, b) => {
    if (a.dateTaken && b.dateTaken) {
      return new Date(b.dateTaken) - new Date(a.dateTaken);
    }
    if (a.dateTaken) return -1;
    if (b.dateTaken) return 1;
    return a.id.localeCompare(b.id);
  });
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(photos, null, 2));
  console.log(`Wrote ${photos.length} photos to ${MANIFEST_PATH}`);
}


function parseExif(fileBuffer) {
  try {
    const parser = ExifParser.create(fileBuffer);
    const result = parser.parse();
    const tags = result.tags || {};
    
    // Map common EXIF tags to our format
    return {
      DateTimeOriginal: tags.DateTimeOriginal 
        ? new Date(tags.DateTimeOriginal * 1000).toISOString() 
        : null,
      Model: tags.Model || null,
      LensModel: tags.LensModel || null,
      FocalLength: tags.FocalLength || null,
      FNumber: tags.FNumber || null,
      ISO: tags.ISO || null,
      ExposureTime: tags.ExposureTime || null
    };
  } catch (err) {
    console.error("EXIF parsing error:", err.message);
    return {};
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
