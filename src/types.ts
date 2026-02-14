import type { CollectionEntry } from 'astro:content';

export type BlogPostProps = CollectionEntry<'blog'>['data'] & {
	body?: string;
	postId?: string;
	headings?: { depth: number; slug: string; text: string }[];
	series?: string;
	seriesOrder?: number;
	lastModified?: Date;
	prevPost?: { id: string; title: string } | null;
	nextPost?: { id: string; title: string } | null;
};
