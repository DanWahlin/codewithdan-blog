import type { CollectionEntry } from 'astro:content';

export type BlogPostProps = CollectionEntry<'blog'>['data'] & {
	body?: string;
	postId?: string;
	headings?: { depth: number; slug: string; text: string }[];
};
