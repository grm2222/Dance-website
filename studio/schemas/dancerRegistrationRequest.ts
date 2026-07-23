import { defineField, defineType } from 'sanity';
import { UserIcon } from '@sanity/icons';

// Created only via the website's /api/register-dancer endpoint.
// Hidden from the "new document" menu (see sanity.config.ts) but listable.
export const dancerRegistrationRequest = defineType({
  name: 'dancerRegistrationRequest',
  title: 'Dancer registration request',
  type: 'document',
  icon: UserIcon,
  readOnly: ({ document }) => document?.status === 'reviewed',
  fields: [
    defineField({
      name: 'lastName',
      title: 'Last name',
      type: 'string',
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'firstName',
      title: 'First name',
      type: 'string',
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'birthDate',
      title: 'Birth date',
      type: 'date',
      readOnly: true,
    }),
    defineField({
      name: 'gender',
      title: 'Gender',
      type: 'string',
      readOnly: true,
      options: {
        list: [
          { title: 'Male', value: 'male' },
          { title: 'Female', value: 'female' },
        ],
      },
    }),
    defineField({
      name: 'club',
      title: 'Club',
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
      description: 'Set to "Reviewed" once processed. Reviewed requests become read-only.',
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
    select: { lastName: 'lastName', firstName: 'firstName', status: 'status', submittedAt: 'submittedAt', club: 'club' },
    prepare({ lastName, firstName, status, submittedAt, club }) {
      const day = submittedAt ? new Date(submittedAt).toLocaleDateString('en-CA') : '';
      return {
        title: [lastName, firstName].filter(Boolean).join(' '),
        subtitle: [status === 'new' ? 'NEW' : 'Reviewed', day, club].filter(Boolean).join(' · '),
      };
    },
  },
});
