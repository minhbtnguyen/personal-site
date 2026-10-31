import { getCollection, type CollectionEntry } from 'astro:content';
import { SHOW_DRAFTS } from '../data/site';

export type Project = CollectionEntry<'projects'>;
export type Experiment = CollectionEntry<'experiments'>;

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefix a site-relative path with the deploy base, e.g. url('lab/') -> '/personal-site/lab/'. */
export const url = (path = '') => `${BASE}/${path.replace(/^\//, '')}`;

export const isExternal = (href: string) => /^https?:/.test(href);

/** A file in public/ (e.g. 'resume.pdf') or an http(s) URL, as an href. */
export const asset = (path: string) => (isExternal(path) ? path : url(path));

/** A project gets a page here unless it sets `url` to link out instead. */
export const hasPage = (p: Project) => !p.data.url;
export const projectHref = (p: Project) => p.data.url ?? url(`projects/${p.id}/`);

export const hasBody = (w: Experiment) => Boolean(w.body && w.body.trim());

/** Experiments with a body get a page on this site; the rest link out. */
export const experimentHref = (w: Experiment) => (hasBody(w) ? url(`lab/${w.id}/`) : w.data.url!);

/** Only `publish: Publish` entries show, unless SHOW_DRAFTS is on. */
const isVisible = (x: Project | Experiment) => SHOW_DRAFTS || x.data.publish === 'Publish';

/** Projects, newest year first. */
export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects', isVisible);
  return all.sort((a, b) => b.data.year - a.data.year);
}

/** Experiments, newest first. */
export async function getExperiments(): Promise<Experiment[]> {
  const all = await getCollection('experiments', isVisible);
  for (const w of all) {
    if (!hasBody(w) && !w.data.url) {
      throw new Error(`Experiment "${w.id}" has no body and no url. Add content or set \`url\` to link out.`);
    }
  }
  return all.sort((a, b) => b.data.date.localeCompare(a.data.date));
}
