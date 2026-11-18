// @ts-check
import process from 'node:process';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
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
      bypassToken: process.env.ISR_BYPASS_TOKEN,
      // Safety net only. If a revalidation call is ever missed, a page can be
      // at most this stale; it is not the normal path to freshness.
      expiration: 300,
    },
  })
});