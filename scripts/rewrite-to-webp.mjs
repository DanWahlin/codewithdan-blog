#!/usr/bin/env node
/**
 * Rewrite image references in markdown files to use .webp
 * Only rewrites if the .webp file actually exists in public/
 */
import { readdir, readFile, writeFile, access } from 'fs/promises';
import { join, extname } from 'path';

const BLOG_DIR = new URL('../src/content/blog', import.meta.url).pathname;
const PUBLIC_DIR = new URL('../public', import.meta.url).pathname;

let stats = { files: 0, refs: 0 };

async function getMarkdownFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getMarkdownFiles(fullPath));
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }
  return files;
}

async function fileExists(path) {
  try { await access(path); return true; } catch { return false; }
}

async function rewriteFile(filePath) {
  let content = await readFile(filePath, 'utf-8');
  let changed = false;

  // Match image refs: ![...](path.png) or ![...](path.jpg) or src="/images/..."
  const newContent = await replaceAsync(content, /(\!\[[^\]]*\]\()([^)]+\.(png|jpe?g))(\))/gi, async (match, prefix, imgPath, ext, suffix) => {
    const webpPath = imgPath.replace(/\.(png|jpe?g)$/i, '.webp');
    // Resolve relative to public dir
    const absWebpPath = join(PUBLIC_DIR, webpPath);
    if (await fileExists(absWebpPath)) {
      changed = true;
      stats.refs++;
      return prefix + webpPath + suffix;
    }
    return match;
  });

  // Also handle frontmatter coverImage
  const finalContent = await replaceAsync(newContent, /(coverImage:\s*['"]?)([^'"\s]+\.(png|jpe?g))(['"]?)/gi, async (match, prefix, imgPath, ext, suffix) => {
    const webpPath = imgPath.replace(/\.(png|jpe?g)$/i, '.webp');
    const absWebpPath = join(PUBLIC_DIR, webpPath);
    if (await fileExists(absWebpPath)) {
      changed = true;
      stats.refs++;
      return prefix + webpPath + suffix;
    }
    return match;
  });

  if (changed) {
    await writeFile(filePath, finalContent);
    stats.files++;
  }
}

// Helper for async replace
async function replaceAsync(str, regex, asyncFn) {
  const promises = [];
  str.replace(regex, (match, ...args) => {
    promises.push(asyncFn(match, ...args));
    return match;
  });
  const results = await Promise.all(promises);
  let i = 0;
  return str.replace(regex, () => results[i++]);
}

async function main() {
  console.log('📝 Rewriting image refs to WebP...');
  const files = await getMarkdownFiles(BLOG_DIR);
  console.log(`Found ${files.length} markdown files\n`);

  for (const f of files) {
    await rewriteFile(f);
  }

  console.log(`\n✅ Done!`);
  console.log(`   Files modified: ${stats.files}`);
  console.log(`   Image refs rewritten: ${stats.refs}`);
}

main().catch(console.error);
