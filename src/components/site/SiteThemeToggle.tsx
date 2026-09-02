'use client';

import { toggleSiteTheme, useSiteTheme } from '@/lib/site-theme';

/**
 * Light/dark toggle in the hero's CTA row — a .btn-outline plaque, on the
 * grid like every other control in the system. The visible label and glyph
 * paint from the data-site-theme attribute alone (globals.css), so they are
 * correct before hydration and never flash; the hook only feeds aria state.
 * Clicking persists an explicit choice (until then the site follows the OS).
 */
export default function SiteThemeToggle() {
  const theme = useSiteTheme();

  return (
    <button
      type="button"
      onClick={() => toggleSiteTheme()}
      aria-pressed={theme === 'dark'}
      aria-label={
        theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      }
      className="site-theme-toggle btn-outline col-span-2 gap-2 whitespace-nowrap"
    >
      <span aria-hidden="true" className="stt-glyph" />
      <span className="stt-when-light">Dark mode</span>
      <span className="stt-when-dark">Light mode</span>
    </button>
  );
}
