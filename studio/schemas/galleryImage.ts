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
      description: 'Shown as a square in the album — use the crop tool to pick the focus area.',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required().error('Upload a photo — a gallery entry needs one'),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      description: 'Shown over the photo on the website; also read aloud by screen readers.',
      type: 'localeString',
      validation: (rule) =>
        rule.required().warning('Add a caption — it helps blind readers and gives the photo context'),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers appear first on the website (1 is shown first).',
      validation: (rule) => rule.integer().positive().error('Use a whole number, 1 or higher'),
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
