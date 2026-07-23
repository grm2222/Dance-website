import { buildLegacyTheme, defineConfig, type DocumentBadgeProps } from 'sanity';
import { structureTool, type StructureResolver } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import {
  CalendarIcon,
  CheckmarkCircleIcon,
  CogIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  ImagesIcon,
  SparkleIcon,
  TagIcon,
  UserIcon,
} from '@sanity/icons';
import { schemaTypes } from './schemas';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? 'unconfigured';
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production';
const apiVersion = '2026-06-01';

// siteSettings is a singleton; registrationRequest is created only via the
// website form — both are kept out of the "new document" menu.
const HIDDEN_FROM_CREATE = ['siteSettings', 'registrationRequest', 'dancerRegistrationRequest'];

// Federation colors, matching the website (see src/styles/global.css)
const theme = buildLegacyTheme({
  '--brand-primary': '#eb0029',
  '--default-button-primary-color': '#eb0029',
  '--main-navigation-color': '#242936',
  '--main-navigation-color--inverted': '#ffffff',
  '--focus-color': '#eb0029',
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
                    .canHandleIntent(S.documentTypeList('event').getCanHandleIntent()),
                ),
              S.divider(),
              S.documentTypeListItem('event').title('All events'),
            ]),
        ),

      S.documentTypeListItem('galleryImage').title('Gallery').icon(ImagesIcon),
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
                    .title('New requests')
                    .apiVersion(apiVersion)
                    .filter('_type == "registrationRequest" && status == "new"')
                    .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }]),
                ),
              S.listItem()
                .title('Reviewed')
                .icon(CheckmarkCircleIcon)
                .child(
                  S.documentList()
                    .title('Reviewed requests')
                    .apiVersion(apiVersion)
                    .filter('_type == "registrationRequest" && status == "reviewed"')
                    .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }]),
                ),
              S.divider(),
              S.documentTypeListItem('registrationRequest').title('All requests'),
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
                    .title('New requests')
                    .apiVersion(apiVersion)
                    .filter('_type == "dancerRegistrationRequest" && status == "new"')
                    .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }]),
                ),
              S.listItem()
                .title('Reviewed')
                .icon(CheckmarkCircleIcon)
                .child(
                  S.documentList()
                    .title('Reviewed requests')
                    .apiVersion(apiVersion)
                    .filter('_type == "dancerRegistrationRequest" && status == "reviewed"')
                    .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }]),
                ),
              S.divider(),
              S.documentTypeListItem('dancerRegistrationRequest').title('All requests'),
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
