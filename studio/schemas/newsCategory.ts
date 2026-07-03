import { defineField, defineType } from 'sanity';
import { TagIcon } from '@sanity/icons';

export const newsCategory = defineType({
  name: 'newsCategory',
  title: 'News category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title.mn', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'title.mn' },
  },
});
