#!/usr/bin/env node
// GitHub webhook listener — pulls + builds on push to main
// Runs behind Cloudflare Tunnel, no open ports needed

import { createServer } from 'node:http';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { spawn } from 'node:child_process';

const PORT = 9876;
const SECRET = process.env.WEBHOOK_SECRET?.trim();
const REPO_DIR = '/root/production/codewithdan-blog';
const BRANCH = 'main';

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

function deploy() {
  if (deploying) {
    console.log(`[${ts()}] Deploy already in progress, skipping`);
    return;
  }
  deploying = true;
  console.log(`[${ts()}] Starting deploy...`);

  const child = spawn('bash', ['-c', `
    cd ${REPO_DIR} &&
    git pull origin ${BRANCH} --ff-only 2>&1 &&
    npm install --production=false 2>&1 &&
    npm run build 2>&1 &&
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
    
    // Only deploy on push to main
    if (event === 'push' && payload.ref === `refs/heads/${BRANCH}`) {
      console.log(`[${ts()}] Push to ${BRANCH} by ${payload.pusher?.name || 'unknown'} — deploying`);
      res.writeHead(200);
      res.end('Deploying');
      deploy();
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
