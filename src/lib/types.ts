// Shared types for Sanity content.
// Keep in sync with studio/schemas/* (see CLAUDE.md workflow notes).

/** Field-level localization: Mongolian is primary, English optional for later. */
export interface LocaleString {
  mn: string;
  en?: string;
}

export interface LocaleText {
  mn: string;
  en?: string;
}

/** Minimal portable text block shape; rendered with @portabletext/to-html. */
export interface PortableTextBlock {
  _type: string;
  _key: string;
  [key: string]: unknown;
}

export interface LocaleBlockContent {
  mn: PortableTextBlock[];
  en?: PortableTextBlock[];
}

export interface SanityImage {
  _type: 'image';
  asset: {
    _type: 'reference';
    _ref: string;
  };
  alt?: string;
}

export interface NewsCategory {
  _id: string;
  title: LocaleString;
  slug: string;
}

export interface NewsArticle {
  _id: string;
  title: LocaleString;
  slug: string;
  mainImage?: SanityImage;
  category?: NewsCategory;
  publishedAt: string;
  body?: LocaleBlockContent;
  viewCount?: number;
}

/** Card-sized projection used on list pages (no body). */
export type NewsArticlePreview = Omit<NewsArticle, 'body'>;

export type EventType = 'schedule' | 'result';

export interface DanceEvent {
  _id: string;
  title: LocaleString;
  date: string;
  location?: LocaleString;
  description?: LocaleText;
  type: EventType;
  resultDetails?: LocaleText;
}

export interface GalleryImage {
  _id: string;
  image: SanityImage;
  caption?: LocaleString;
  order?: number;
}

/** A link with a label — used for buttons and footer links. */
export interface CtaLink {
  label: LocaleString;
  /** Page picked from the dropdown in the Studio. */
  href?: string;
  /** Free-form path or external URL; takes precedence over `href`. */
  customHref?: string;
}

/** Header menu entry; `children` renders as a dropdown. */
export interface NavItem extends CtaLink {
  children?: CtaLink[];
}

export interface SiteSettings {
  siteName?: LocaleString;
  tagline?: LocaleString;
  logo?: SanityImage;

  navigation?: NavItem[];

  phone?: string;
  emails?: string[];
  address?: LocaleText;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;

  footerText?: LocaleText;
  footerLinks?: CtaLink[];
}

/**
 * Page-specific copy. Every field is optional — a blank one falls back to the
 * built-in translation in lib/ui.ts, so the site never renders an empty
 * heading. Keep in sync with studio/schemas/pageContent.ts.
 */
export interface PageContent {
  showHero?: boolean;
  heroEyebrow?: LocaleString;
  heroTitle?: LocaleString;
  heroSubtitle?: LocaleText;
  heroImage?: SanityImage;
  heroPrimaryCta?: CtaLink;
  heroSecondaryCta?: CtaLink;
  aboutTitle?: LocaleString;
  aboutText?: LocaleText;

  newsHeading?: LocaleString;
  newsCount?: number;
  scheduleHeading?: LocaleString;
  resultsHeading?: LocaleString;
  showGallery?: boolean;
  galleryHeading?: LocaleString;
  galleryCount?: number;
  showRegisterSection?: boolean;
  registerHeading?: LocaleString;

  newsPageTitle?: LocaleString;
  newsPageLead?: LocaleText;
  newsEmpty?: LocaleString;
  categoryEmpty?: LocaleString;

  calendarPageTitle?: LocaleString;
  calendarPageLead?: LocaleText;
  scheduleEmpty?: LocaleString;

  resultsPageTitle?: LocaleString;
  resultsPageLead?: LocaleText;
  resultsEmpty?: LocaleString;

  registerPageTitle?: LocaleString;
  registerLead?: LocaleText;
  clubCardTitle?: LocaleString;
  clubCardText?: LocaleText;
  dancerCardTitle?: LocaleString;
  dancerCardText?: LocaleText;
  registerNote?: LocaleText;
  clubFormTitle?: LocaleString;
  clubFormLead?: LocaleText;
  dancerFormTitle?: LocaleString;
  dancerFormLead?: LocaleText;
  formSuccessMessage?: LocaleText;

  notFoundTitle?: LocaleString;
  notFoundText?: LocaleText;
}

export interface RegistrationRequestInput {
  orgName: string;
  about: string;
  address: string;
  phone: string;
  email: string;
}

export interface DancerRegistrationInput {
  lastName: string;
  firstName: string;
  birthDate: string;
  gender: 'male' | 'female';
  club?: string;
  phone: string;
  email: string;
}
