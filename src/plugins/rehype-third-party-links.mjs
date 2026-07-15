const FIRST_PARTY_DOMAIN = 'codewithdan.com';

export function isThirdPartyHref(href) {
  if (typeof href !== 'string') return false;

  try {
    const url = new URL(href, 'https://blog.codewithdan.com');
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;

    const hostname = url.hostname.toLowerCase();
    return hostname !== FIRST_PARTY_DOMAIN && !hostname.endsWith(`.${FIRST_PARTY_DOMAIN}`);
  } catch {
    return false;
  }
}

function visit(node) {
  if (node?.type === 'element' && node.tagName === 'a' && isThirdPartyHref(node.properties?.href)) {
    const properties = node.properties || (node.properties = {});
    const existingRel = Array.isArray(properties.rel)
      ? properties.rel
      : typeof properties.rel === 'string'
        ? properties.rel.split(/\s+/).filter(Boolean)
        : [];

    properties.target = '_blank';
    properties.rel = [...new Set([...existingRel, 'noopener', 'noreferrer'])];
  }

  if (Array.isArray(node?.children)) {
    for (const child of node.children) visit(child);
  }
}

export default function rehypeThirdPartyLinks() {
  return visit;
}
