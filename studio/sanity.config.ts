import { buildLegacyTheme, defineConfig, type DocumentBadgeProps } from 'sanity';
import { structureTool, type StructureResolver } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import {
  CalendarIcon,
  CheckmarkCircleIcon,
  CogIcon,
  DocumentTextIcon,
  EditIcon,
  EnvelopeIcon,
  ImagesIcon,
  SparkleIcon,
  TagIcon,
  TranslateIcon,
  UserIcon,
} from '@sanity/icons';
import { schemaTypes } from './schemas';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? 'unconfigured';
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production';
const apiVersion = '2026-06-01';

// siteSettings is a singleton; registrationRequest is created only via the
// website form — both are kept out of the "new document" menu.
const HIDDEN_FROM_CREATE = [
  'siteSettings',
  'pageContent',
  'registrationRequest',
  'dancerRegistrationRequest',
];

// Federation colors, matching the website (see src/styles/global.css).
// accent-700 (#0b6ea8), not the decorative accent-500 — Studio puts white text
// on these fills, and #4db2ec is only 2.36:1 against white.
const theme = buildLegacyTheme({
  '--brand-primary': '#0b6ea8',
  '--default-button-primary-color': '#0b6ea8',
  '--main-navigation-color': '#000000',
  '--main-navigation-color--inverted': '#ffffff',
  '--focus-color': '#0b6ea8',
});

