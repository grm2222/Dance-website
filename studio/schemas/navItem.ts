import { defineArrayMember, defineField, defineType } from 'sanity';

// One entry in the header menu. Kept as an object (not a document) so the whole
// menu is edited in one place inside Site settings.
//
// Two levels only — a third level does not fit the header design and gets lost
// on phones. See docs/design-wdc.md §2.

const hrefField = defineField({
  name: 'href',
  title: 'Link',
  description: 'A path on this site, e.g. /news — or a full https:// address.',
  type: 'string',
  validation: (rule) =>
    rule
      .required()
      .regex(/^(\/|https?:\/\/)/, {
        name: 'path or URL',
      })
      .error('Start with / for a page on this site, or https:// for an external link'),
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
  ],
  preview: {
    select: { title: 'label.mn', subtitle: 'href' },
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
  ],
  preview: {
    select: { title: 'label.mn', subtitle: 'href' },
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
    select: { title: 'label.mn', subtitle: 'href', children: 'children' },
    prepare({ title, subtitle, children }) {
      const count = Array.isArray(children) ? children.length : 0;
      return {
        title,
        subtitle: count > 0 ? `${subtitle} · ${count} submenu item(s)` : subtitle,
      };
    },
  },
});
