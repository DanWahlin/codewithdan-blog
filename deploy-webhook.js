#!/usr/bin/env node
// GitHub webhook listener — builds + deploys on publish-* tag pushes
// Runs behind Cloudflare Tunnel, no open ports needed

import { createServer } from 'node:http';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { spawn } from 'node:child_process';

const PORT = 9876;
const SECRET = process.env.WEBHOOK_SECRET?.trim();
const REPO_DIR = '/root/production/codewithdan-blog';
const PUBLISH_TAG_PREFIX = 'publish-';

if (!SECRET) {
  console.error('WEBHOOK_SECRET environment variable is required.');
  process.exit(1);
}

let deploying = false;

function verifySignature(payload, signature) {
  if (!signature) return false;
  const hmac = createHmac('sha256', SECRET);
  hmac.update(payload);
  const expected = `sha256=${hmac.digest('hex')}`;
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

function getPublishTag(ref) {
  if (typeof ref !== 'string' || !ref.startsWith('refs/tags/')) return null;

  const tagName = ref.slice('refs/tags/'.length);
  if (!tagName.startsWith(PUBLISH_TAG_PREFIX)) return null;
  if (!/^[A-Za-z0-9._-]+$/.test(tagName)) return null;

  return tagName;
}

function shellQuote(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

function deploy(tagName) {
  if (deploying) {
    console.log(`[${ts()}] Deploy already in progress, skipping`);
    return;
  }
  deploying = true;
  console.log(`[${ts()}] Starting deploy for tag ${tagName}...`);

  const repoDir = shellQuote(REPO_DIR);
  const tagRefspec = shellQuote(`refs/tags/${tagName}:refs/tags/${tagName}`);
  const tagCommit = shellQuote(`${tagName}^{commit}`);
  const nextDistTemplate = shellQuote(`${REPO_DIR}/dist.next.XXXXXX`);
  const distDir = shellQuote(`${REPO_DIR}/dist`);
  const previousDistDir = shellQuote(`${REPO_DIR}/dist.previous`);

  const child = spawn('bash', ['-c', `
    set -euo pipefail
    worktree=$(mktemp -d /tmp/codewithdan-blog-deploy.XXXXXX)
    next_dist=$(mktemp -d ${nextDistTemplate})
    cleanup() {
      git -C ${repoDir} worktree remove --force "$worktree" >/dev/null 2>&1 || rm -rf "$worktree"
      rm -rf "$next_dist"
    }
    trap cleanup EXIT

    cd ${repoDir}
    git fetch --force origin ${tagRefspec} 2>&1
    commit=$(git rev-parse ${tagCommit})
    git worktree add --detach "$worktree" "$commit" 2>&1

    cd "$worktree"
    npm install --production=false 2>&1 &&
    npm run build 2>&1 &&

    cp -a "$worktree/dist/." "$next_dist/"
    rm -rf ${previousDistDir}
    if [ -d ${distDir} ]; then mv ${distDir} ${previousDistDir}; fi
    mv "$next_dist" ${distDir}
    rm -rf ${previousDistDir}

    echo "DEPLOY_SUCCESS"
  `]);

  let output = '';
  child.stdout.on('data', d => output += d);
  child.stderr.on('data', d => output += d);

  child.on('close', code => {
    deploying = false;
    if (code === 0 && output.includes('DEPLOY_SUCCESS')) {
      console.log(`[${ts()}] Deploy successful`);
    } else {
      console.error(`[${ts()}] Deploy failed (code ${code}):\n${output}`);
    }
  });
}

function ts() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

const server = createServer((req, res) => {
  // Health check
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, deploying }));
    return;
  }

  if (req.method !== 'POST' || req.url !== '/webhook') {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    const sig = req.headers['x-hub-signature-256'];
    if (!verifySignature(body, sig)) {
      console.log(`[${ts()}] Invalid signature`);
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    let payload;
    try { payload = JSON.parse(body); } catch { 
      res.writeHead(400);
      res.end('Bad JSON');
      return;
    }

    const event = req.headers['x-github-event'];
    const tagName = getPublishTag(payload.ref);
    
    if (event === 'push' && !payload.deleted && tagName) {
      console.log(`[${ts()}] Publish tag ${tagName} by ${payload.pusher?.name || 'unknown'} — deploying`);
      res.writeHead(200);
      res.end('Deploying');
      deploy(tagName);
    } else if (event === 'ping') {
      console.log(`[${ts()}] Ping received`);
      res.writeHead(200);
      res.end('Pong');
    } else {
      res.writeHead(200);
      res.end('Ignored');
    }
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[${ts()}] Blog deploy webhook listening on 127.0.0.1:${PORT}`);
});
