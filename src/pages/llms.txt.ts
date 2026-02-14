import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getExcerpt } from '../utils/blog-helpers';

export const GET: APIRoute = async () => {
	const posts = (await getCollection('blog'))
		.filter(p => !p.data.draft)
		.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

	const lines: string[] = [
		'# Code with Dan Blog',
		'',
		'> A blog by Dan Wahlin covering AI, agents, GitHub Copilot, Azure, TypeScript, Angular, Docker, and modern web development.',
		'',
		'## About',
		'',
		'Dan Wahlin is a developer at Microsoft focused on AI platform integration, GitHub Copilot, and Azure AI Foundry. This blog covers practical tutorials, architecture patterns, and hands-on guides for developers working with AI and modern web technologies.',
		'',
		'## Links',
		'',
		'- [Homepage](https://blog.codewithdan.com/)',
		'- [RSS Feed](https://blog.codewithdan.com/rss.xml)',
		'- [Full Content for LLMs](https://blog.codewithdan.com/llms-full.txt)',
		'- [Sitemap](https://blog.codewithdan.com/sitemap-index.xml)',
		'',
		'## Blog Posts',
		'',
	];

	for (const post of posts) {
		const excerpt = getExcerpt(post.body || '', 150);
		lines.push(`- [${post.data.title}](https://blog.codewithdan.com/${post.id}/): ${excerpt}`);
	}

	return new Response(lines.join('\n'), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
