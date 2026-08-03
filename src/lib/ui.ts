import type { Lang } from './i18n';

/**
 * Interface strings — labels the CMS does not own (buttons, empty states,
 * aria-labels, form fields). Editorial content lives in Sanity as `{ mn, en }`
 * and is read with `t()` from ./format instead.
 *
 * Adding a key to `mn` makes it required in `en` — the type below enforces
 * that, so a half-translated interface fails the build rather than shipping.
 */
const mn = {
  // ── chrome ────────────────────────────────────────────────
  mainMenu: 'Үндсэн цэс',
  openMenu: 'Цэс нээх',
  closeMenu: 'Цэс хаах',
  breadcrumb: 'Замын мөр',
  home: 'Нүүр',
  skipToContent: 'Агуулга руу шилжих',
  selectLanguage: 'Хэл сонгох',
  nextCompetition: 'Дараагийн тэмцээн',
  days: 'хоног',

  // ── default navigation (used until an admin sets a menu in Sanity) ──
  navNews: 'Мэдээ',
  navCalendar: 'Хуанли',
  navRegister: 'Бүртгэл',
  navRegisterClub: 'Клуб бүртгүүлэх',
  navRegisterDancer: 'Тамирчин бүртгүүлэх',

  // ── shared ────────────────────────────────────────────────
  viewAll: 'Бүгдийг үзэх →',
  siteNameFallback: 'Монголын Бүжгийн Спортын Холбоо',

  // ── home ──────────────────────────────────────────────────
  latestNews: 'Сүүлийн мэдээ',
  schedule: 'Тэмцээний хуваарь',
  results: 'Тэмцээний дүн',
  gallery: 'Гэрэл зураг',
  aboutUs: 'Холбооны тухай',
  registration: 'Бүртгэл',
  competitionInfo: 'Тэмцээний мэдээлэл',
  heroTitleFallback: 'Монголын бүжгийн спортын албан ёсны холбоо',
  heroSubtitleFallback:
    'Тэмцээний хуваарь, дүн, мэдээ мэдээлэл, клуб болон тамирчны бүртгэл — нэг дороос.',
  heroPrimaryFallback: 'Бүртгүүлэх',
  heroSecondaryFallback: 'Хуанли үзэх',

  // ── news ──────────────────────────────────────────────────
  newsTitle: 'Мэдээ мэдээлэл',
  newsCategories: 'Мэдээний ангилал',
  allCategories: 'Бүгд',
  noNews: 'Одоогоор мэдээ алга байна.',
  noNewsInCategory: 'Энэ ангилалд мэдээ алга байна.',
  backToNews: '← Бүх мэдээ рүү буцах',
  newsImagePlaceholder: 'Мэдээ',

  // ── calendar ──────────────────────────────────────────────
  calendarTitle: 'Тэмцээний хуанли',
  calendarLead: 'Товлогдсон тэмцээний хуваарь болон гарсан дүн.',
  noUpcoming: 'Одоогоор товлогдсон тэмцээн алга байна.',
  noResults: 'Одоогоор үр дүн ороогүй байна.',
  statusScheduled: 'Хуваарь',
  statusToday: 'Өнөөдөр',
  viewResults: 'Дүн үзэх →',

  // ── registration ──────────────────────────────────────────
  registerLead: 'Холбоонд бүртгүүлэх төрлөө сонгоно уу.',
  clubCardTitle: 'Клуб бүртгүүлэх',
  clubCardTextFallback:
    'Бүжгийн клуб, сургалтын төвүүд холбооны гишүүнээр элсэх хүсэлт гаргана.',
  dancerCardTitle: 'Тамирчин бүртгүүлэх',
  dancerCardTextFallback: 'Тамирчид тэмцээнд оролцох, зэрэг ахиулах бүртгэлээ хийлгэнэ.',
  submitRequest: 'Хүсэлт илгээх →',
  registerNoteFallback:
    'Хүсэлтийг холбооны ажилтан хянаад богино хугацаанд хариу өгнө.',
  clubFormTitle: 'Байгууллага, клубын бүртгэл',
  clubFormLead:
    'Холбоонд гишүүнээр элсэх хүсэлтэй байгууллага, клубууд доорх маягтыг бөглөж илгээнэ үү.',
  dancerFormTitle: 'Бүжигчний бүртгэл',
  dancerFormLead: 'Холбоонд тамирчин, бүжигчнээр бүртгүүлэх хүсэлтээ доорх маягтаар илгээнэ үү.',

  // ── form fields ───────────────────────────────────────────
  fieldOrgName: 'Байгууллага / клубын нэр',
  fieldAbout: 'Танилцуулга',
  fieldAboutPlaceholder: 'Үйл ажиллагааныхаа талаар товч бичнэ үү',
  fieldAddress: 'Хаяг',
  fieldPhone: 'Утасны дугаар',
  fieldEmail: 'Имэйл хаяг',
  fieldLastName: 'Овог',
  fieldFirstName: 'Нэр',
  fieldBirthDate: 'Төрсөн огноо',
  fieldGender: 'Хүйс',
  genderMale: 'Эрэгтэй',
  genderFemale: 'Эмэгтэй',
  fieldClub: 'Харьяалагдах клуб',
  fieldClubPlaceholder: 'Хэрэв клубт харьяалагддаг бол нэрийг нь бичнэ үү',
  fieldWebsite: 'Вэбсайт',
  submitForm: 'Хүсэлт илгээх',
  formOk: 'Таны хүсэлтийг хүлээн авлаа. Бид тантай удахгүй холбогдох болно.',
  formError: 'Алдаа гарлаа. Дахин оролдоно уу.',
  formNetworkError: 'Сүлжээний алдаа гарлаа. Дахин оролдоно уу.',

  // ── footer ────────────────────────────────────────────────
  footerLinks: 'Холбоос',
  footerFollow: 'Биднийг дагаарай',
  rightsReserved: 'Бүх эрх хуулиар хамгаалагдсан.',

  // ── 404 ───────────────────────────────────────────────────
  notFoundTitle: 'Хуудас олдсонгүй',
  notFoundText:
    'Таны хайсан хуудас устгагдсан, нэр нь өөрчлөгдсөн эсвэл түр хугацаанд ашиглах боломжгүй байж магадгүй.',
  notFoundHome: 'Нүүр хуудас руу буцах',
  notFoundNews: 'Мэдээ үзэх',

  // ── meta ──────────────────────────────────────────────────
  metaDescriptionFallback: 'Монголын бүжгийн спортын холбооны албан ёсны сайт',
} as const;

