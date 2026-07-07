'use client';

import { useRef } from 'react';
import {
  TERMINAL_THEMES,
  useTerminalTheme,
  type TerminalTheme,
} from '@/components/site/ThemeProvider';

/**
 * Compact VS Code-style theme selector rendered inside the terminal.
 * Hover (or focus) previews a theme without committing; click/Enter commits
 * and persists. Arrow keys move between options (roving tabindex).
 */
export default function ThemePanel({
  onSelect,
}: {
  onSelect: (theme: TerminalTheme) => void;
}) {
  const { theme, preview } = useTerminalTheme();
  const listRef = useRef<HTMLDivElement>(null);

  const focusOption = (index: number) => {
    const buttons =
      listRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
    if (!buttons?.length) return;
    const next = (index + buttons.length) % buttons.length;
    buttons[next].focus();
  };

  return (
    <div className="mb-3 w-max border px-3 py-2" style={{ borderColor: 'var(--terminal-fg)' }}>
      <p className="label mb-1">Themes</p>
      <div
        ref={listRef}
        role="radiogroup"
        aria-label="Terminal theme"
        onMouseLeave={() => preview(null)}
      >
        {TERMINAL_THEMES.map((t, i) => {
          const active = t === theme;
          return (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              onMouseEnter={() => preview(t)}
              onFocus={() => preview(t)}
              onBlur={() => preview(null)}
              onClick={() => onSelect(t)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                  e.preventDefault();
                  focusOption(i + 1);
                } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                  e.preventDefault();
                  focusOption(i - 1);
                }
              }}
              className="flex min-h-8 w-full cursor-pointer items-center gap-2 text-left"
            >
              <span aria-hidden="true">{active ? '●' : '○'}</span>
              <span>{t}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
