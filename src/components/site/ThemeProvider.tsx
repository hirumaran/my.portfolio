'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

/**
 * Centralized theme manager. The active theme is exposed to CSS as a
 * `data-term-theme` attribute on <html>; every themed color derives from the
 * design tokens scoped to that attribute in globals.css. The terminal is the
 * only consumer today, but any surface can read the same tokens.
 *
 * `preview` supports hover-previewing a theme without committing it —
 * committing (setTheme) also persists to localStorage.
 */

export const TERMINAL_THEMES = [
  'light',
  'dark',
  'blueprint',
  'terminal',
] as const;
export type TerminalTheme = (typeof TERMINAL_THEMES)[number];

export const isTerminalTheme = (value: string): value is TerminalTheme =>
  (TERMINAL_THEMES as readonly string[]).includes(value);

const STORAGE_KEY = 'td-terminal-theme';
const DEFAULT_THEME: TerminalTheme = 'dark';

type ThemeContextValue = {
  /** Committed theme (persisted). */
  theme: TerminalTheme;
  /** What's actually painted right now — a hover preview, or the theme. */
  applied: TerminalTheme;
  /** Commit + persist. */
  setTheme: (theme: TerminalTheme) => void;
  /** Temporarily paint a theme (null restores the committed one). */
  preview: (theme: TerminalTheme | null) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTerminalTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTerminalTheme must be used inside <ThemeProvider>');
  }
  return ctx;
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server and first client render agree on the default; the persisted
  // choice is restored after mount to keep hydration clean.
  const [theme, setThemeState] = useState<TerminalTheme>(DEFAULT_THEME);
  const [previewTheme, setPreviewTheme] = useState<TerminalTheme | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && isTerminalTheme(saved)) setThemeState(saved);
    } catch {
      /* private mode etc. — default stands */
    }
  }, []);

  const applied = previewTheme ?? theme;

  useEffect(() => {
    document.documentElement.setAttribute('data-term-theme', applied);
  }, [applied]);

  const setTheme = useCallback((next: TerminalTheme) => {
    setThemeState(next);
    setPreviewTheme(null);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* persistence is best-effort */
    }
  }, []);

  const preview = useCallback((next: TerminalTheme | null) => {
    setPreviewTheme(next);
  }, []);

  const value = useMemo(
    () => ({ theme, applied, setTheme, preview }),
    [theme, applied, setTheme, preview],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