const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.listItem()
        .title('Page text')
        .id('pageContent')
        .icon(EditIcon)
        .child(S.document().schemaType('pageContent').documentId('pageContent')),
      S.divider(),

      S.listItem()
        .title('News')
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title('News')
            .items([
              S.listItem()
                .title('All articles')
                .icon(DocumentTextIcon)
                .child(
                  S.documentTypeList('newsArticle')
                    .title('All articles')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
                ),
              S.listItem()
                .title('By category')
                .icon(TagIcon)
                .child(
                  S.documentTypeList('newsCategory')
                    .title('Pick a category')
                    .child((categoryId) =>
                      S.documentList()
                        .title('Articles')
                        .apiVersion(apiVersion)
                        .filter('_type == "newsArticle" && category._ref == $categoryId')
                        .params({ categoryId })
                        .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
                    ),
                ),
              S.divider(),
              S.documentTypeListItem('newsCategory').title('Categories').icon(TagIcon),
            ]),
        ),

      S.listItem()
        .title('Events')
        .icon(CalendarIcon)
        .child(
          S.list()
            .title('Events')
            .items([
              S.listItem()
                .title('Schedule (upcoming first)')
                .icon(CalendarIcon)
                .child(
                  S.documentList()
                    .title('Schedule')
                    .apiVersion(apiVersion)
                    .filter('_type == "event" && type == "schedule"')
                    .defaultOrdering([{ field: 'date', direction: 'asc' }])
                    .initialValueTemplates([S.initialValueTemplateItem('event-schedule')])
                    .canHandleIntent(S.documentTypeList('event').getCanHandleIntent()),
                ),
              S.listItem()
                .title('Results (newest first)')
                .icon(SparkleIcon)
                .child(
                  S.documentList()
                    .title('Results')
                    .apiVersion(apiVersion)
                    .filter('_type == "event" && type == "result"')
                    .defaultOrdering([{ field: 'date', direction: 'desc' }])
                    .initialValueTemplates([S.initialValueTemplateItem('event-result')])
                    .canHandleIntent(S.documentTypeList('event').getCanHandleIntent()),
                ),
              S.divider(),
              S.listItem()
                .title('All events')
                .icon(CalendarIcon)
                .child(
                  S.documentTypeList('event')
                    .title('All events')
                    .defaultOrdering([{ field: 'date', direction: 'desc' }]),
                ),
            ]),
        ),

      S.listItem()
        .title('Gallery')
        .icon(ImagesIcon)
        .child(
          S.documentTypeList('galleryImage')
            .title('Gallery')
            .defaultOrdering([{ field: 'order', direction: 'asc' }]),
        ),

      // Everything on the site is bilingual, but the English value is optional —
      // the /en pages fall back to Mongolian when it is empty. These lists show
      // exactly what is still untranslated so nobody has to hunt for it.
      S.listItem()
        .title('Needs English translation')
        .icon(TranslateIcon)
        .child(
          S.list()
            .title('Needs English translation')
            .items([
              S.listItem()
                .title('News articles')
                .icon(DocumentTextIcon)
                .child(
                  S.documentList()
                    .title('Articles without English')
                    .apiVersion(apiVersion)
                    .filter('_type == "newsArticle" && (!defined(title.en) || !defined(body.en))')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
                ),
              S.listItem()
                .title('Events')
                .icon(CalendarIcon)
                .child(
                  S.documentList()
                    .title('Events without English')
                    .apiVersion(apiVersion)
                    .filter('_type == "event" && !defined(title.en)')
                    .defaultOrdering([{ field: 'date', direction: 'desc' }]),
                ),
              S.listItem()
                .title('News categories')
                .icon(TagIcon)
                .child(
                  S.documentList()
                    .title('Categories without English')
                    .apiVersion(apiVersion)
                    .filter('_type == "newsCategory" && !defined(title.en)'),
                ),
              S.listItem()
                .title('Gallery captions')
                .icon(ImagesIcon)
                .child(
                  S.documentList()
                    .title('Captions without English')
                    .apiVersion(apiVersion)
                    .filter('_type == "galleryImage" && defined(caption) && !defined(caption.en)'),
                ),
            ]),
        ),
      S.divider(),

      S.listItem()
        .title('Club registrations')
        .icon(EnvelopeIcon)
        .child(
          S.list()
            .title('Club registrations')
            .items([
              S.listItem()
                .title('New — needs review')
                .icon(EnvelopeIcon)
                .child(
                  S.documentList()
                    .title('New club requests')
                    .apiVersion(apiVersion)
                    .filter('_type == "registrationRequest" && status == "new"')
                    .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }]),
                ),
              S.listItem()
                .title('Reviewed')
                .icon(CheckmarkCircleIcon)
                .child(
                  S.documentList()
                    .title('Reviewed club requests')
                    .apiVersion(apiVersion)
                    .filter('_type == "registrationRequest" && status == "reviewed"')
                    .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }]),
                ),
              S.divider(),
              S.listItem()
                .title('All club requests')
                .icon(EnvelopeIcon)
                .child(
                  S.documentTypeList('registrationRequest')
                    .title('All club requests')
                    .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }]),
                ),
            ]),
        ),
      S.listItem()
        .title('Dancer registrations')
        .icon(UserIcon)
        .child(
          S.list()
            .title('Dancer registrations')
            .items([
              S.listItem()
                .title('New — needs review')
                .icon(UserIcon)
                .child(
                  S.documentList()
                    .title('New dancer requests')
                    .apiVersion(apiVersion)
                    .filter('_type == "dancerRegistrationRequest" && status == "new"')
                    .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }]),
                ),
              S.listItem()
                .title('Reviewed')
                .icon(CheckmarkCircleIcon)
                .child(
                  S.documentList()
                    .title('Reviewed dancer requests')
                    .apiVersion(apiVersion)
                    .filter('_type == "dancerRegistrationRequest" && status == "reviewed"')
                    .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }]),
                ),
              S.divider(),
              S.listItem()
                .title('All dancer requests')
                .icon(UserIcon)
                .child(
                  S.documentTypeList('dancerRegistrationRequest')
                    .title('All dancer requests')
                    .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }]),
                ),
            ]),
        ),
    ]);

export default defineConfig({
  name: 'default',
  title: 'Dancesport MN — Admin',
  projectId,
  dataset,
  theme,
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev,
      {
        id: 'event-schedule',
        title: 'Scheduled competition',
        schemaType: 'event',
        value: { type: 'schedule' },
      },
      {
        id: 'event-result',
        title: 'Competition result',
        schemaType: 'event',
        value: { type: 'result' },
      },
    ],
  },
  document: {
    newDocumentOptions: (prev) =>
      prev.filter((item) => !HIDDEN_FROM_CREATE.includes(item.templateId)),
    badges: (prev, context) => {
      if (context.schemaType === 'registrationRequest' || context.schemaType === 'dancerRegistrationRequest') {
        return [
          ...prev,
          (props: DocumentBadgeProps) => {
            const doc = (props.draft ?? props.published) as { status?: string } | null;
            const status = doc?.status;
            if (status === 'new') return { label: 'Needs review', color: 'warning' as const };
            if (status === 'reviewed') return { label: 'Reviewed', color: 'success' as const };
            return null;
          },
        ];
      }
      return prev;
    },
  },
});
