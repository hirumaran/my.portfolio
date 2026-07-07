/**
 * Terminal theme palette — the full ANSI 16-color structure used by
 * TerminalColors.com, iTerm2, VS Code, Hyper, and Warp.
 *
 * Adding a new theme = create a file in src/themes/ that exports a
 * TerminalThemePalette object, then import it in registry.ts. No switch
 * statements, no CSS changes, no provider changes needed.
 */
export interface TerminalThemePalette {
  /** Display name shown in the picker and `theme` command output. */
  name: string;

  /** Terminal background color. */
  background: string;
  /** Default foreground / text color. */
  foreground: string;
  /** Cursor color. */
  cursor: string;

  /** ANSI 0 — Black */
  black: string;
  /** ANSI 1 — Red */
  red: string;
  /** ANSI 2 — Green */
  green: string;
  /** ANSI 3 — Yellow */
  yellow: string;
  /** ANSI 4 — Blue */
  blue: string;
  /** ANSI 5 — Magenta */
  magenta: string;
  /** ANSI 6 — Cyan */
  cyan: string;
  /** ANSI 7 — White */
  white: string;

  /** ANSI 8 — Bright Black (Gray) */
  brightBlack: string;
  /** ANSI 9 — Bright Red */
  brightRed: string;
  /** ANSI 10 — Bright Green */
  brightGreen: string;
  /** ANSI 11 — Bright Yellow */
  brightYellow: string;
  /** ANSI 12 — Bright Blue */
  brightBlue: string;
  /** ANSI 13 — Bright Magenta */
  brightMagenta: string;
  /** ANSI 14 — Bright Cyan */
  brightCyan: string;
  /** ANSI 15 — Bright White */
  brightWhite: string;
}

/**
 * CSS custom property names generated from a palette.
 * Maps each palette field to its `--terminal-*` or `--ansi-*` variable name.
 */
export const PALETTE_TO_CSS_VAR: Record<keyof TerminalThemePalette, string> = {
  name: '', // name is metadata, not a CSS variable
  background: '--terminal-bg',
  foreground: '--terminal-fg',
  cursor: '--terminal-cursor',
  black: '--ansi-black',
  red: '--ansi-red',
  green: '--ansi-green',
  yellow: '--ansi-yellow',
  blue: '--ansi-blue',
  magenta: '--ansi-magenta',
  cyan: '--ansi-cyan',
  white: '--ansi-white',
  brightBlack: '--ansi-bright-black',
  brightRed: '--ansi-bright-red',
  brightGreen: '--ansi-bright-green',
  brightYellow: '--ansi-bright-yellow',
  brightBlue: '--ansi-bright-blue',
  brightMagenta: '--ansi-bright-magenta',
  brightCyan: '--ansi-bright-cyan',
  brightWhite: '--ansi-bright-white',
};

/** Fields that map to CSS variables (excludes `name`). */
export const CSS_PALETTE_KEYS = (
  Object.keys(PALETTE_TO_CSS_VAR) as (keyof TerminalThemePalette)[]
).filter((k) => PALETTE_TO_CSS_VAR[k] !== '');
