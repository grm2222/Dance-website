import { defineField, defineType } from 'sanity';
import { EnvelopeIcon } from '@sanity/icons';

// Created only via the website's /api/register endpoint.
// Hidden from the "new document" menu (see sanity.config.ts) but listable.
export const registrationRequest = defineType({
  name: 'registrationRequest',
  title: 'Registration request',
  type: 'document',
  icon: EnvelopeIcon,
  readOnly: ({ document }) => document?.status === 'reviewed',
  fields: [
    defineField({
      name: 'orgName',
      title: 'Organization name',
      type: 'string',
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'about',
      title: 'About',
      type: 'text',
      readOnly: true,
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted at',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      description: 'Set to "Reviewed" once you have contacted the organization. Reviewed requests become read-only.',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Reviewed', value: 'reviewed' },
        ],
        layout: 'radio',
      },
      initialValue: 'new',
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Submitted date (newest first)',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'orgName', status: 'status', submittedAt: 'submittedAt', email: 'email' },
    prepare({ title, status, submittedAt, email }) {
      const day = submittedAt ? new Date(submittedAt).toLocaleDateString('en-CA') : '';
      return {
        title,
        subtitle: [status === 'new' ? 'NEW' : 'Reviewed', day, email].filter(Boolean).join(' · '),
      };
    },
  },
});
