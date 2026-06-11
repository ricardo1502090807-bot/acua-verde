import { z } from 'astro:content';

export const BaseWPSchema = z.object({
    id: z.number(),
    title: z.string(),
  description: z.string(),
  image: z.string().optional(),
});