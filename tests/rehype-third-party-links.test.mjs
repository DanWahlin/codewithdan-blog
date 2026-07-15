import assert from 'node:assert/strict';
import test from 'node:test';

import rehypeThirdPartyLinks, { isThirdPartyHref } from '../src/plugins/rehype-third-party-links.mjs';

function link(href, properties = {}) {
  return { type: 'element', tagName: 'a', properties: { href, ...properties }, children: [] };
}

test('identifies only HTTP links outside the CodeWithDan domain as third party', () => {
  assert.equal(isThirdPartyHref('https://github.com/DanWahlin'), true);
  assert.equal(isThirdPartyHref('//www.youtube.com/watch?v=example'), true);
  assert.equal(isThirdPartyHref('https://blog.codewithdan.com/article'), false);
  assert.equal(isThirdPartyHref('https://codewithdan.com'), false);
  assert.equal(isThirdPartyHref('https://courses.codewithdan.com/path'), false);
  assert.equal(isThirdPartyHref('/about'), false);
  assert.equal(isThirdPartyHref('#section'), false);
  assert.equal(isThirdPartyHref('mailto:dan@example.com'), false);
});

test('adds safe new-tab attributes to nested third-party links', () => {
  const external = link('https://github.com/DanWahlin');
  const internal = link('/about');
  const tree = {
    type: 'root',
    children: [{ type: 'element', tagName: 'p', properties: {}, children: [external, internal] }],
  };

  rehypeThirdPartyLinks()(tree);

  assert.equal(external.properties.target, '_blank');
  assert.deepEqual(external.properties.rel, ['noopener', 'noreferrer']);
  assert.equal(internal.properties.target, undefined);
  assert.equal(internal.properties.rel, undefined);
});

test('preserves existing rel values without duplication', () => {
  const external = link('https://github.com/DanWahlin', {
    rel: ['nofollow', 'noopener'],
  });

  rehypeThirdPartyLinks()({ type: 'root', children: [external] });

  assert.deepEqual(external.properties.rel, ['nofollow', 'noopener', 'noreferrer']);
});
