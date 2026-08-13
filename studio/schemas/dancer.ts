import { defineArrayMember, defineField, defineType } from 'sanity';
import { UserIcon } from '@sanity/icons';

/**
 * A dancer's public profile.
 *
 * Deliberately separate from `dancerRegistrationRequest`. A registration form
 * carries a phone number, an email address and a full date of birth — often a
 * child's. None of that belongs on a public page, so an admin reviews a request
 * and then creates a profile here with only the details a federation directory
 * needs. Birth *year* is kept (it sets the age category); the exact date is not.
 */

const CLASS_LIST = [
  { title: 'E', value: 'E' },
  { title: 'D', value: 'D' },
  { title: 'C', value: 'C' },
  { title: 'B', value: 'B' },
  { title: 'A', value: 'A' },
  { title: 'S', value: 'S' },
  { title: 'M', value: 'M' },
];

export const dancerResult = defineType({
  name: 'dancerResult',
  title: 'Competition result',
  type: 'object',
  fields: [
    defineField({
      name: 'event',
      title: 'Competition',
      description: 'Pick from the competitions in Events.',
      type: 'reference',
      to: [{ type: 'event' }],
      validation: (rule) => rule.required().error('Choose which competition this result is from'),
    }),
    defineField({
      name: 'placing',
      title: 'Place',
      description: '1 for first place, 2 for second, and so on.',
      type: 'number',
      validation: (rule) => rule.integer().positive().error('Use a whole number, 1 or higher'),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      description: 'e.g. "Youth Latin" or "Өсвөр үе, Латин".',
      type: 'localeString',
    }),
    defineField({
      name: 'partner',
      title: 'Partner',
      description: 'Optional — the dancer they competed with.',
      type: 'string',
    }),
  ],
  preview: {
    select: { title: 'event.title.mn', placing: 'placing', category: 'category.mn' },
    prepare({ title, placing, category }) {
      const place = placing ? `${placing} place` : 'no place recorded';
      return { title: title ?? 'Competition', subtitle: [place, category].filter(Boolean).join(' · ') };
    },
  },
});

export const dancer = defineType({
  name: 'dancer',
  title: 'Dancer',
  type: 'document',
  icon: UserIcon,
  groups: [
    { name: 'profile', title: 'Profile', default: true },
    { name: 'sport', title: 'Sport' },
    { name: 'results', title: 'Results' },
  ],
  fields: [
    defineField({
      name: 'lastName',
      title: 'Last name',
      type: 'string',
      group: 'profile',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'firstName',
      title: 'First name',
      type: 'string',
      group: 'profile',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'The profile’s web address. Click "Generate" after entering the name.',
      type: 'slug',
      group: 'profile',
      options: {
        source: (doc) => `${doc.firstName ?? ''} ${doc.lastName ?? ''}`.trim(),
        maxLength: 96,
      },
      validation: (rule) => rule.required().error('Click "Generate" to create the web address'),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      description: 'Shown as a circle, so keep the face near the middle — use the crop tool.',
      type: 'image',
      group: 'profile',
      options: { hotspot: true },
    }),
    defineField({
      name: 'birthYear',
      title: 'Year of birth',
      description: 'Year only — it sets the age category. Do not publish a full date of birth.',
      type: 'number',
      group: 'profile',
      validation: (rule) =>
        rule.integer().min(1920).max(new Date().getFullYear()).error('Enter a four-digit year'),
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'localeString',
      group: 'profile',
    }),
    defineField({
      name: 'club',
      title: 'Club',
      type: 'string',
      group: 'profile',
    }),
    defineField({
      name: 'height',
      title: 'Height (cm)',
      description: 'Optional. Used for pairing and age-group checks.',
      type: 'number',
      group: 'sport',
      validation: (rule) => rule.min(80).max(230).warning('That height looks unlikely'),
    }),
    defineField({
      name: 'standardClass',
      title: 'Standard class',
      type: 'string',
      group: 'sport',
      options: { list: CLASS_LIST, layout: 'radio', direction: 'horizontal' },
    }),
    defineField({
      name: 'latinClass',
      title: 'Latin class',
      type: 'string',
      group: 'sport',
      options: { list: CLASS_LIST, layout: 'radio', direction: 'horizontal' },
    }),
    defineField({
      name: 'isActive',
      title: 'Currently competing',
      description: 'Turn off to keep the profile but mark the dancer as inactive.',
      type: 'boolean',
      group: 'sport',
      initialValue: true,
    }),
    defineField({
      name: 'results',
      title: 'Competition results',
      description: 'Newest first is easiest to read. Each entry links to a competition in Events.',
      type: 'array',
      of: [defineArrayMember({ type: 'dancerResult' })],
      group: 'results',
    }),
  ],
  orderings: [
    {
      title: 'Last name (A–Z)',
      name: 'lastNameAsc',
      by: [{ field: 'lastName', direction: 'asc' }],
    },
    {
      title: 'Recently added',
      name: 'createdDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      birthYear: 'birthYear',
      club: 'club',
      media: 'photo',
    },
    prepare({ firstName, lastName, birthYear, club, media }) {
      return {
        title: [lastName, firstName].filter(Boolean).join(' '),
        subtitle: [birthYear, club].filter(Boolean).join(' · '),
        media,
      };
    },
  },
});
