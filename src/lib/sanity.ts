import { createClient } from '@sanity/client';
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';

// `||` not `??`: an empty value in .env comes through as '', which must
// count as "not configured" rather than be passed to createClient.
const projectId = (import.meta.env.PUBLIC_SANITY_PROJECT_ID as string | undefined) || undefined;
const dataset = (import.meta.env.PUBLIC_SANITY_DATASET as string | undefined) || 'production';

/**
 * Read token, required once the dataset is private.
 *
 * The dataset must be private: it holds the registration requests, which
 * carry a dancer's phone, email and full date of birth — often a child's. A
 * public dataset serves those to anyone who knows the project ID, no matter
 * what the website chooses to render. Server-only, never sent to the browser.
 */
const readToken = (import.meta.env.SANITY_READ_TOKEN as string | undefined) || undefined;

/**
 * True once PUBLIC_SANITY_PROJECT_ID is set. Without it the site still
 * builds (empty content, default text) so local setup never blocks on
 * CMS credentials.
 */
export const isSanityConfigured = Boolean(projectId);

export const sanityClient = createClient({
  projectId: projectId ?? 'unconfigured',
  dataset,
  apiVersion: '2026-06-01',
  ...(readToken ? { token: readToken } : {}),
  // Pages render on demand behind the ISR cache (see astro.config.mjs), so a
  // query runs only when a page is actually rebuilt. Going straight to the API
  // rather than the CDN means a page refreshed right after a publish shows what
  // was just published, instead of whatever the CDN cached up to a minute ago.
  // A token also requires useCdn: false.
  useCdn: false,
});

const builder = createImageUrlBuilder(sanityClient);

/** Always go through the Sanity image pipeline — never serve originals. */
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto('format');
}

let warned = false;

/**
 * Fetch wrapper used by pages. Returns `fallback` when Sanity is not yet
 * configured; once configured, query errors propagate so broken builds
 * are visible instead of silently empty.
 */
export async function sanityFetch<T>(
  query: string,
  fallback: T,
  params: Record<string, unknown> = {},
): Promise<T> {
  if (!isSanityConfigured) {
    if (!warned) {
      warned = true;
      console.warn(
        '[sanity] PUBLIC_SANITY_PROJECT_ID is not set — building with empty content. ' +
          'Copy .env.example to .env and fill in your Sanity project ID.',
      );
    }
    return fallback;
  }
  return sanityClient.fetch<T>(query, params);
}
