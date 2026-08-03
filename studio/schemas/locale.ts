import { defineField, defineType } from 'sanity';

// Field-level localization: Mongolian is required, English optional.
// See CLAUDE.md — content shape is { mn, en? }.
//
// The website serves Mongolian at / and English at /en. When an English value
// is empty the English page falls back to the Mongolian text, so the site is
// never blank — but it does show Mongolian to English readers. That is why
// every `en` field below says so in its description.

const EN_HELP =
  'Shown on the English site (/en). Leave empty and the English page falls back to the Mongolian text.';

export const localeString = defineType({
  name: 'localeString',
  title: 'Localized string',
  type: 'object',
  options: { columns: 1 },
  fields: [
    defineField({
      name: 'mn',
      title: 'Mongolian — Монгол',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'en',
      title: 'English',
      description: EN_HELP,
      type: 'string',
    }),
  ],
});

export const localeText = defineType({
  name: 'localeText',
  title: 'Localized text',
  type: 'object',
  fields: [
    defineField({
      name: 'mn',
      title: 'Mongolian — Монгол',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'en',
      title: 'English',
      description: EN_HELP,
      type: 'text',
      rows: 4,
    }),
  ],
});

export const localeBlockContent = defineType({
  name: 'localeBlockContent',
  title: 'Localized rich text',
  type: 'object',
  fields: [
    defineField({
      name: 'mn',
      title: 'Mongolian — Монгол',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'en',
      title: 'English',
      description:
        'Shown on the English site (/en). Leave empty and the English article falls back to the ' +
        'Mongolian text, with a note telling the reader it has not been translated yet.',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
    }),
  ],
});
