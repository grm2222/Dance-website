import { defineField, defineType } from 'sanity';
import { EditIcon } from '@sanity/icons';

/**
 * Singleton holding every piece of text that belongs to a specific page:
 * section headings, page intros, empty-state messages, and the registration
 * copy. Site-wide identity (name, logo, menu, contacts, hero, footer) stays in
 * siteSettings — one home per concern.
 *
 * Every field is optional: leaving one blank falls back to the built-in
 * translation in src/lib/ui.ts, so the site is never left with a blank heading.
 */
export const pageContent = defineType({
  name: 'pageContent',
  title: 'Page text',
  type: 'document',
  icon: EditIcon,
  groups: [
    { name: 'homepage', title: 'Homepage', default: true },
    { name: 'news', title: 'News page' },
    { name: 'calendar', title: 'Calendar page' },
    { name: 'register', title: 'Registration' },
    { name: 'errors', title: 'Error page' },
  ],
  fields: [
    // ── Homepage: hero banner ───────────────────────────────
    defineField({
      name: 'showHero',
      title: 'Show the hero banner',
      description: 'The large banner at the top of the homepage. Turn off for a compact homepage that starts with the news.',
      type: 'boolean',
      group: 'homepage',
      initialValue: true,
    }),
    defineField({
      name: 'heroEyebrow',
      title: 'Hero label',
      description: 'Small pill above the big title, e.g. the name of the next big competition.',
      type: 'localeString',
      group: 'homepage',
      hidden: ({ document }) => document?.showHero === false,
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero title',
      description: 'The big headline on the homepage.',
      type: 'localeString',
      group: 'homepage',
      hidden: ({ document }) => document?.showHero === false,
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero subtitle',
      description: 'Also used as the site’s search-engine description when a page has none.',
      type: 'localeText',
      group: 'homepage',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero background photo',
      description:
        'Fills the whole hero behind the text, darkened from the left. ' +
        'Use a wide, landscape photo — a real competition shot works far better than a graphic. ' +
        'Also used as the preview image when the site is shared on social media.',
      type: 'image',
      group: 'homepage',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroPrimaryCta',
      title: 'Hero main button',
      type: 'ctaLink',
      group: 'homepage',
      hidden: ({ document }) => document?.showHero === false,
    }),
    defineField({
      name: 'heroSecondaryCta',
      title: 'Hero second button',
      type: 'ctaLink',
      group: 'homepage',
      hidden: ({ document }) => document?.showHero === false,
    }),

    // ── Homepage: about ─────────────────────────────────────
    defineField({
      name: 'aboutTitle',
      title: 'About section title',
      type: 'localeString',
      group: 'homepage',
    }),
    defineField({
      name: 'aboutText',
      title: 'About section text',
      description: 'Leave blank to hide the about section from the homepage.',
      type: 'localeText',
      group: 'homepage',
    }),

    // ── Homepage: sections ──────────────────────────────────
    defineField({
      name: 'newsHeading',
      title: 'News section heading',
      description: 'Heading above the latest news on the homepage. Leave blank to use the default.',
      type: 'localeString',
      group: 'homepage',
    }),
    defineField({
      name: 'newsCount',
      title: 'How many news items to show',
      description: 'Number of articles on the homepage (1–9). Default is 3.',
      type: 'number',
      group: 'homepage',
      validation: (rule) => rule.integer().min(1).max(9).error('Choose a whole number between 1 and 9'),
    }),
    defineField({
      name: 'scheduleHeading',
      title: 'Schedule section heading',
      type: 'localeString',
      group: 'homepage',
    }),
    defineField({
      name: 'resultsHeading',
      title: 'Results section heading',
      type: 'localeString',
      group: 'homepage',
    }),
    defineField({
      name: 'showGallery',
      title: 'Show the photo section',
      description: 'Turn off to hide photos from the homepage. The section also hides itself when there are no photos.',
      type: 'boolean',
      group: 'homepage',
      initialValue: true,
    }),
    defineField({
      name: 'galleryHeading',
      title: 'Photo section heading',
      type: 'localeString',
      group: 'homepage',
      hidden: ({ document }) => document?.showGallery === false,
    }),
    defineField({
      name: 'galleryCount',
      title: 'How many photos to show',
      description: 'Number of photos on the homepage (4–12). Default is 8.',
      type: 'number',
      group: 'homepage',
      hidden: ({ document }) => document?.showGallery === false,
      validation: (rule) => rule.integer().min(4).max(12).error('Choose a whole number between 4 and 12'),
    }),
    defineField({
      name: 'showRegisterSection',
      title: 'Show the registration section',
      description: 'Turn off to hide the registration cards from the homepage.',
      type: 'boolean',
      group: 'homepage',
      initialValue: true,
    }),
    defineField({
      name: 'registerHeading',
      title: 'Registration section heading',
      type: 'localeString',
      group: 'homepage',
      hidden: ({ document }) => document?.showRegisterSection === false,
    }),

    // ── News page ───────────────────────────────────────────
    defineField({
      name: 'newsPageTitle',
      title: 'News page title',
      type: 'localeString',
      group: 'news',
    }),
    defineField({
      name: 'newsPageLead',
      title: 'News page intro',
      description: 'Short sentence under the news page title.',
      type: 'localeText',
      group: 'news',
    }),
    defineField({
      name: 'newsEmpty',
      title: 'Message when there is no news',
      type: 'localeString',
      group: 'news',
    }),
    defineField({
      name: 'categoryEmpty',
      title: 'Message when a category has no news',
      type: 'localeString',
      group: 'news',
    }),

    // ── Calendar page ───────────────────────────────────────
    defineField({
      name: 'calendarPageTitle',
      title: 'Calendar page title',
      type: 'localeString',
      group: 'calendar',
    }),
    defineField({
      name: 'calendarPageLead',
      title: 'Calendar page intro',
      type: 'localeText',
      group: 'calendar',
    }),
    defineField({
      name: 'scheduleEmpty',
      title: 'Message when nothing is scheduled',
      type: 'localeString',
      group: 'calendar',
    }),
    defineField({
      name: 'resultsEmpty',
      title: 'Message when no results are published',
      type: 'localeString',
      group: 'calendar',
    }),

    // ── Registration ────────────────────────────────────────
    defineField({
      name: 'registerPageTitle',
      title: 'Registration page title',
      type: 'localeString',
      group: 'register',
    }),
    defineField({
      name: 'registerLead',
      title: 'Registration page intro',
      type: 'localeText',
      group: 'register',
    }),
    defineField({
      name: 'clubCardTitle',
      title: 'Club card — title',
      type: 'localeString',
      group: 'register',
    }),
    defineField({
      name: 'clubCardText',
      title: 'Club card — description',
      type: 'localeText',
      group: 'register',
    }),
    defineField({
      name: 'dancerCardTitle',
      title: 'Dancer card — title',
      type: 'localeString',
      group: 'register',
    }),
    defineField({
      name: 'dancerCardText',
      title: 'Dancer card — description',
      type: 'localeText',
      group: 'register',
    }),
    defineField({
      name: 'registerNote',
      title: 'Note under the cards',
      description: 'Sets expectations, e.g. how soon staff reply.',
      type: 'localeText',
      group: 'register',
    }),
    defineField({
      name: 'clubFormTitle',
      title: 'Club form — page title',
      type: 'localeString',
      group: 'register',
    }),
    defineField({
      name: 'clubFormLead',
      title: 'Club form — intro',
      type: 'localeText',
      group: 'register',
    }),
    defineField({
      name: 'dancerFormTitle',
      title: 'Dancer form — page title',
      type: 'localeString',
      group: 'register',
    }),
    defineField({
      name: 'dancerFormLead',
      title: 'Dancer form — intro',
      type: 'localeText',
      group: 'register',
    }),
    defineField({
      name: 'formSuccessMessage',
      title: 'Thank-you message after sending a form',
      description: 'Shown once a request has been submitted successfully.',
      type: 'localeText',
      group: 'register',
    }),

    // ── Error page ──────────────────────────────────────────
    defineField({
      name: 'notFoundTitle',
      title: '404 page title',
      description: 'Shown when a visitor opens an address that does not exist.',
      type: 'localeString',
      group: 'errors',
    }),
    defineField({
      name: 'notFoundText',
      title: '404 page message',
      type: 'localeText',
      group: 'errors',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Page text' };
    },
  },
});
