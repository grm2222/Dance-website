import { defineField, defineType } from 'sanity';

// Field-level localization: Mongolian now, English added later.
// See CLAUDE.md — content shape is { mn, en? }.

export const localeString = defineType({
  name: 'localeString',
  title: 'Localized string',
  type: 'object',
  fields: [
    defineField({
      name: 'mn',
      title: 'Mongolian',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'en', title: 'English', type: 'string' }),
  ],
});

export const localeText = defineType({
  name: 'localeText',
  title: 'Localized text',
  type: 'object',
  fields: [
    defineField({
      name: 'mn',
      title: 'Mongolian',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'en', title: 'English', type: 'text', rows: 4 }),
  ],
});

export const localeBlockContent = defineType({
  name: 'localeBlockContent',
  title: 'Localized rich text',
  type: 'object',
  fields: [
    defineField({
      name: 'mn',
      title: 'Mongolian',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
    }),
  ],
});
