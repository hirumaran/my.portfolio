'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { type TerminalThemePalette, CSS_PALETTE_KEYS } from '@/themes/types';
import { getTheme, getAllThemes, getThemeNames, DEFAULT_THEME_NAME } from '@/themes/registry';
import {
  loadActiveTheme,
  saveActiveTheme,
  pushRecent,
  loadFavorites,
  saveFavorites,
  loadRecent,
} from '@/services/ThemePersistenceService';

/**
 * TerminalThemeProvider — the single source of truth for terminal theming.
 *
 * Responsibilities:
 *  1. Load the persisted theme (or default) on mount
 *  2. Generate CSS custom properties from the active palette and inject them
 *     into a <style> tag — no hardcoded CSS blocks needed
 *  3. Expose theme state + mutation functions via context
 *  4. Support hover-preview without committing
 *  5. Track favorites and recently-used for the picker
 *
 * Theme changes are purely color changes — the injected <style> tag only
 * contains custom properties (--terminal-bg, --ansi-red, etc.). No layout,
 * dimension, typography, or image properties are ever touched.
 */

/* ── Context shape ───────────────────────────────────────────────────── */

type TerminalThemeContextValue = {
  /** The committed (persisted) theme palette. */
  theme: TerminalThemePalette;
  /** The currently painted palette — may be a hover preview. */
  applied: TerminalThemePalette;
  /** Commit a theme by name and persist. Idempotent — same name = no-op. */
  setTheme: (name: string) => void;
  /** Temporarily paint a theme by name (null restores committed). */
  preview: (name: string | null) => void;
  /** All registered themes. */
  allThemes: TerminalThemePalette[];
  /** All theme display names. */
  themeNames: string[];
  /** Favorited theme names. */
  favorites: string[];
  /** Toggle a theme name in/out of favorites. Returns new list. */
  toggleFavorite: (name: string) => void;
  /** Recently used theme names (most-recent-first). */
  recentThemes: string[];
};

const TerminalThemeContext = createContext<TerminalThemeContextValue | null>(null);

export function useTerminalTheme(): TerminalThemeContextValue {
  const ctx = useContext(TerminalThemeContext);
  if (!ctx) {
    throw new Error(
      'useTerminalTheme must be used inside <TerminalThemeProvider>',
    );
  }
  return ctx;
}

/* ── CSS variable generation ─────────────────────────────────────────── */

/**
 * Build a CSS string of custom properties from a palette.
 * Only emits color properties — never layout, dimension, or typography.
 */
function buildThemeCSS(palette: TerminalThemePalette): string {
  const vars: string[] = [];
  for (const key of CSS_PALETTE_KEYS) {
    const varName = `--terminal-${key}`;
    const value = palette[key];
    vars.push(`${varName}: ${value};`);
  }
  // Also emit the legacy aliases for backward compatibility with existing
  // .terminal-cell and other consumers.
  vars.push(`--terminal-bg-secondary: ${palette.background};`);
  vars.push(`--terminal-fg-muted: ${palette.foreground}99;`);
  vars.push(`--terminal-border: ${palette.foreground};`);
  vars.push(`--terminal-accent: ${palette.cursor};`);
  vars.push(`--terminal-grid: none;`);
  return `:root[data-term-theme] { ${vars.join(' ')} }`;
}

/* ── Provider ────────────────────────────────────────────────────────── */

export default function TerminalThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const allThemes = useMemo(() => getAllThemes(), []);
  const themeNames = useMemo(() => getThemeNames(), []);

  // Lazy initializer: server + first client render agree on the default.
  // The persisted choice is restored in the effect below.
  const [themeName, setThemeName] = useState<string>(DEFAULT_THEME_NAME);
  const [previewName, setPreviewName] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentThemes, setRecentThemes] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Track the style element we inject so we can update it without
  // causing DOM churn.
  const styleRef = useRef<HTMLStyleElement | null>(null);

  /* ── Hydrate from localStorage on mount ──────────────────────────── */
  useEffect(() => {
    const saved = loadActiveTheme();
    // Only update if different from default to avoid a double-render.
    if (saved !== DEFAULT_THEME_NAME) {
      setThemeName(saved);
    }
    setFavorites(loadFavorites());
    setRecentThemes(loadRecent());
    setMounted(true);
  }, []);

  /* ── Resolve palette ──────────────────────────────────────────────── */
  const resolvedName = previewName ?? themeName;
  const applied = useMemo(
    () => getTheme(resolvedName) ?? getTheme(DEFAULT_THEME_NAME)!,
    [resolvedName],
  );
  const theme = useMemo(
    () => getTheme(themeName) ?? getTheme(DEFAULT_THEME_NAME)!,
    [themeName],
  );

  /* ── Inject CSS variables ─────────────────────────────────────────── */
  useEffect(() => {
    if (!mounted) return;

    // Create the style element once, update its content on every change.
    if (!styleRef.current) {
      const el = document.createElement('style');
      el.id = 'terminal-theme-vars';
      el.setAttribute('data-terminal-theme', '');
      document.head.appendChild(el);
      styleRef.current = el;
    }

    styleRef.current.textContent = buildThemeCSS(applied);

    // Keep the data attribute in sync for the flash-prevention script
    // and any CSS that still uses attribute selectors.
    document.documentElement.setAttribute(
      'data-term-theme',
      applied.name.toLowerCase(),
    );

    // Cleanup on unmount (should never happen for a layout-level provider,
    // but it's correct).
    return () => {
      const el = styleRef.current;
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
        styleRef.current = null;
      }
    };
  }, [applied, mounted]);

  /* ── Mutations ────────────────────────────────────────────────────── */

  const setTheme = useCallback(
    (name: string) => {
      const normalized = name.toLowerCase();
      if (!getTheme(normalized)) return; // unknown theme — no-op
      if (normalized === themeName.toLowerCase()) return; // idempotent

      setThemeName(name);
      setPreviewName(null);
      saveActiveTheme(name);
      pushRecent(name);
      setRecentThemes(loadRecent());
    },
    [themeName],
  );

  const preview = useCallback((name: string | null) => {
    setPreviewName(name);
  }, []);

  const toggleFavorite = useCallback(
    (name: string) => {
      const current = loadFavorites();
      const idx = current.indexOf(name);
      if (idx === -1) {
        current.push(name);
      } else {
        current.splice(idx, 1);
      }
      saveFavorites(current);
      setFavorites(current);
    },
    [],
  );

  const value = useMemo<TerminalThemeContextValue>(
    () => ({
      theme,
      applied,
      setTheme,
      preview,
      allThemes,
      themeNames,
      favorites,
      toggleFavorite,
      recentThemes,
    }),
    [theme, applied, setTheme, preview, allThemes, themeNames, favorites, toggleFavorite, recentThemes],
  );

  return (
    <TerminalThemeContext.Provider value={value}>
      {children}
    </TerminalThemeContext.Provider>
  );
}
