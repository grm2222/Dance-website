import { defineField, defineType } from 'sanity';
import { CogIcon } from '@sanity/icons';

// Singleton — edited via the pinned "Site settings" entry in the structure.
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'contact', title: 'Contact' },
    { name: 'homepage', title: 'Homepage' },
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
      name: 'logo',
      title: 'Logo',
      description: 'Square image works best; shown at small size in the header.',
      type: 'image',
      group: 'general',
    }),
    defineField({
      name: 'phone',
      title: 'Phone number',
      description: 'Shown in the header top bar and footer.',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'emails',
      title: 'Email addresses',
      description: 'The first one is shown in the header; all are listed in the footer.',
      type: 'array',
      of: [{ type: 'string' }],
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
      name: 'heroTitle',
      title: 'Hero title',
      description: 'First line of the big homepage title.',
      type: 'localeString',
      group: 'homepage',
    }),
    defineField({
      name: 'heroTitleAccent',
      title: 'Hero title accent line',
      description: 'Second title line, shown in red.',
      type: 'localeString',
      group: 'homepage',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero subtitle',
      type: 'localeText',
      group: 'homepage',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero background image',
      description: 'Shown behind the homepage title, darkened. Wide photos work best.',
      type: 'image',
      group: 'homepage',
      options: { hotspot: true },
    }),
    defineField({
      name: 'aboutTitle',
      title: 'About section title',
      type: 'localeString',
      group: 'homepage',
    }),
    defineField({
      name: 'aboutText',
      title: 'About section text',
      type: 'localeText',
      group: 'homepage',
    }),
    defineField({
      name: 'footerText',
      title: 'Footer text',
      description: 'Short mission statement shown in the footer.',
      type: 'localeText',
      group: 'footer',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site settings' };
    },
  },
});
