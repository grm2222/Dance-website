import type { APIRoute } from 'astro';

/**
 * An endpoint rather than a static file in public/, because the Sitemap line
 * has to be an absolute URL and the site's address comes from `site` in
 * astro.config.mjs — which follows a custom domain on its own.
 */
export const GET: APIRoute = ({ site, url }) => {
  const base = site ?? new URL(url.origin);

  const body = `User-agent: *
Allow: /
# The form endpoints accept POST only — nothing for a crawler to index.
Disallow: /api/

Sitemap: ${new URL('/sitemap.xml', base).href}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
