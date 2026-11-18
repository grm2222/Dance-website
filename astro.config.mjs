// @ts-check
import process from 'node:process';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';

/**
 * The site's public address, used to build the absolute URLs that canonical
 * tags, hreflang and the sitemap all require.
 *
 * Vercel sets VERCEL_PROJECT_PRODUCTION_URL to the project's production
 * domain and updates it when a custom domain is added, so the right address
 * follows the move on its own. PUBLIC_SITE_URL overrides it if ever needed.
 */
const site =
  process.env.PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:4321');

// https://astro.build/config
export default defineConfig({
  site,

  // Mongolian is the default and keeps the bare paths (/news); English is
  // served under /en/. This makes each language a real, indexable URL rather
  // than a client-side text swap. See docs/design-wdc.md.
  i18n: {
    defaultLocale: 'mn',
    locales: ['mn', 'en'],
    routing: {
      prefixDefaultLocale: false
    }
  },

  vite: {
    plugins: [tailwindcss()]
  },

  // Pages render on demand and are then cached like static files (ISR), so a
  // visitor gets a pre-built page at static speed.
  output: 'server',

  adapter: vercel({
    isr: {
      // Publishing in the Studio calls /api/revalidate, which refreshes exactly
      // the affected pages straight away — so an edit is live immediately
      // rather than after a rebuild.
      //
      // Spread rather than assign: the adapter rejects an explicit `undefined`
      // token, which would fail the build on any environment where the secret
      // is not set yet. Without it the site still works, just on the timed
      // expiry below instead of instant refreshes.
      ...(process.env.ISR_BYPASS_TOKEN
        ? { bypassToken: process.env.ISR_BYPASS_TOKEN }
        : {}),
      // Safety net. If a revalidation call is ever missed — or the token is not
      // configured — a page can be at most this stale.
      expiration: 300,
      // The API routes must NOT go through the ISR cache. Vercel's ISR
      // (prerender) functions only serve GET/HEAD, so a POST to one fails with
      // FUNCTION_INVOCATION_FAILED — which silently broke both registration
      // forms and /api/revalidate itself. Excluded routes are served by the
      // normal server function instead, and are never cached.
      //
      // This has to be a RegExp: the adapter compares string entries to a
      // route's pattern with `===`, so '/api/*' would match nothing at all.
      exclude: [/^\/api\//],
    },
  })
});