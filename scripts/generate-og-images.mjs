import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const BLOG_DIR = join(process.cwd(), 'src/content/blog');
const OG_DIR = join(process.cwd(), 'public/og');

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fm = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    fm[key] = val;
  }
  return fm;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function truncateTitle(title, maxLen = 80) {
  if (title.length <= maxLen) return title;
  return title.slice(0, maxLen).replace(/\s+\S*$/, '') + '…';
}

async function generateOgImage(slug, title, date, fontRegular, fontBold) {
  const formattedDate = formatDate(date);
  const displayTitle = truncateTitle(title);

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 70px',
          background: 'linear-gradient(135deg, #0a1628 0%, #1a3a5c 50%, #0d2137 100%)',
          fontFamily: 'Sans',
          color: '#ffffff',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', gap: '20px' },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '20px',
                      color: '#4da3e8',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                    },
                    children: 'codewithdan.com',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: displayTitle.length > 60 ? '40px' : '48px',
                      fontWeight: 700,
                      lineHeight: 1.2,
                      color: '#ffffff',
                      maxWidth: '1000px',
                    },
                    children: displayTitle,
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '2px solid rgba(77, 163, 232, 0.3)',
                paddingTop: '24px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', flexDirection: 'column', gap: '4px' },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: { fontSize: '24px', fontWeight: 700, color: '#e0e0e0' },
                          children: 'Dan Wahlin',
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: { fontSize: '18px', color: '#999' },
                          children: formattedDate,
                        },
                      },
                    ],
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '18px',
                      color: '#4da3e8',
                      fontWeight: 700,
                      padding: '8px 20px',
                      border: '2px solid #4da3e8',
                      borderRadius: '6px',
                    },
                    children: 'Code with Dan',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Sans',
          data: fontRegular,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Sans',
          data: fontBold,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
  });
  return resvg.render().asPng();
}

async function main() {
  // Use system Liberation Sans fonts (metric-compatible with Arial/Helvetica)
  const fontRegular = await readFile('/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf');
  const fontBold = await readFile('/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf');

  if (!existsSync(OG_DIR)) {
    await mkdir(OG_DIR, { recursive: true });
  }

  const entries = await readdir(BLOG_DIR, { withFileTypes: true });
  const dirs = entries.filter(e => e.isDirectory()).map(e => e.name);

  let count = 0;
  for (const slug of dirs) {
    const dirPath = join(BLOG_DIR, slug);
    const files = await readdir(dirPath);
    const mdFile = files.find(f => f.endsWith('.md') || f.endsWith('.mdx'));
    if (!mdFile) continue;

    const content = await readFile(join(dirPath, mdFile), 'utf-8');
    const fm = parseFrontmatter(content);
    if (!fm || !fm.title || fm.draft === 'true') continue;

    const outputPath = join(OG_DIR, `${slug}.png`);

    try {
      const png = await generateOgImage(slug, fm.title, fm.date || new Date().toISOString(), fontRegular, fontBold);
      await writeFile(outputPath, png);
      count++;
      if (count % 10 === 0) process.stdout.write(`\r  Generated ${count} OG images...`);
    } catch (err) {
      console.error(`\n  Error generating OG for ${slug}: ${err.message}`);
    }
  }

  console.log(`\nDone! Generated ${count} OG images in public/og/`);
}

main().catch(console.error);
