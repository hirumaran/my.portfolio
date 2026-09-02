import { useSyncExternalStore } from 'react';

/**
 * Site-wide display mode.
 *
 * `preference` is what the visitor chose; `theme` is the light/dark result
 * currently painted on the document. Keeping both on <html> lets CSS render
 * the correct first frame while React and the terminal read the same state.
 */
export type SiteTheme = 'light' | 'dark';
export type SiteThemePreference = 'system' | SiteTheme;

export const SITE_THEME_STORAGE_KEY = 'td-site-theme';
export const SITE_THEME_ATTRIBUTE = 'data-site-theme';
export const SITE_THEME_PREFERENCE_ATTRIBUTE = 'data-site-theme-preference';

export const DARK_PAPER_HEX = '#0f0f0e';
export const DARK_INK_HEX = '#ededea';

const LIGHT_PAPER_HEX = '#ffffff';
const CHANGE_EVENT = 'td-site-theme:change';
const DARK_MEDIA = '(prefers-color-scheme: dark)';
const PREFERENCES = new Set<SiteThemePreference>(['system', 'light', 'dark']);

let systemListenerAttached = false;

function isPreference(value: string | null): value is SiteThemePreference {
  return value !== null && PREFERENCES.has(value as SiteThemePreference);
}

function resolvePreference(preference: SiteThemePreference): SiteTheme {
  if (preference !== 'system') return preference;
  return window.matchMedia(DARK_MEDIA).matches ? 'dark' : 'light';
}

function syncThemeColor(theme: SiteTheme): void {
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', theme === 'dark' ? DARK_PAPER_HEX : LIGHT_PAPER_HEX);
}

function paintPreference(
  preference: SiteThemePreference,
  notify = true,
): SiteTheme {
  const theme = resolvePreference(preference);
  const root = document.documentElement;
  root.setAttribute(SITE_THEME_PREFERENCE_ATTRIBUTE, preference);
  root.setAttribute(SITE_THEME_ATTRIBUTE, theme);
  syncThemeColor(theme);
  if (notify) window.dispatchEvent(new Event(CHANGE_EVENT));
  return theme;
}

function ensureSystemListener(): void {
  if (systemListenerAttached || typeof window === 'undefined') return;
  systemListenerAttached = true;
  window.matchMedia(DARK_MEDIA).addEventListener('change', () => {
    if (getSiteThemePreference() === 'system') paintPreference('system');
  });
}

export function getSiteThemePreference(): SiteThemePreference {
  if (typeof document === 'undefined') return 'system';
  const value = document.documentElement.getAttribute(
    SITE_THEME_PREFERENCE_ATTRIBUTE,
  );
  return isPreference(value) ? value : 'system';
}

export function getSiteTheme(): SiteTheme {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.getAttribute(SITE_THEME_ATTRIBUTE) === 'dark'
    ? 'dark'
    : 'light';
}

export function setSiteThemePreference(
  preference: SiteThemePreference,
): SiteTheme {
  try {
    localStorage.setItem(SITE_THEME_STORAGE_KEY, preference);
  } catch {
    // Storage can be unavailable in private browsing; this session still
    // receives the requested mode through the document attributes.
  }
  ensureSystemListener();
  return paintPreference(preference);
}

/** Backwards-compatible explicit setter used by terminal aliases. */
export function setSiteTheme(theme: SiteTheme): SiteTheme {
  return setSiteThemePreference(theme);
}

function subscribe(onChange: () => void): () => void {
  ensureSystemListener();
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

export function useSiteThemePreference(): SiteThemePreference {
  return useSyncExternalStore(
    subscribe,
    getSiteThemePreference,
    () => 'system',
  );
}

export function useSiteTheme(): SiteTheme {
  return useSyncExternalStore(subscribe, getSiteTheme, () => 'light');
}
