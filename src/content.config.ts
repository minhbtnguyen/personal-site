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
  'Agents',
  'Apps'
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
  schema: ({ image }) => z.object({
    name: z.string(),
    categories: z.array(z.enum(CATEGORIES)).min(1), // one or more ML stack layers
    year: z.number().int(),
    status: z.string(), // 'Live', 'In progress', 'Complete', 'Archived'
    featured: z.boolean().default(false),
    publish: z.enum(['Draft', 'Publish']).default('Draft'), // only 'Publish' shows on the site (unless SHOW_DRAFTS is on)
    tagline: z.string(),
    summary: z.string().optional(),
    stack: z.array(z.string()).optional(), // tech stack, e.g. [Python, PyTorch]
    award: z.string().optional(), // e.g. 'Winner, Plotly ChatGPT & Generative AI Hackathon'
    // Card thumbnail, shown cropped to fill a box; a square-ish image works best.
    // Images go in src/content/projects/images/.
    cover: z.object({ src: image(), alt: z.string() }).optional(),
    url: webUrl.optional(), // set to link the card to another site instead of a page here
    links: z.object({ source: webUrl.optional(), demo: webUrl.optional(), video: webUrl.optional() }).optional()
  })
});

/* Writing labels, in the order their tabs appear on the Writing page. */
export const WRITING_TYPES = ['Research note'] as const; // papers live on Google Scholar

/* One folder per writing: src/content/writings/<id>/index.mdx, with its images
   beside it (referenced as ./cover.png). The folder name is the id used in the
   URL (/writing/<id>/). A writing with no body must set `url` and links out. */
const writings = defineCollection({
  loader: glob({
    pattern: '*/index.{md,mdx}',
    base: './src/content/writings',
    generateId: ({ entry }) => entry.split('/')[0]!.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }),
  schema: ({ image }) => z.object({
    type: z.enum(WRITING_TYPES),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD'),
    title: z.string(),
    dek: z.string().optional(),
    readTime: z.string().optional(),
    venue: z.string().optional(),
    url: webUrl.optional(),
    publish: z.enum(['Draft', 'Publish']).default('Draft'), // only 'Publish' shows on the site (unless SHOW_DRAFTS is on)
    cover: z.object({ src: image(), alt: z.string() }).optional(), // image under the title
    project: reference('projects').optional(),
    figure: figure.optional()
  })
});

export const collections = { projects, writings };
