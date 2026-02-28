// src/content.config.ts
// IMPORTANT: This file is at src/content.config.ts (Astro 5 location)
// NOT src/content/config.ts (that was Astro 4 — wrong location in Astro 5)
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  // schema must be a function receiving { image } so image() helper is available
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      company: z.string(),
      year: z.number(),
      description: z.string(),
      heroImage: image(),
      cardImage: image(),
      cardImageSecondary: image().optional(),
      order: z.number(),
      draft: z.boolean().optional().default(false),
    }),
});

export const collections = { work };
