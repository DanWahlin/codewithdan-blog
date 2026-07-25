// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import { defineConfig } from 'astro/config';
import rehypeThirdPartyLinks from './src/plugins/rehype-third-party-links.mjs';

export default defineConfig({
	site: 'https://blog.codewithdan.com',
	redirects: {
		'/turning-a-hetzner-vm-into-an-ai-coding-server':
			'/how-i-turned-a-vps-into-an-always-on-ai-coding-server',
	},
	integrations: [mdx(), sitemap()],
	prefetch: {
		defaultStrategy: 'hover',
	},
	markdown: {
		shikiConfig: {
			themes: {
				light: 'github-light',
				dark: 'github-dark',
			},
		},
		rehypePlugins: [
			rehypeSlug,
			[rehypeAutolinkHeadings, { behavior: 'wrap' }],
			rehypeThirdPartyLinks,
		],
	},
});
