/**
 * Locale plumbing. Mongolian is the default and keeps bare paths (`/news`);
 * English lives under `/en/` (`/en/news`). Configured in astro.config.mjs.
 *
 * Components read the active locale from `Astro.currentLocale` rather than
 * having it threaded through as a prop — Astro derives it from the URL.
 */

export const LOCALES = ['mn', 'en'] as const;
export type Lang = (typeof LOCALES)[number];

export const DEFAULT_LANG: Lang = 'mn';

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/** Normalizes whatever `Astro.currentLocale` gives us into a known locale. */
export function toLang(value: string | undefined): Lang {
  return isLang(value) ? value : DEFAULT_LANG;
}

/** Removes a leading `/en` so paths can be compared across locales. */
export function stripLocale(pathname: string): string {
  const bare = pathname.replace(/^\/en(?=\/|$)/, '');
  return bare === '' ? '/' : bare;
}

/**
 * Rewrites a locale-neutral path for the given language.
 * `localizePath('/news', 'en')` → `/en/news`; `(…, 'mn')` → `/news`.
 */
export function localizePath(pathname: string, lang: Lang): string {
  const bare = stripLocale(pathname);
  if (lang === DEFAULT_LANG) return bare;
  return bare === '/' ? '/en/' : `/en${bare}`;
}

/** The same page in the other language — used by the header's selector. */
export function alternatePath(pathname: string, lang: Lang): string {
  return localizePath(pathname, lang === 'mn' ? 'en' : 'mn');
}

/** `hreflang` alternates for the current page, for search engines. */
export function alternates(pathname: string): { lang: Lang; href: string }[] {
  return LOCALES.map((lang) => ({ lang, href: localizePath(pathname, lang) }));
}

export const LANG_LABELS: Record<Lang, { short: string; full: string }> = {
  mn: { short: 'МН', full: 'Монгол' },
  en: { short: 'EN', full: 'English' },
};

/**
 * The address a CMS link points at. Editors pick a page from a dropdown
 * (`href`); `customHref` is the escape hatch for news categories and outside
 * sites, so it wins when both are set. Internal paths get the locale prefix,
 * external URLs are left alone.
 */
export function linkHref(
  link: { href?: string; customHref?: string } | undefined,
  lang: Lang,
): string {
  const target = link?.customHref || link?.href || '/';
  return target.startsWith('/') ? localizePath(target, lang) : target;
}
