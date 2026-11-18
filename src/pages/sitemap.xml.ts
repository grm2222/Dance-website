import type { APIRoute } from 'astro';
import { sanityFetch } from '../lib/sanity';
import { sitemapQuery } from '../lib/queries';
import { PER_PAGE } from '../lib/pagination';
import { LOCALES, localizePath, type Lang } from '../lib/i18n';

/**
 * Generated from Sanity rather than from a build-time plugin, so a newly
 * published article or dancer appears without a redeploy. It costs one GROQ
 * query, and the ISR cache in astro.config.mjs keeps that from running on
 * every crawl.
 */

interface SitemapData {
  news: string[];
  categories: string[];
  dancers: string[];
  dancerCount: number;
}

/** Pages that always exist, independent of content. */
const STATIC_PATHS = [
  '/',
  '/news',
  '/calendar',
  '/results',
  '/dancers',
  '/register',
  '/register/club',
  '/register/dancer',
];

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: APIRoute = async ({ site, url }) => {
  const data = await sanityFetch<SitemapData>(sitemapQuery, {
    news: [],
    categories: [],
    dancers: [],
    dancerCount: 0,
  });

  const base = site ?? new URL(url.origin);

  const paths = [
    ...STATIC_PATHS,
    ...data.categories.map((slug) => `/news/category/${slug}`),
    ...data.news.map((slug) => `/news/${slug}`),
    ...data.dancers.map((slug) => `/dancers/${slug}`),
  ];

  // Page 1 of the directory is /dancers, already listed above.
  const totalPages = Math.max(1, Math.ceil(data.dancerCount / PER_PAGE));
  for (let p = 2; p <= totalPages; p++) paths.push(`/dancers/page/${p}`);

  // Each page is listed once per language, and each entry points at its
  // counterpart so search engines pair the two versions.
  const entries = paths.flatMap((path) =>
    LOCALES.map((lang: Lang) => {
      const loc = new URL(localizePath(path, lang), base).href;
      const links = LOCALES.map(
        (other) =>
          `    <xhtml:link rel="alternate" hreflang="${other}" href="${escapeXml(
            new URL(localizePath(path, other), base).href,
          )}" />`,
      ).join('\n');
      return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n${links}\n  </url>`;
    }),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
