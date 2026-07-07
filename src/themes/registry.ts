import { TerminalThemePalette } from './types';
import dracula from './dracula';
import nord from './nord';
import gruvbox from './gruvbox';
import catppuccin from './catppuccin';
import tokyoNight from './tokyo-night';
import oneDark from './one-dark';
import solarizedDark from './solarized-dark';
import githubDark from './github-dark';
import monokai from './monokai';
import ayuDark from './ayu-dark';

/**
 * Theme registry — the single source of truth for all available terminal themes.
 *
 * To add a new theme:
 * 1. Create `src/themes/my-theme.ts` exporting a `TerminalThemePalette`
 * 2. Import it here and add it to the `themes` array below
 * 3. Done — no CSS changes, no switch statements, no provider changes
 *
 * Themes are keyed by lowercase name for case-insensitive lookup.
 */

const themes: TerminalThemePalette[] = [
  dracula,
  nord,
  gruvbox,
  catppuccin,
  tokyoNight,
  oneDark,
  solarizedDark,
  githubDark,
  monokai,
  ayuDark,
];

const registry = new Map<string, TerminalThemePalette>();
const nameList: string[] = [];

for (const t of themes) {
  const key = t.name.toLowerCase();
  registry.set(key, t);
  nameList.push(t.name);
}

/** Look up a theme by name (case-insensitive). */
export function getTheme(name: string): TerminalThemePalette | undefined {
  return registry.get(name.toLowerCase());
}

/** All registered themes in display order. */
export function getAllThemes(): TerminalThemePalette[] {
  return themes;
}

/** All theme display names in registration order. */
export function getThemeNames(): string[] {
  return nameList;
}

/** The default theme applied on first visit. */
export const DEFAULT_THEME_NAME = 'Dracula';

/** Check whether a string names a registered theme (case-insensitive). */
export function isRegisteredTheme(value: string): boolean {
  return registry.has(value.toLowerCase());
}
