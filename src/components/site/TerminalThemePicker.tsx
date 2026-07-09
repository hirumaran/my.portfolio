'use client';

import { useRef, useState, useMemo, useCallback } from 'react';
import { useTerminalTheme } from '@/components/site/TerminalThemeProvider';
import type { TerminalThemePalette } from '@/themes/types';

/**
 * VS Code-style theme picker rendered inside the terminal.
 *
 * Features:
 *  - Search / filter
 *  - Color swatch preview (4 representative ANSI colors)
 *  - Hover (or focus) previews the theme without committing
 *  - Click / Enter commits and persists
 *  - Arrow keys navigate (roving tabindex)
 *  - Favorites (star toggle) with a dedicated section
 *  - Recently used section
 *
 * Leaving the panel restores the committed theme (onMouseLeave).
 */

/* Small color dot for the swatch strip. */
function SwatchDot({ color }: { color: string }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-3 w-3 flex-shrink-0 rounded-full"
      style={{ backgroundColor: color }}
    />
  );
}

/* 4-dot swatch: black, red, green, blue — a quick visual fingerprint. */
function ThemeSwatch({ palette }: { palette: TerminalThemePalette }) {
  return (
    <span className="flex items-center gap-1" aria-hidden="true">
      <SwatchDot color={palette.black} />
      <SwatchDot color={palette.red} />
      <SwatchDot color={palette.green} />
      <SwatchDot color={palette.blue} />
    </span>
  );
}

export default function TerminalThemePicker() {
  const {
    theme,
    setTheme,
    preview,
    allThemes,
    favorites,
    toggleFavorite,
    recentThemes,
  } = useTerminalTheme();

  const [query, setQuery] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  const activeName = theme.name;

  /* Filter themes by search query (case-insensitive). */
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return allThemes;
    return allThemes.filter((t) => t.name.toLowerCase().includes(q));
  }, [allThemes, query]);

  /* Partition into favorites, recent, and the rest. */
  const favoriteThemes = useMemo(
    () => allThemes.filter((t) => favorites.includes(t.name)),
    [allThemes, favorites],
  );

  const recentThemePalettes = useMemo(
    () =>
      recentThemes
        .filter((name) => name !== activeName)
        .map((name) => allThemes.find((t) => t.name === name))
        .filter(Boolean) as TerminalThemePalette[],
    [allThemes, recentThemes, activeName],
  );

  /* Roving tabindex helper. */
  const focusOption = useCallback(
    (index: number) => {
      const buttons =
        listRef.current?.querySelectorAll<HTMLButtonElement>(
          '[role="option"]',
        );
      if (!buttons?.length) return;
      const next = ((index % buttons.length) + buttons.length) % buttons.length;
      buttons[next].focus();
    },
    [],
  );

  /* Render a single theme row. */
  const renderRow = useCallback(
    (palette: TerminalThemePalette, index: number) => {
      const isActive = palette.name === activeName;
      const isFav = favorites.includes(palette.name);

      return (
        <button
          key={palette.name}
          type="button"
          role="option"
          aria-selected={isActive}
          tabIndex={isActive ? 0 : -1}
          onMouseEnter={() => preview(palette.name)}
          onFocus={() => preview(palette.name)}
          onBlur={() => preview(null)}
          onClick={() => setTheme(palette.name)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
              e.preventDefault();
              focusOption(index + 1);
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
              e.preventDefault();
              focusOption(index - 1);
            } else if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setTheme(palette.name);
            }
          }}
          className="flex w-full cursor-pointer items-center gap-2 px-2 py-1.5 text-left hover:brightness-110 focus-visible:outline-1"
          style={{
            backgroundColor: isActive ? 'var(--terminal-fg)' : 'transparent',
            color: isActive ? 'var(--terminal-bg)' : 'var(--terminal-fg)',
            opacity: isActive ? 1 : 0.85,
          }}
        >
          {/* Star toggle — span with role="button" to avoid nested <button> HTML error */}
          <span
            role="button"
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(palette.name);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
                toggleFavorite(palette.name);
              }
            }}
            aria-label={
              isFav
                ? `Remove ${palette.name} from favorites`
                : `Add ${palette.name} to favorites`
            }
            className="flex-shrink-0 cursor-pointer text-[14px] leading-none"
            style={{ color: isFav ? '#E5C07B' : 'var(--terminal-fg)' }}
          >
            {isFav ? '★' : '☆'}
          </span>

          {/* Color swatch */}
          <ThemeSwatch palette={palette} />

          {/* Name */}
          <span className="min-w-0 flex-1 truncate font-term text-[12.5px]">
            {palette.name}
          </span>

          {/* Active indicator */}
          {isActive && (
            <span aria-hidden="true" className="flex-shrink-0 text-[10px]">
              ●
            </span>
          )}
        </button>
      );
    },
    [activeName, favorites, preview, setTheme, toggleFavorite, focusOption],
  );

  return (
    <div
      className="mb-3 w-max min-w-[220px] max-w-[280px] border px-3 py-2"
      style={{ borderColor: 'var(--terminal-fg)' }}
      onMouseLeave={() => preview(null)}
    >
      {/* Search */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search themes…"
        aria-label="Search themes"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        className="mb-2 w-full border-b bg-transparent px-1 py-1 font-term text-[12.5px] placeholder:opacity-50 focus:outline-none"
        style={{
          borderColor: 'var(--terminal-fg)',
          color: 'var(--terminal-fg)',
        }}
        // Don't let the search input steal arrow-key navigation from the list.
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            focusOption(0);
          } else if (e.key === 'Escape') {
            setQuery('');
            (e.target as HTMLInputElement).blur();
          }
        }}
      />

      {/* Theme list */}
      <div ref={listRef} role="listbox" aria-label="Terminal themes">
        {/* Favorites section */}
        {favoriteThemes.length > 0 && !query && (
          <>
            <p
              className="label mb-1 mt-1 px-2 opacity-60"
              style={{ color: 'var(--terminal-fg)' }}
            >
              Favorites
            </p>
            {favoriteThemes.map((t, i) => renderRow(t, i))}
          </>
        )}

        {/* Recently used section */}
        {recentThemePalettes.length > 0 && !query && (
          <>
            <p
              className="label mb-1 mt-2 px-2 opacity-60"
              style={{ color: 'var(--terminal-fg)' }}
            >
              Recent
            </p>
            {recentThemePalettes.map((t, i) =>
              renderRow(t, favoriteThemes.length + i),
            )}
          </>
        )}

        {/* All themes (or filtered results) */}
        <p
          className="label mb-1 mt-2 px-2 opacity-60"
          style={{ color: 'var(--terminal-fg)' }}
        >
          {query ? 'Results' : 'All Themes'}
        </p>
        {filtered.length === 0 ? (
          <p
            className="px-2 py-1 font-term text-[12.5px] opacity-50"
            style={{ color: 'var(--terminal-fg)' }}
          >
            No themes match &ldquo;{query}&rdquo;
          </p>
        ) : (
          filtered.map((t, i) =>
            renderRow(t, (favoriteThemes.length + recentThemePalettes.length + i)),
          )
        )}
      </div>
    </div>
  );
}
