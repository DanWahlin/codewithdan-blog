#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const BLOG_ROOT = process.cwd();
const DEFAULT_OBSIDIAN_ROOT = process.env.OBSIDIAN_REPO || '/root/vaults/obsidian';
const SOURCE_PREFIX = 'blog/codewithdan';

function usage() {
  console.error(`Usage: npm run publish:obsidian -- <slug> [options]

Options:
  --obsidian <path>       Obsidian repo path. Default: ${DEFAULT_OBSIDIAN_ROOT}
  --draft                 Keep draft: true in the blog repo. Default publishes as draft: false.
  --no-pull               Do not git pull either repo before syncing.
  --no-build              Do not run npm run build after syncing.
  --commit                Commit changes in the blog repo.
  --push                  Push the blog repo after committing. Implies --commit.
  --message <message>     Commit message. Default: "publish <slug> from Obsidian"
  --dry-run               Validate and print planned paths without copying.
`);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || BLOG_ROOT,
    stdio: options.capture ? 'pipe' : 'inherit',
    encoding: 'utf8',
    env: process.env,
  });
  if (result.status !== 0) {
    const detail = options.capture ? `${result.stdout || ''}${result.stderr || ''}` : '';
    throw new Error(`${command} ${args.join(' ')} failed${detail ? `\n${detail}` : ''}`);
  }
  return result.stdout?.trim() || '';
}

function gitIsClean(repo) {
  return run('git', ['status', '--short'], { cwd: repo, capture: true }) === '';
}

function gitTrackedOrUntrackedChanges(repo, specs) {
  const output = run('git', ['status', '--short', '--', ...specs], { cwd: repo, capture: true });
  return output.split('\n').filter(Boolean);
}

function assertRepo(pathValue, label) {
  if (!existsSync(path.join(pathValue, '.git'))) {
    throw new Error(`${label} is not a git repo: ${pathValue}`);
  }
}

function copyDir(src, dest) {
  if (!existsSync(src)) return 0;
  mkdirSync(dest, { recursive: true });
  let copied = 0;
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copied += copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      mkdirSync(path.dirname(destPath), { recursive: true });
      copyFileSync(srcPath, destPath);
      copied++;
    }
  }
  return copied;
}

function normalizeFrontmatter(markdown, publish) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) throw new Error('Markdown is missing YAML frontmatter');

  const fm = match[1];
  const body = markdown.slice(match[0].length);
  const desiredDraft = publish ? 'false' : 'true';
  let nextFm;
  if (/^draft:\s*(true|false)\s*$/m.test(fm)) {
    nextFm = fm.replace(/^draft:\s*(true|false)\s*$/m, `draft: ${desiredDraft}`);
  } else {
    nextFm = `${fm}\ndraft: ${desiredDraft}`;
  }

  return `---\n${nextFm.trimEnd()}\n---\n${body}`.replace(/[ \t]+$/gm, '');
}

function validateMarkdown(markdown, slug) {
  const problems = [];
  if (/!\[\[[^\]]+\]\]/.test(markdown)) problems.push('contains Obsidian ![[...]] embeds');
  if (/src="\.\//.test(markdown)) problems.push('contains relative video src="./..."');
  if (/\]\(\.\//.test(markdown)) problems.push('contains relative image links](./...)');
  const assetPathPattern = new RegExp(`/images/blog/${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/`);
  if (!assetPathPattern.test(markdown)) problems.push(`does not reference /images/blog/${slug}/ assets`);
  const secretish = [
    /bot\d{6,}:[A-Za-z0-9_-]{20,}/g,
    /(?:api[_-]?key|token|password|secret)\s*[:=]\s*['"]?[A-Za-z0-9_./:-]{12,}/gi,
  ];
  for (const pattern of secretish) {
    const match = markdown.match(pattern);
    if (match) problems.push(`possible sensitive value: ${match[0].slice(0, 24)}...`);
  }
  const numericMatches = markdown.match(/\b\d{9,12}\b/g) || [];
  const suspiciousNumbers = numericMatches.filter(value => !['1234567890', '0000000000'].includes(value));
  if (suspiciousNumbers.length) {
    problems.push(`possible sensitive numeric id: ${suspiciousNumbers[0].slice(0, 4)}...`);
  }
  if (problems.length) throw new Error(`Markdown validation failed:\n- ${problems.join('\n- ')}`);
}

function cleanGeneratedNoise() {
  const packageLock = path.join(BLOG_ROOT, 'package-lock.json');
  if (existsSync(packageLock)) {
    try { run('git', ['checkout', '--', 'package-lock.json'], { cwd: BLOG_ROOT }); } catch {}
  }
  for (const slug of ['building-agent-arcade-with-github-copilot-cli', 'github-agentic-workflows-from-markdown-instructions-to-automated-prs']) {
    const p = path.join(BLOG_ROOT, 'public/og', `${slug}.png`);
    if (existsSync(p)) rmSync(p, { force: true });
  }
}

const args = process.argv.slice(2);
if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  usage();
  process.exit(args.length === 0 ? 1 : 0);
}

let slug = null;
let obsidianRoot = DEFAULT_OBSIDIAN_ROOT;
let pull = true;
let build = true;
let commit = false;
let push = false;
let dryRun = false;
let publish = true;
let message = null;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (!arg.startsWith('--') && !slug) {
    slug = arg;
  } else if (arg === '--obsidian') {
    obsidianRoot = args[++i];
  } else if (arg === '--no-pull') {
    pull = false;
  } else if (arg === '--no-build') {
    build = false;
  } else if (arg === '--commit') {
    commit = true;
  } else if (arg === '--push') {
    push = true;
    commit = true;
  } else if (arg === '--message') {
    message = args[++i];
  } else if (arg === '--dry-run') {
    dryRun = true;
  } else if (arg === '--draft') {
    publish = false;
  } else {
    throw new Error(`Unknown argument: ${arg}`);
  }
}

