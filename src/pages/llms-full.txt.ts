import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
	const posts = (await getCollection('blog'))
		.filter(p => !p.data.draft)
		.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

	const sections: string[] = [
		'# Code with Dan Blog — Full Content',
		'',
		'> Complete blog content for AI/LLM consumption. By Dan Wahlin.',
		'',
	];

	for (const post of posts) {
		const date = post.data.date.toISOString().split('T')[0];
		const categories = post.data.categories?.join(', ') || '';
		const tags = post.data.tags?.join(', ') || '';

		sections.push('---');
		sections.push('');
		sections.push(`## ${post.data.title}`);
		sections.push('');
		sections.push(`**Date:** ${date}  `);
		sections.push(`**URL:** https://blog.codewithdan.com/${post.id}/  `);
		if (categories) sections.push(`**Categories:** ${categories}  `);
		if (tags) sections.push(`**Tags:** ${tags}  `);
		sections.push('');
		sections.push(post.body || '*(no content)*');
		sections.push('');
	}

	return new Response(sections.join('\n'), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
