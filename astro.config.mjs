import { defineConfig, fontProviders } from 'astro/config';
import { createHash } from 'node:crypto';
import mdx from '@astrojs/mdx';
import { templateCode } from './src/lib/code-theme.mjs';
import { themeInit } from './src/lib/theme-init.mjs';

// Astro does not hash `is:inline` scripts, so the theme script's hash is added here.
const themeInitHash = `sha256-${createHash('sha256').update(themeInit).digest('base64')}`;

// Served from https://minhbtnguyen.github.io/personal-site/.
// For a custom domain or a <user>.github.io repo, change `site` and remove `base`.
export default defineConfig({
  site: 'https://minhbtnguyen.github.io',
  base: '/personal-site',
  // Links are written with a trailing slash; 'ignore' also accepts URLs typed
  // without one, so a mistyped /projects/foo still reaches the custom 404.
  trailingSlash: 'ignore',
  integrations: [mdx()],
  // Fetch internal pages as their links scroll into view, so taps open them
  // instantly. Pages are small; Astro skips this on data-saver/slow connections.
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  markdown: { shikiConfig: { theme: templateCode } },

  // Downloaded from Google at build time and served from this site, so pages
  // don't wait on a render-blocking stylesheet from another origin.
  fonts: [
    { provider: fontProviders.google(), name: 'Inter', cssVariable: '--font-inter', weights: [400, 500, 600, 700], subsets: ['latin'], fallbacks: ['sans-serif'] },
    { provider: fontProviders.google(), name: 'JetBrains Mono', cssVariable: '--font-jetbrains', weights: [400, 500], subsets: ['latin'], fallbacks: ['monospace'] }
  ],

  // Content Security Policy, emitted as a <meta> tag on every page (GitHub Pages
  // cannot set response headers). Astro hashes every script and <style> it
  // renders, so only this site's own code can run.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' https:",            // project images may be hosted elsewhere
        "font-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'none'",
        "upgrade-insecure-requests"
      ],
      scriptDirective: { hashes: [themeInitHash] },
      styleDirective: {
        resources: [
          { resource: "'self'", kind: 'element' },
          // Style attributes only (code highlighting and a few layout tweaks use
          // them). CSS cannot run script; <style> elements stay hash-restricted.
          { resource: "'unsafe-inline'", kind: 'attribute' }
        ]
      }
    }
  }
});
