import { toHTML } from '@portabletext/to-html';
import type { LocaleString, LocaleText, PortableTextBlock } from './types';
import { urlFor } from './sanity';

export type Lang = 'mn' | 'en';

/**
 * Reads a localized field. Mongolian is primary; English falls back to it,
 * so a half-translated site never renders blanks.
 *
 * Every user-facing string goes through here, which is what makes adding
 * English later a routing change rather than a rewrite. See CLAUDE.md.
 */
export function t(
  value: LocaleString | LocaleText | undefined | null,
  lang: Lang = 'mn',
): string {
  if (!value) return '';
  if (lang === 'en' && value.en) return value.en;
  return value.mn ?? '';
}

/** e.g. "2026 оны 6 сарын 12" */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()} оны ${d.getMonth() + 1} сарын ${d.getDate()}`;
}

/** Day + month for the calendar date block, e.g. { day: "15", month: "8-р сар" } */
export function dateParts(iso: string): { day: string; month: string } {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { day: '–', month: '' };
  return { day: String(d.getDate()).padStart(2, '0'), month: `${d.getMonth() + 1}-р сар` };
}

/** True when the ISO date falls on today's calendar day, in the server's zone. */
export function isToday(iso: string): boolean {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return false;
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

/** Whole days from today until `iso`; negative once past. */
export function daysUntil(iso: string): number {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 0;
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  return Math.round((startOf(d) - startOf(new Date())) / 86_400_000);
}

export function renderPortableText(blocks: PortableTextBlock[] | undefined): string {
  if (!blocks || blocks.length === 0) return '';
  return toHTML(blocks, {
    components: {
      types: {
        image: ({ value }) => {
          const src = urlFor(value).width(1200).url();
          const alt = typeof value.alt === 'string' ? value.alt : '';
          return `<img src="${src}" alt="${alt}" loading="lazy" />`;
        },
      },
    },
  });
}
