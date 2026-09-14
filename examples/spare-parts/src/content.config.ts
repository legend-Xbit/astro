import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const parts = defineCollection({
	loader: glob({ base: './src/content/parts', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		category: z.enum(['فرامل', 'محرك', 'فلاتر', 'كهرباء', 'تعليق']),
		sku: z.string(),
		brand: z.string(),
		price: z.number(),
		oem: z.boolean(),
		inStock: z.boolean(),
		featured: z.boolean().default(false),
		compatibility: z.array(z.string()),
		publishDate: z.coerce.date(),
	}),
});

export const collections = { parts };