/** Every key in `mn` must exist in `en` — a missing one is a build error. */
type Strings = Record<keyof typeof mn, string>;

const en: Strings = {
  mainMenu: 'Main menu',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  breadcrumb: 'Breadcrumb',
  home: 'Home',
  skipToContent: 'Skip to content',
  selectLanguage: 'Select language',
  nextCompetition: 'Next competition',
  days: 'days',

  navNews: 'News',
  navCalendar: 'Calendar',
  navRegister: 'Register',
  navRegisterClub: 'Register a club',
  navRegisterDancer: 'Register a dancer',

  viewAll: 'View all →',
  siteNameFallback: 'Mongolian DanceSport Federation',

  latestNews: 'Latest news',
  schedule: 'Upcoming competitions',
  results: 'Results',
  gallery: 'Gallery',
  aboutUs: 'About us',
  registration: 'Registration',
  competitionInfo: 'Competition information',
  heroTitleFallback: 'The official DanceSport federation of Mongolia',
  heroSubtitleFallback:
    'Competition schedules, results, news, and club and dancer registration — all in one place.',
  heroPrimaryFallback: 'Register now',
  heroSecondaryFallback: 'View calendar',

  newsTitle: 'News',
  newsCategories: 'News categories',
  allCategories: 'All',
  noNews: 'There is no news yet.',
  noNewsInCategory: 'There is no news in this category yet.',
  backToNews: '← Back to all news',
  newsImagePlaceholder: 'News',

  calendarTitle: 'Competition calendar',
  calendarLead: 'Scheduled competitions and published results.',
  noUpcoming: 'No competitions are scheduled yet.',
  noResults: 'No results have been published yet.',
  statusScheduled: 'Scheduled',
  statusToday: 'Today',
  viewResults: 'Results →',

  registerLead: 'Choose how you would like to register with the federation.',
  clubCardTitle: 'Register a club',
  clubCardTextFallback:
    'Dance clubs and training centres apply for federation membership.',
  dancerCardTitle: 'Register a dancer',
  dancerCardTextFallback: 'Dancers register to compete and to advance their grade.',
  submitRequest: 'Submit request →',
  registerNoteFallback: 'Federation staff review each request and reply shortly.',
  clubFormTitle: 'Club and organisation registration',
  clubFormLead:
    'Organisations and clubs wishing to join the federation should complete the form below.',
  dancerFormTitle: 'Dancer registration',
  dancerFormLead: 'Send your request to register as a dancer using the form below.',

  fieldOrgName: 'Organisation / club name',
  fieldAbout: 'About',
  fieldAboutPlaceholder: 'Briefly describe your activities',
  fieldAddress: 'Address',
  fieldPhone: 'Phone number',
  fieldEmail: 'Email address',
  fieldLastName: 'Surname',
  fieldFirstName: 'First name',
  fieldBirthDate: 'Date of birth',
  fieldGender: 'Gender',
  genderMale: 'Male',
  genderFemale: 'Female',
  fieldClub: 'Club',
  fieldClubPlaceholder: 'If you belong to a club, enter its name',
  fieldWebsite: 'Website',
  submitForm: 'Send request',
  formOk: 'We have received your request and will be in touch shortly.',
  formError: 'Something went wrong. Please try again.',
  formNetworkError: 'A network error occurred. Please try again.',

  footerLinks: 'Links',
  footerFollow: 'Follow us',
  rightsReserved: 'All rights reserved.',

  notFoundTitle: 'Page not found',
  notFoundText:
    'The page you are looking for may have been removed, renamed, or is temporarily unavailable.',
  notFoundHome: 'Back to the homepage',
  notFoundNews: 'Browse news',

  metaDescriptionFallback: 'Official website of the Mongolian DanceSport Federation',
};

const STRINGS: Record<Lang, Strings> = { mn, en };

/** `ui('viewAll', lang)` → the interface string for that language. */
export function ui(key: keyof typeof mn, lang: Lang): string {
  return STRINGS[lang][key];
}

/** Bound lookup, so a component can do `const s = strings(lang); s.viewAll`. */
export function strings(lang: Lang): Strings {
  return STRINGS[lang];
}
