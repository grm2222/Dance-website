import { toHTML } from '@portabletext/to-html';
import type { PortableTextBlock } from './types';
import { urlFor } from './sanity';

/** e.g. "2026 оны 6 сарын 12" */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()} оны ${d.getMonth() + 1} сарын ${d.getDate()}`;
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
