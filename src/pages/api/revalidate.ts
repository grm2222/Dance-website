import type { APIRoute } from 'astro';

export const prerender = false;

/**
 * Called by the Sanity webhook whenever content is published.
 *
 * Vercel refreshes a cached page when it receives a request for that page
 * carrying the `x-prerender-revalidate` header with the deployment's bypass
 * token. So this endpoint works out which pages the edited document affects and
 * re-requests each of them with that header. The result is that a publish is
 * live immediately, instead of waiting for the ISR expiry or a full rebuild.
 *
 * The same token authenticates the webhook: Sanity sends it, we compare, and
 * then reuse it to bypass the cache. Both uses control the same cache, so one
 * secret is enough.
 */
const TOKEN = (import.meta.env.ISR_BYPASS_TOKEN as string | undefined) || undefined;

/** Both language trees of a path: `/news` → `/news` and `/en/news`. */
function bothLocales(paths: string[]): string[] {
  return paths.flatMap((p) => [p, p === '/' ? '/en/' : `/en${p}`]);
}

/**
 * Which pages show this document. Listing pages are included alongside the
 * document's own page because a new article also changes the homepage and the
 * news index.
 */
function affectedPaths(type: string, slug?: string): string[] {
  switch (type) {
    case 'newsArticle':
      return bothLocales(['/', '/news', ...(slug ? [`/news/${slug}`] : [])]);
    case 'newsCategory':
      return bothLocales(['/news', ...(slug ? [`/news/category/${slug}`] : [])]);
    case 'event':
      return bothLocales(['/', '/calendar', '/results']);
    case 'dancer':
      return bothLocales(['/dancers', ...(slug ? [`/dancers/${slug}`] : [])]);
    case 'galleryImage':
      return bothLocales(['/']);
    // Header, footer and page copy appear on every page.
    case 'siteSettings':
    case 'pageContent':
      return bothLocales(['/', '/news', '/calendar', '/results', '/dancers', '/register']);
    default:
      return [];
  }
}

function json(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  if (!TOKEN) {
    console.error('[revalidate] ISR_BYPASS_TOKEN is not set.');
    return json({ ok: false, error: 'not configured' }, 503);
  }

  // Constant-time-ish check: the header must match exactly.
  const sent = request.headers.get('x-revalidate-token');
  if (!sent || sent !== TOKEN) {
    return json({ ok: false, error: 'unauthorized' }, 401);
  }

  let payload: { _type?: string; slug?: string };
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid body' }, 400);
  }

  const type = payload._type;
  if (!type) return json({ ok: false, error: 'missing _type' }, 400);

  const paths = affectedPaths(type, payload.slug);
  if (paths.length === 0) {
    // Registration requests and anything else that never reaches a page.
    return json({ ok: true, type, revalidated: [], skipped: true }, 200);
  }

  const origin = new URL(request.url).origin;
  const results = await Promise.all(
    paths.map(async (path) => {
      try {
        const res = await fetch(`${origin}${path}`, {
          headers: { 'x-prerender-revalidate': TOKEN },
        });
        return { path, status: res.status };
      } catch (error) {
        console.error('[revalidate] failed for', path, error);
        return { path, status: 0 };
      }
    }),
  );

  const failed = results.filter((r) => r.status === 0 || r.status >= 400);
  if (failed.length > 0) {
    console.error('[revalidate] some paths failed:', failed);
  }

  return json({ ok: failed.length === 0, type, revalidated: results }, 200);
};
