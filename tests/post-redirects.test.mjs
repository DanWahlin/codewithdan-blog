import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import test from 'node:test';

import config from '../astro.config.mjs';

const oldSlug = 'turning-a-hetzner-vm-into-an-ai-coding-server';
const newSlug = 'how-i-turned-a-vps-into-an-always-on-ai-coding-server';

test('keeps the published VPS article URL working after the slug rename', () => {
  assert.equal(config.redirects?.[`/${oldSlug}`], `/${newSlug}`);
  assert.equal(existsSync(`src/content/blog/${oldSlug}/index.md`), false);
  assert.equal(existsSync(`src/content/blog/${newSlug}/index.md`), true);
});
