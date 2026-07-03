import { defineField, defineType } from 'sanity';
import { CalendarIcon, SparkleIcon } from '@sanity/icons';

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      description: 'Upcoming "Schedule" events appear on the homepage automatically.',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'localeString',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'localeText',
    }),
    defineField({
      name: 'type',
      title: 'Type',
      description: '"Schedule" = upcoming competition. "Result" = finished, with placings.',
      type: 'string',
      options: {
        list: [
          { title: 'Schedule', value: 'schedule' },
          { title: 'Result', value: 'result' },
        ],
        layout: 'radio',
      },
      initialValue: 'schedule',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'resultDetails',
      title: 'Result details',
      description: 'Placings and winners. Each line is shown separately on the website.',
      type: 'localeText',
      hidden: ({ parent }) => parent?.type !== 'result',
    }),
  ],
  orderings: [
    {
      title: 'Date (newest first)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title.mn', date: 'date', location: 'location.mn', type: 'type' },
    prepare({ title, date, location, type }) {
      const day = date ? new Date(date).toLocaleDateString('en-CA') : 'no date';
      return {
        title,
        subtitle: [day, location].filter(Boolean).join(' · '),
        media: type === 'result' ? SparkleIcon : CalendarIcon,
      };
    },
  },
});
