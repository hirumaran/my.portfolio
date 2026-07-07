import { isRegisteredTheme, DEFAULT_THEME_NAME } from '@/themes/registry';

/**
 * ThemePersistenceService — localStorage abstraction for terminal theme state.
 *
 * Stores:
 *  - active theme name
 *  - favorites (starred themes)
 *  - recently used (ordered by most-recent-first, capped at 5)
 *
 * All writes are best-effort (private browsing mode is silently ignored).
 */

const KEYS = {
  active: 'td-terminal-theme',
  favorites: 'td-terminal-theme-favorites',
  recent: 'td-terminal-theme-recent',
} as const;

const MAX_RECENT = 5;

function safeRead(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeWrite(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* private mode — persistence is best-effort */
  }
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/* ── Active theme ────────────────────────────────────────────────────── */

export function loadActiveTheme(): string {
  const saved = safeRead(KEYS.active);
  if (saved && isRegisteredTheme(saved)) return saved;
  return DEFAULT_THEME_NAME;
}

export function saveActiveTheme(name: string): void {
  safeWrite(KEYS.active, name);
}

/* ── Favorites ───────────────────────────────────────────────────────── */

export function loadFavorites(): string[] {
  const raw = safeRead(KEYS.favorites);
  const parsed = safeParse<string[]>(raw, []);
  // Filter out any names that no longer exist in the registry.
  return parsed.filter(isRegisteredTheme);
}

export function saveFavorites(favorites: string[]): void {
  safeWrite(KEYS.favorites, JSON.stringify(favorites));
}

export function toggleFavorite(name: string): string[] {
  const current = loadFavorites();
  const idx = current.indexOf(name);
  if (idx === -1) {
    current.push(name);
  } else {
    current.splice(idx, 1);
  }
  saveFavorites(current);
  return current;
}

export function isFavorite(name: string): boolean {
  return loadFavorites().includes(name);
}

/* ── Recently used ───────────────────────────────────────────────────── */

export function loadRecent(): string[] {
  const raw = safeRead(KEYS.recent);
  const parsed = safeParse<string[]>(raw, []);
  return parsed.filter(isRegisteredTheme).slice(0, MAX_RECENT);
}

export function pushRecent(name: string): void {
  const current = loadRecent();
  const filtered = current.filter((n) => n !== name);
  filtered.unshift(name);
  safeWrite(KEYS.recent, JSON.stringify(filtered.slice(0, MAX_RECENT)));
}
