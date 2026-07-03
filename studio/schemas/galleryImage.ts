import { defineField, defineType } from 'sanity';
import { ImagesIcon } from '@sanity/icons';

export const galleryImage = defineType({
  name: 'galleryImage',
  title: 'Gallery image',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'localeString',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers appear first',
    }),
  ],
  orderings: [
    {
      title: 'Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'caption.mn', media: 'image' },
    prepare({ title, media }) {
      return { title: title ?? 'Image', media };
    },
  },
});
