export const browserStorage = {
  consent: "dexta-africa-consent",
  newsletter: "dexta-africa-newsletter",
  // Set once the visitor has interacted with the chat widget — suppresses the
  // one-time attention pulse on later visits.
  chat: "dexta-africa-chat",
} as const;

export const browserEvents = {
  consentChanged: "dexta-consent-change",
  openCookieSettings: "dexta-open-cookie-settings",
  openNewsletter: "dexta-open-newsletter",
  // Lets any CTA open the chat panel (window.dispatchEvent(new Event(...))).
  openChat: "dexta-open-chat",
} as const;
