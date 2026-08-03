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

  adapter: vercel()
});