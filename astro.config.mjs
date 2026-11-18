// @ts-check
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
  // visitor gets a pre-built page at static speed, but an edit published in the
  // Studio appears within `expiration` seconds instead of waiting for a full
  // site rebuild. The publish webhook still rebuilds, which refreshes the cache
  // for everyone at once.
  output: 'server',

  adapter: vercel({
    isr: {
      expiration: 30,
    },
  })
});