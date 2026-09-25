import { getCollection, type CollectionEntry } from 'astro:content';
import { SHOW_DRAFTS } from '../data/site';

export type Project = CollectionEntry<'projects'>;
export type Post = CollectionEntry<'posts'>;

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefix a site-relative path with the deploy base, e.g. url('writing/') -> '/personal-site/writing/'. */
export const url = (path = '') => `${BASE}/${path.replace(/^\//, '')}`;

export const isExternal = (href: string) => /^https?:/.test(href);

/** A file in public/ (e.g. 'resume.pdf') or an http(s) URL, as an href. */
export const asset = (path: string) => (isExternal(path) ? path : url(path));

export const projectUrl = (id: string) => url(`projects/${id}/`);

export const hasBody = (w: Post) => Boolean(w.body && w.body.trim());

/** Posts with a body are published on this site; the rest link out. */
export const postHref = (w: Post) => (hasBody(w) ? url(`writing/${w.id}/`) : w.data.url!);

/** Projects, newest year first. Only `publish: Publish` shows, unless SHOW_DRAFTS is on. */
export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects', p => SHOW_DRAFTS || p.data.publish === 'Publish');
  return all.sort((a, b) => b.data.year - a.data.year);
}

/** Posts, newest first. */
export async function getPosts(): Promise<Post[]> {
  const all = await getCollection('posts', w => SHOW_DRAFTS || !w.data.draft);
  for (const w of all) {
    if (!hasBody(w) && !w.data.url) {
      throw new Error(`Post "${w.id}" has no body and no url. Add content or set \`url\` to link out.`);
    }
  }
  return all.sort((a, b) => b.data.date.localeCompare(a.data.date));
}
