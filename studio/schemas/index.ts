import { localeBlockContent, localeString, localeText } from './locale';
import { ctaLink, navChild, navItem } from './navItem';
import { newsArticle } from './newsArticle';
import { newsCategory } from './newsCategory';
import { event } from './event';
import { galleryImage } from './galleryImage';
import { siteSettings } from './siteSettings';
import { pageContent } from './pageContent';
import { registrationRequest } from './registrationRequest';
import { dancerRegistrationRequest } from './dancerRegistrationRequest';

export const schemaTypes = [
  // objects
  localeString,
  localeText,
  localeBlockContent,
  ctaLink,
  navChild,
  navItem,
  // documents
  newsArticle,
  newsCategory,
  event,
  galleryImage,
  siteSettings,
  pageContent,
  registrationRequest,
  dancerRegistrationRequest,
];
