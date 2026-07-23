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
      description: 'Shown as a filter button on the news page, e.g. "Дотоод мэдээ".',
      type: 'localeString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description:
        'The category’s web address. Click "Generate" after writing the title. ⚠ Avoid changing it later — old links will stop working.',
      type: 'slug',
      options: { source: 'title.mn', maxLength: 96 },
      validation: (rule) => rule.required().error('Click "Generate" to create the web address'),
    }),
  ],
  preview: {
    select: { title: 'title.mn' },
  },
});
