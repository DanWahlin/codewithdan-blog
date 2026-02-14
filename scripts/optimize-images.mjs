#!/usr/bin/env node
/**
 * Image optimization script
 * - Converts PNG/JPG → WebP (alongside originals)
 * - Resizes images wider than 1200px
 * - Skips already-optimized images
 */
import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, extname, basename } from 'path';

const IMAGES_DIR = new URL('../public/images', import.meta.url).pathname;
const MAX_WIDTH = 1200;
const WEBP_QUALITY = 82;
const JPG_QUALITY = 85;

let stats = { converted: 0, resized: 0, skipped: 0, savedBytes: 0 };

async function getFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getFiles(fullPath));
    } else {
      const ext = extname(entry.name).toLowerCase();
      if (['.png', '.jpg', '.jpeg'].includes(ext)) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

async function optimizeImage(filePath) {
  const ext = extname(filePath).toLowerCase();
  const webpPath = filePath.replace(/\.(png|jpe?g)$/i, '.webp');
  
  try {
    const originalStat = await stat(filePath);
    const originalSize = originalStat.size;
    
    // Skip tiny images (< 5KB) — not worth it
    if (originalSize < 5120) {
      stats.skipped++;
      return;
    }

    // Check if WebP already exists and is newer
    try {
      const webpStat = await stat(webpPath);
      if (webpStat.mtimeMs >= originalStat.mtimeMs) {
        stats.skipped++;
        return;
      }
    } catch {}

    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    let pipeline = sharp(filePath);
    
    // Resize if wider than MAX_WIDTH
    if (metadata.width && metadata.width > MAX_WIDTH) {
      pipeline = pipeline.resize(MAX_WIDTH, null, { withoutEnlargement: true });
      stats.resized++;
    }

    // Generate WebP
    await pipeline.clone().webp({ quality: WEBP_QUALITY }).toFile(webpPath);
    
    // Also optimize the original in-place
    if (ext === '.png') {
      await pipeline.clone().png({ quality: 80, compressionLevel: 9 }).toFile(filePath + '.tmp');
    } else {
      await pipeline.clone().jpeg({ quality: JPG_QUALITY, mozjpeg: true }).toFile(filePath + '.tmp');
    }

    const newOriginalStat = await stat(filePath + '.tmp');
    const webpNewStat = await stat(webpPath);
    
    // Only replace original if smaller
    if (newOriginalStat.size < originalSize) {
      const { rename } = await import('fs/promises');
      await rename(filePath + '.tmp', filePath);
    } else {
      const { unlink } = await import('fs/promises');
      await unlink(filePath + '.tmp');
    }

    const saved = originalSize - webpNewStat.size;
    stats.savedBytes += Math.max(saved, 0);
    stats.converted++;
    
    if (originalSize > 500000) {
      const pct = ((1 - webpNewStat.size / originalSize) * 100).toFixed(0);
      console.log(`  ${basename(filePath)}: ${(originalSize/1024).toFixed(0)}KB → ${(webpNewStat.size/1024).toFixed(0)}KB WebP (${pct}% smaller)`);
    }
  } catch (err) {
    console.error(`  ✗ ${basename(filePath)}: ${err.message}`);
  }
}

async function main() {
  console.log('🖼️  Scanning images...');
  const files = await getFiles(IMAGES_DIR);
  console.log(`Found ${files.length} images to process\n`);

  // Process in batches of 10 for memory
  for (let i = 0; i < files.length; i += 10) {
    const batch = files.slice(i, i + 10);
    await Promise.all(batch.map(optimizeImage));
    if ((i + 10) % 100 === 0) {
      console.log(`  Progress: ${Math.min(i + 10, files.length)}/${files.length}`);
    }
  }

  console.log(`\n✅ Done!`);
  console.log(`   Converted: ${stats.converted}`);
  console.log(`   Resized (>1200px): ${stats.resized}`);
  console.log(`   Skipped: ${stats.skipped}`);
  console.log(`   Space saved (WebP vs original): ${(stats.savedBytes / 1024 / 1024).toFixed(1)}MB`);
}

main().catch(console.error);
