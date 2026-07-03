import { defineField, defineType } from 'sanity';
import { DocumentTextIcon } from '@sanity/icons';

export const newsArticle = defineType({
  name: 'newsArticle',
  title: 'News article',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'meta', title: 'Publishing' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'The article’s web address. Click "Generate" after writing the title.',
      type: 'slug',
      group: 'meta',
      options: { source: 'title.mn', maxLength: 96 },
      validation: (rule) => rule.required().error('Click "Generate" to create the web address'),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      description: 'Shown at the top of the article and on news cards. Landscape photos work best.',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          description: 'Short description of the photo for screen readers and search engines.',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      group: 'meta',
      to: [{ type: 'newsCategory' }],
      validation: (rule) => rule.required().error('Pick a category so the article shows in filters'),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      description: 'Articles are sorted by this date, newest first.',
      type: 'datetime',
      group: 'meta',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'localeBlockContent',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'viewCount',
      title: 'View count',
      type: 'number',
      group: 'meta',
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: 'Published date (newest first)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title.mn',
      category: 'category.title.mn',
      publishedAt: 'publishedAt',
      media: 'mainImage',
    },
    prepare({ title, category, publishedAt, media }) {
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString('en-CA') : 'no date';
      return {
        title,
        subtitle: [date, category].filter(Boolean).join(' · '),
        media,
      };
    },
  },
});
