import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/* Links rendered into pages must be web links: this rejects `javascript:`,
   `data:` and other schemes that could run code when clicked. */
const webUrl = z.url({ protocol: /^https?$/ });
/** A site-relative path (e.g. /images/shot.png) or a web link. */
const src = z.string().refine(s => !/^[a-z][a-z\d+.-]*:/i.test(s) || /^https?:/i.test(s), 'Use a site path or an http(s) URL');

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

const visual = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('chip'), blocks: z.array(z.object({ label: z.string(), accent: z.boolean().optional() })).min(1) }),
  z.object({ kind: z.literal('terminal'), title: z.string().optional(), lines: z.array(z.object({ label: z.string(), text: z.string(), tone: z.enum(['q', 'run', 'err', 'ok']).optional() })) }),
  z.object({ kind: z.literal('steps'), steps: z.array(z.object({ title: z.string(), sub: z.string() })) }),
  z.object({ kind: z.literal('image'), src, alt: z.string().optional() })
]);

/* One YAML file per project in src/content/projects. The filename is the id
   used in URLs (/projects/<id>/). Every section except the hero is optional. */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/projects' }),
  schema: z.object({
    name: z.string(),
    category: z.string(),
    year: z.number().int(),
    status: z.string(), // 'Live', 'In progress', 'Complete', 'Archived'
    featured: z.boolean().default(false),
    draft: z.boolean().default(false), // hidden unless SHOW_DRAFTS is on
    tagline: z.string(),
    summary: z.string().optional(),
    result: z.object({ text: z.string(), footnote: z.string().optional() }).optional(), // headline outcome on cards and the hero
    facts: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
    links: z.object({ source: webUrl.optional(), demo: webUrl.optional() }).optional(),
    visual: visual.optional(), // omit for a monogram
    overview: z.string().optional(),
    challenge: z.string().optional(),
    approach: z.string().optional(),
    architecture: z.object({
      heading: z.string().optional(),
      sub: z.string().optional(),
      loop: z.string().optional(),
      output: z.string().optional(),
      stages: z.array(z.object({
        title: z.string(),
        sub: z.string().optional(),
        side: z.object({ title: z.string(), sub: z.string().optional() }).optional(),
        heading: z.string().optional(),
        body: z.string().optional()
      })).min(1)
    }).optional(),
    metricsTitle: z.string().optional(),
    metrics: z.array(z.object({ value: z.string(), label: z.string(), footnote: z.string().optional() })).optional(),
    decisions: z.array(z.object({ title: z.string(), body: z.string() })).optional(),
    source: z.object({ clone: z.string(), tree: z.array(z.string()).optional(), note: z.string().optional() }).optional()
  })
});

/* One MDX file per post in src/content/posts. A post with a body is published
   at /blog/<id>/. A post with no body must set `url` and links out instead. */
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
