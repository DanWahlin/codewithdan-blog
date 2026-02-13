import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		categories: z.array(z.string()).optional(),
		tags: z.array(z.string()).optional(),
		coverImage: z.string().optional(),
		draft: z.boolean().optional(),
	}),
});

export const collections = { blog };
