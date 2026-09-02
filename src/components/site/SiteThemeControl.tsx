'use client';

import {
  setSiteThemePreference,
  useSiteTheme,
  useSiteThemePreference,
  type SiteThemePreference,
} from '@/lib/site-theme';

const OPTIONS: Array<{ label: string; value: SiteThemePreference }> = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

/** Display-mode rail for the terminal's utility header. */
export default function SiteThemeControl() {
  const preference = useSiteThemePreference();
  const resolvedTheme = useSiteTheme();

  return (
    <div className="display-mode-rail" aria-label="Display mode">
      <span className="display-mode-label label-wide">
        Display
        <span className="sr-only">, currently {preference}</span>
      </span>
      <div
        className="display-mode-options"
        role="radiogroup"
        aria-label={`Display mode; system currently resolves to ${resolvedTheme}`}
      >
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            data-mode={option.value}
            aria-checked={preference === option.value}
            className="display-mode-option label"
            onClick={() => setSiteThemePreference(option.value)}
          >
            <span className="display-mode-indicator" aria-hidden="true" />
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
