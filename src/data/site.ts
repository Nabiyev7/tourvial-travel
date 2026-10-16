/**
 * Site-wide details.
 *
 * Everything marked PLACEHOLDER comes from the design prototype and must be
 * replaced with real business details before launch (see README).
 */
export const SITE = {
  name: "Karvon",
  /** PLACEHOLDER */
  phone: "+998 71 200 00 00",
  /** PLACEHOLDER — digits only, for the tel: href. */
  phoneHref: "tel:+998712000000",
  /** PLACEHOLDER */
  address: "Toshkent, Amir Temur ko'chasi",
  /** PLACEHOLDER — point this at the real Karvon Telegram account. */
  telegram: "https://t.me/",
  /** PLACEHOLDER — years in business, used in the About heading. */
  yearsInBusiness: 15,
} as const;

export const NAV_LINKS = [
  { id: "yonalish", label: "Yo'nalishlar" },
  { id: "paketlar", label: "Paketlar" },
  { id: "tajriba", label: "Tajribalar" },
  { id: "biz", label: "Biz haqimizda" },
  { id: "aloqa", label: "Aloqa" },
] as const;

export const MONTHS = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "Iyun",
  "Iyul",
  "Avgust",
  "Sentabr",
  "Oktabr",
  "Noyabr",
  "Dekabr",
] as const;

/** Monday first, matching the prototype calendar. */
export const WEEKDAYS = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"] as const;

export const GUEST_OPTIONS = [
  { value: "1", label: "1 kishi" },
  { value: "2", label: "2 kishi" },
  { value: "4", label: "3–4 kishi" },
  { value: "6", label: "5–6 kishi" },
] as const;

export type GuestValue = (typeof GUEST_OPTIONS)[number]["value"];

/** How many months the date picker spans, starting from the current month. */
export const CALENDAR_MONTHS = 13;
