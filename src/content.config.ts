import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/* Links rendered into pages must be web links: this rejects `javascript:`,
   `data:` and other schemes that could run code when clicked. */
const webUrl = z.url({ protocol: /^https?$/ });

/* The ML stack, bottom to top: math/research fundamentals, through building and
   tuning models, serving them, deploying to constrained hardware, the platform
   tooling that glues it together, evaluating it, up to the agents and apps
   users actually touch. Order here drives the category filter's order on the
   Projects page. */
export const CATEGORIES = [
  'Foundation',
  'Models',
  'Post-training',
  'Inference',
  'On-device',
  'Platform',
  'Evaluation',
  'Agents & Apps'
] as const;

const chart = z.object({
  x: z.array(z.string()),
  xLabel: z.string().optional(),
  yMax: z.number().positive(),
  yStep: z.number().positive(),
  yLabel: z.string().optional(),
  threshold: z.object({ value: z.number(), label: z.string() }).optional(),
  series: z.array(z.object({
    name: z.string(),
    tone: z.enum(['muted', 'accent']).optional(),
    values: z.array(z.number())
  })).min(1),
  markers: z.array(z.object({ series: z.number().int(), index: z.number().int(), label: z.string() })).optional()
});

export const figure = z.object({
  title: z.string(),
  footnote: z.string().optional(),
  caption: z.string().optional(),
  chart
});

/* One YAML file per project in src/content/projects. The filename is the id
   used in URLs (/projects/<id>/). A plain template: a description and links. */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/projects' }),
  schema: z.object({
    name: z.string(),
    categories: z.array(z.enum(CATEGORIES)).min(1), // one or more ML stack layers
    year: z.number().int(),
    status: z.string(), // 'Live', 'In progress', 'Complete', 'Archived'
    featured: z.boolean().default(false),
    publish: z.enum(['Draft', 'Publish']).default('Draft'), // only 'Publish' shows on the site (unless SHOW_DRAFTS is on)
    tagline: z.string(),
    summary: z.string().optional(),
    links: z.object({ source: webUrl.optional(), demo: webUrl.optional(), video: webUrl.optional() }).optional()
  })
});

/* One MDX file per post in src/content/posts. A post with a body is published
   at /writing/<id>/. A post with no body must set `url` and links out instead. */
const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    type: z.string(), // any label: 'Research note', 'Article', 'Paper', 'Talk'
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD'),
    title: z.string(),
    dek: z.string().optional(),
    readTime: z.string().optional(),
    venue: z.string().optional(),
    url: webUrl.optional(),
    draft: z.boolean().default(false),
    project: reference('projects').optional(),
    figure: figure.optional()
  })
});

export const collections = { projects, posts };