if (!slug || !/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(slug)) {
  usage();
  throw new Error(`Invalid or missing slug: ${slug || '(missing)'}`);
}

assertRepo(BLOG_ROOT, 'Blog root');
assertRepo(obsidianRoot, 'Obsidian root');

if (pull) {
  if (!gitIsClean(obsidianRoot)) throw new Error(`Obsidian repo has uncommitted changes. Commit or stash before publishing.\n${run('git', ['status', '--short'], { cwd: obsidianRoot, capture: true })}`);
  if (!gitIsClean(BLOG_ROOT)) throw new Error(`Blog repo has uncommitted changes. Commit or stash before publishing.\n${run('git', ['status', '--short'], { cwd: BLOG_ROOT, capture: true })}`);
  run('git', ['pull', '--ff-only'], { cwd: obsidianRoot });
  run('git', ['pull', '--ff-only'], { cwd: BLOG_ROOT });
}

const sourcePost = path.join(obsidianRoot, SOURCE_PREFIX, 'src/content/blog', slug, 'index.md');
const sourceAssets = path.join(obsidianRoot, SOURCE_PREFIX, 'public/images/blog', slug);
const targetPostDir = path.join(BLOG_ROOT, 'src/content/blog', slug);
const targetPost = path.join(targetPostDir, 'index.md');
const targetAssets = path.join(BLOG_ROOT, 'public/images/blog', slug);
const targetOg = path.join(BLOG_ROOT, 'public/og', `${slug}.png`);

if (!existsSync(sourcePost)) throw new Error(`Missing Obsidian post: ${sourcePost}`);
if (!existsSync(sourceAssets)) throw new Error(`Missing Obsidian assets folder: ${sourceAssets}`);
if (!statSync(sourceAssets).isDirectory()) throw new Error(`Obsidian assets path is not a folder: ${sourceAssets}`);

console.log('Publishing from Obsidian');
console.log(`  slug:          ${slug}`);
console.log(`  source post:   ${sourcePost}`);
console.log(`  source assets: ${sourceAssets}`);
console.log(`  target post:   ${targetPost}`);
console.log(`  target assets: ${targetAssets}`);
console.log(`  draft mode:    ${publish ? 'production draft:false' : 'draft:true'}`);

if (dryRun) process.exit(0);

mkdirSync(targetPostDir, { recursive: true });
let markdown = readFileSync(sourcePost, 'utf8');
markdown = normalizeFrontmatter(markdown, publish);
validateMarkdown(markdown, slug);
writeFileSync(targetPost, markdown.endsWith('\n') ? markdown : `${markdown}\n`);

rmSync(targetAssets, { recursive: true, force: true });
const copied = copyDir(sourceAssets, targetAssets);
if (copied === 0) throw new Error(`No assets copied from ${sourceAssets}`);

if (build) {
  run('npm', ['run', 'build'], { cwd: BLOG_ROOT });
  cleanGeneratedNoise();
  if (!existsSync(targetOg) && publish) {
    throw new Error(`Build did not generate expected OG image: ${targetOg}`);
  }
}

run('git', ['diff', '--check'], { cwd: BLOG_ROOT });
const changed = gitTrackedOrUntrackedChanges(BLOG_ROOT, [
  path.relative(BLOG_ROOT, targetPost),
  path.relative(BLOG_ROOT, targetAssets),
  path.relative(BLOG_ROOT, targetOg),
]);

console.log('\nChanged publish artifacts:');
if (changed.length) console.log(changed.join('\n'));
else console.log('(none)');

if (commit && changed.length) {
  run('git', ['add', path.relative(BLOG_ROOT, targetPost), path.relative(BLOG_ROOT, targetAssets), path.relative(BLOG_ROOT, targetOg)], { cwd: BLOG_ROOT });
  run('git', ['commit', '-m', message || `publish ${slug} from Obsidian`], { cwd: BLOG_ROOT });
  if (push) run('git', ['push', 'origin', run('git', ['branch', '--show-current'], { cwd: BLOG_ROOT, capture: true })], { cwd: BLOG_ROOT });
} else if (commit) {
  console.log('No publish artifact changes to commit.');
}

console.log('\nDone.');
