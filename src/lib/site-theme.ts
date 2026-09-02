import { useSyncExternalStore } from 'react';

/**
 * Site-wide light/dark theme — the photographic negative of MONO.
 *
 * The source of truth is the `data-site-theme` attribute on <html>, painted
 * before first render by the inline script in layout.tsx (no flash of the
 * wrong theme). Without a saved choice the site follows prefers-color-scheme
 * live; setSiteTheme() persists an explicit choice and the OS is ignored from
 * then on. All component colors flow from --ink / --paper / --carbon, so the
 * attribute alone inverts the page — no provider or wrapper needed.
 */

export type SiteTheme = 'light' | 'dark';

export const SITE_THEME_STORAGE_KEY = 'td-site-theme';
export const SITE_THEME_ATTRIBUTE = 'data-site-theme';

/**
 * Hex mirrors of the [data-site-theme="dark"] tokens in globals.css. The hero
 * dither shader takes color props (not CSS vars), so it reads these. Keep in
 * sync with the dark token block.
 */
export const DARK_PAPER_HEX = '#0f0f0e';
export const DARK_INK_HEX = '#ededea';

const CHANGE_EVENT = 'td-site-theme:change';
const DARK_MEDIA = '(prefers-color-scheme: dark)';

export function getSiteTheme(): SiteTheme {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.getAttribute(SITE_THEME_ATTRIBUTE) === 'dark'
    ? 'dark'
    : 'light';
}

export function setSiteTheme(theme: SiteTheme): void {
  try {
    localStorage.setItem(SITE_THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable (private mode) — the attribute still
    // applies for this session.
  }
  document.documentElement.setAttribute(SITE_THEME_ATTRIBUTE, theme);
  window.dispatchEvent(new Event(CHANGE_EVENT));

  // Keep the browser chrome (status-bar tint) in step with the page. The
  // layout's inline script creates this meta tag pre-paint; create it here if
  // that script was skipped (e.g. storage threw before the append).
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', theme === 'dark' ? DARK_PAPER_HEX : '#ffffff');
}

export function toggleSiteTheme(): SiteTheme {
  const next: SiteTheme = getSiteTheme() === 'dark' ? 'light' : 'dark';
  setSiteTheme(next);
  return next;
}

function subscribe(onChange: () => void): () => void {
  const media = window.matchMedia(DARK_MEDIA);
  const onMediaChange = () => {
    // No explicit choice saved → follow the OS live.
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(SITE_THEME_STORAGE_KEY);
    } catch {
      /* storage unavailable — treat as no saved choice */
    }
    if (saved) return;
    const next: SiteTheme = media.matches ? 'dark' : 'light';
    if (getSiteTheme() !== next) {
      document.documentElement.setAttribute(SITE_THEME_ATTRIBUTE, next);
    }
    onChange();
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  media.addEventListener('change', onMediaChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    media.removeEventListener('change', onMediaChange);
  };
}

/**
 * Current site theme. The server snapshot is 'light' so SSR matches, and the
 * store re-checks the attribute immediately after hydration.
 */
export function useSiteTheme(): SiteTheme {
  return useSyncExternalStore(subscribe, getSiteTheme, () => 'light');
}
