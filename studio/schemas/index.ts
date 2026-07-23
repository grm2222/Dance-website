import { localeBlockContent, localeString, localeText } from './locale';
import { newsArticle } from './newsArticle';
import { newsCategory } from './newsCategory';
import { event } from './event';
import { galleryImage } from './galleryImage';
import { siteSettings } from './siteSettings';
import { registrationRequest } from './registrationRequest';
import { dancerRegistrationRequest } from './dancerRegistrationRequest';

export const schemaTypes = [
  // objects
  localeString,
  localeText,
  localeBlockContent,
  // documents
  newsArticle,
  newsCategory,
  event,
  galleryImage,
  siteSettings,
  registrationRequest,
  dancerRegistrationRequest,
];
