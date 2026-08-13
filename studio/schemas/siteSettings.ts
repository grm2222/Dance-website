import { defineArrayMember, defineField, defineType } from 'sanity';
import { CogIcon } from '@sanity/icons';

// Singleton — edited via the pinned "Site settings" entry in the structure.
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'navigation', title: 'Menu' },
    { name: 'contact', title: 'Contact' },
    { name: 'footer', title: 'Footer' },
  ],
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site name',
      description: 'Shown in the header, footer, and browser tab.',
      type: 'localeString',
      group: 'general',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      description: 'Small line under the site name in the header, e.g. "1996 оноос хойш".',
      type: 'localeString',
      group: 'general',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      description: 'Square image works best; shown as a circle in the header.',
      type: 'image',
      group: 'general',
    }),

    defineField({
      name: 'navigation',
      title: 'Header menu',
      description:
        'The menu across the top of every page, in order. Drag to reorder. ' +
        'Only link to pages that actually exist — an empty menu item looks like a broken site.',
      type: 'array',
      of: [defineArrayMember({ type: 'navItem' })],
      group: 'navigation',
      validation: (rule) =>
        rule.max(7).warning('More than 7 top-level items will wrap on smaller laptops'),
    }),

    defineField({
      name: 'phone',
      title: 'Phone number',
      description: 'Shown in the header top bar and footer, e.g. +976 8808-7418.',
      type: 'string',
      group: 'contact',
      validation: (rule) =>
        rule
          .regex(/^[+\d][\d\s-]{5,20}$/)
          .error('Enter a valid phone number (digits, spaces and dashes only)'),
    }),
    defineField({
      name: 'emails',
      title: 'Email addresses',
      description: 'The first one is shown in the header; all are listed in the footer.',
      type: 'array',
      of: [
        {
          type: 'string',
          validation: (rule) =>
            rule
              .regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)
              .error('Enter a valid email address, e.g. info@dancesport.mn'),
        },
      ],
      group: 'contact',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'localeText',
      group: 'contact',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook page URL',
      type: 'url',
      group: 'contact',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      group: 'contact',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      group: 'contact',
    }),


    defineField({
      name: 'footerText',
      title: 'Footer text',
      description: 'Short mission statement shown in the first footer column.',
      type: 'localeText',
      group: 'footer',
    }),
    defineField({
      name: 'footerLinks',
      title: 'Footer links',
      description: 'The middle footer column. Usually a short mirror of the main menu.',
      type: 'array',
      of: [defineArrayMember({ type: 'navChild' })],
      group: 'footer',
      validation: (rule) => rule.max(8).warning('Long footer columns get skipped'),
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site settings' };
    },
  },
});
