// All GROQ queries live here — never inline GROQ in components/pages.

const newsPreviewFields = `
  _id,
  title,
  "slug": slug.current,
  mainImage,
  category->{ _id, title, "slug": slug.current },
  publishedAt,
  viewCount
`;

export const latestNewsQuery = `
*[_type == "newsArticle" && defined(slug.current)]
  | order(publishedAt desc)[0...6]{ ${newsPreviewFields} }
`;

export const allNewsQuery = `
*[_type == "newsArticle" && defined(slug.current)]
  | order(publishedAt desc){ ${newsPreviewFields} }
`;

export const newsByCategoryQuery = `
*[_type == "newsArticle" && defined(slug.current) && category->slug.current == $category]
  | order(publishedAt desc){ ${newsPreviewFields} }
`;

export const newsArticleBySlugQuery = `
*[_type == "newsArticle" && slug.current == $slug][0]{
  ${newsPreviewFields},
  body
}
`;

export const newsSlugsQuery = `
*[_type == "newsArticle" && defined(slug.current)].slug.current
`;

export const newsCategoriesQuery = `
*[_type == "newsCategory" && defined(slug.current)] | order(title.mn asc){
  _id,
  title,
  "slug": slug.current
}
`;

export const upcomingEventsQuery = `
*[_type == "event" && type == "schedule" && date >= now()] | order(date asc)[0...5]{
  _id, title, date, location, description, type, resultDetails
}
`;

export const allUpcomingEventsQuery = `
*[_type == "event" && type == "schedule" && date >= now()] | order(date asc){
  _id, title, date, location, description, type, resultDetails
}
`;

export const allResultsQuery = `
*[_type == "event" && type == "result"] | order(date desc){
  _id, title, date, location, description, type, resultDetails
}
`;

export const recentResultsQuery = `
*[_type == "event" && type == "result"] | order(date desc)[0...5]{
  _id, title, date, location, description, type, resultDetails
}
`;

export const allEventsQuery = `
*[_type == "event"] | order(date desc){
  _id, title, date, location, description, type, resultDetails
}
`;

export const galleryQuery = `
*[_type == "galleryImage"] | order(coalesce(order, 999) asc, _createdAt desc)[0...12]{
  _id, image, caption, order
}
`;

export const siteSettingsQuery = `
*[_type == "siteSettings"][0]{
  siteName, tagline, logo,
  navigation[]{ label, href, customHref, children[]{ label, href, customHref } },
  phone, emails, address, facebookUrl, instagramUrl, youtubeUrl,
  footerText, footerLinks[]{ label, href, customHref }
}
`;

export const pageContentQuery = `
*[_type == "pageContent"][0]{
  showHero, heroEyebrow, heroTitle, heroSubtitle, heroImage,
  heroPrimaryCta{ label, href, customHref }, heroSecondaryCta{ label, href, customHref },
  aboutTitle, aboutText,
  newsHeading, newsCount, scheduleHeading, resultsHeading,
  showGallery, galleryHeading, galleryCount,
  showRegisterSection, registerHeading,
  newsPageTitle, newsPageLead, newsEmpty, categoryEmpty,
  calendarPageTitle, calendarPageLead, scheduleEmpty,
  resultsPageTitle, resultsPageLead, resultsEmpty,
  registerPageTitle, registerLead,
  clubCardTitle, clubCardText, dancerCardTitle, dancerCardText, registerNote,
  clubFormTitle, clubFormLead, dancerFormTitle, dancerFormLead, formSuccessMessage,
  notFoundTitle, notFoundText
}
`;

/**
 * The single next scheduled competition, for the header's "next up" strip.
 * Derived from the events an admin already maintains — deliberately not a
 * separate field, so nobody has to remember to update it.
 */
export const nextEventQuery = `
*[_type == "event" && type == "schedule" && date >= now()] | order(date asc)[0]{
  _id, title, date, location, type
}
`;
