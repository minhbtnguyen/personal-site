# personal-site

Personal site built with [Astro](https://astro.build), published to GitHub Pages at
https://minhbtnguyen.github.io/personal-site/.

## Develop

```sh
npm install
npm run dev      # http://localhost:4321/personal-site/
npm run build    # type-check, then build to dist/
npm run preview  # serve dist/
```

## Edit content

| What | Where |
| --- | --- |
| Name, role, links, resume, photo, headline, about, experience, skills, contact | `src/data/site.ts` |
| Projects | `src/content/projects/<id>.yaml` (one file per project) |
| Posts | `src/content/posts/<id>.mdx` (one file per post) |

The filename is the id used in URLs: `/projects/<id>/` and `/writing/<id>/`.
The build fails with a clear message if a file doesn't match the schema in
`src/content.config.ts`.

**Projects.** `sample-project-a.yaml` uses every optional section; leave a field
out and its section is not rendered. `featured: true` puts a project on the
homepage (up to three). Visual kinds: `chip`, `terminal`, `steps`, `image`
(image paths are relative to `public/`); omit `visual` for a monogram.
`result: { text, footnote }` shows a key result on the card and project hero.

**Resume and photo.** Put the files in `public/` and set `owner.resume` /
`owner.photo` in `src/data/site.ts` to their names (e.g. `resume.pdf`).

**Drafts.** `draft: true` on a project or post hides it from the build. Set
`SHOW_DRAFTS = true` in `src/data/site.ts` to preview drafts, marked with a badge.

**Posts.** Write the body in Markdown. `>` renders as a pull quote and `[^1]`
adds a footnote. A post with no body links out to its `url` instead of getting
a page (papers, talks). `project: <id>` links a post to a project. These
components are available without importing:

~~~mdx
<Formula expr="throughput = requests / seconds" caption="What it measures." />

<Code filename="run.py">
```python
print("hello")
```
</Code>

<Output text={`$ python run.py
hello`} />

<Note>Run it with `python run.py`.</Note>

<Figure title="Latency" chart={{ x: ["1k", "10k"], yMax: 10, yStep: 5, series: [{ name: "A", values: [2, 6] }] }} />
~~~

A `figure:` in a post's frontmatter renders as the large chart under the title;
see `sample-research-note.mdx`.

## Deploy

Pushing to `main` builds and deploys via `.github/workflows/deploy.yml`.
One-time setup: in the repository's **Settings → Pages**, set **Source** to
**GitHub Actions**.

To serve from a custom domain or a `minhbtnguyen.github.io` repository, update
`site` and remove `base` in `astro.config.mjs`.

## Security

- A Content Security Policy is set on every page (`security.csp` in
  `astro.config.mjs`): only this site's own scripts run, hashed at build time.
  New third-party scripts, styles, fonts or embeds must be added there or the
  browser blocks them. Check with `npm run build && npm run preview`, since CSP
  does not apply in `npm run dev`.
- Content links must be `http(s)` URLs; the schema rejects `javascript:` and
  other schemes. External links open with `noopener noreferrer`.
- The deploy workflow pins actions to commit SHAs with least-privilege
  permissions; Dependabot proposes updates to actions and npm packages.

`samples/` holds the original single-file template this site was ported from.
