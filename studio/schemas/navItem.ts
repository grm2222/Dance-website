import { defineArrayMember, defineField, defineType } from 'sanity';

// One entry in the header menu. Kept as an object (not a document) so the whole
// menu is edited in one place inside Site settings.
//
// Two levels only — a third level does not fit the header design and gets lost
// on phones. See docs/design-wdc.md §2.

/**
 * Every page on the site, offered as a dropdown so an editor never has to know
 * or type a URL. Add a page here when a new one is built, otherwise it will not
 * be offered in the menu or footer.
 */
const SITE_PAGES = [
  { title: 'Home', value: '/' },
  { title: 'News', value: '/news' },
  { title: 'Calendar — upcoming competitions', value: '/calendar' },
  { title: 'Results', value: '/results' },
  { title: 'Dancers', value: '/dancers' },
  { title: 'Registration — choose type', value: '/register' },
  { title: 'Registration — club form', value: '/register/club' },
  { title: 'Registration — dancer form', value: '/register/dancer' },
];

const hrefField = defineField({
  name: 'href',
  title: 'Page',
  description: 'Pick the page this link opens.',
  type: 'string',
  options: { list: SITE_PAGES },
  // A link needs one of the two target fields — otherwise it goes nowhere.
  validation: (rule) =>
    rule.custom((_value, context) => {
      const parent = context.parent as { href?: string; customHref?: string } | undefined;
      return parent?.href || parent?.customHref
        ? true
        : 'Choose a page, or type a custom address below';
    }),
});

// Escape hatch for the two things the dropdown cannot cover: a news category
// page, and a link to another website.
const customHrefField = defineField({
  name: 'customHref',
  title: 'Or a custom address',
  description:
    'Leave empty unless you need it. Use for a news category (e.g. /news/category/dotood-medee) ' +
    'or another website (e.g. https://worlddancesport.org). This wins over the page above.',
  type: 'string',
  validation: (rule) =>
    rule
      .regex(/^(\/|https?:\/\/)/, { name: 'path or URL' })
      .error('Start with / for a page on this site, or https:// for another website'),
});


export const ctaLink = defineType({
  name: 'ctaLink',
  title: 'Button',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Button text',
      type: 'localeString',
      validation: (rule) => rule.required(),
    }),
    hrefField,
    customHrefField,
  ],
  preview: {
    select: { title: 'label.mn', href: 'href', customHref: 'customHref' },
    prepare({ title, href, customHref }) {
      return { title, subtitle: customHref || href || '(no link set)' };
    },
  },
});

export const navChild = defineType({
  name: 'navChild',
  title: 'Submenu item',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'localeString',
      validation: (rule) => rule.required(),
    }),
    hrefField,
    customHrefField,
  ],
  preview: {
    select: { title: 'label.mn', href: 'href', customHref: 'customHref' },
    prepare({ title, href, customHref }) {
      return { title, subtitle: customHref || href || '(no link set)' };
    },
  },
});

export const navItem = defineType({
  name: 'navItem',
  title: 'Menu item',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      description: 'Shown in the header in capitals.',
      type: 'localeString',
      validation: (rule) => rule.required(),
    }),
    hrefField,
    customHrefField,
    defineField({
      name: 'children',
      title: 'Submenu',
      description:
        'Optional. Keep to 6 or fewer — long dropdowns are hard to use, especially on phones. ' +
        'The parent link above still needs to go to a real page.',
      type: 'array',
      of: [defineArrayMember({ type: 'navChild' })],
      validation: (rule) => rule.max(6).warning('More than 6 submenu items gets hard to scan'),
    }),
  ],
  preview: {
    select: { title: 'label.mn', href: 'href', customHref: 'customHref', children: 'children' },
    prepare({ title, href, customHref, children }) {
      const count = Array.isArray(children) ? children.length : 0;
      const target = customHref || href || '(no link set)';
      return {
        title,
        subtitle: count > 0 ? `${target} · ${count} submenu item(s)` : target,
      };
    },
  },
});
