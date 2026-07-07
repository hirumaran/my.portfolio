import { getTheme, getThemeNames, isRegisteredTheme } from '@/themes/registry';

/**
 * Terminal theme command handlers.
 *
 * These are pure functions — they take the current theme name and return
 * the next theme name. The caller (Terminal.tsx) is responsible for calling
 * setTheme with the result.
 */

/** All theme names in registration order. */
const NAMES = getThemeNames();

/**
 * Resolve a `theme <arg>` command.
 *
 * Returns:
 *  - { ok: true, name } when a valid theme is resolved
 *  - { ok: false, message } for errors or listing output
 */
export function resolveThemeCommand(
  arg: string,
  currentName: string,
): { ok: true; name: string } | { ok: false; message: string } {
  const normalized = arg.toLowerCase().trim();

  if (!normalized) {
    // List all themes
    const lines = NAMES.map((n) => {
      const marker = n.toLowerCase() === currentName.toLowerCase() ? '  (active)' : '';
      return `- ${n}${marker}`;
    });
    return {
      ok: false,
      message: ['Available themes:', ...lines].join('\n'),
    };
  }

  if (normalized === 'random') {
    const others = NAMES.filter(
      (n) => n.toLowerCase() !== currentName.toLowerCase(),
    );
    const pool = others.length > 0 ? others : NAMES;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    return { ok: true, name: pick };
  }

  if (normalized === 'next') {
    const idx = NAMES.findIndex(
      (n) => n.toLowerCase() === currentName.toLowerCase(),
    );
    const nextIdx = (idx + 1) % NAMES.length;
    return { ok: true, name: NAMES[nextIdx] };
  }

  if (normalized === 'previous' || normalized === 'prev') {
    const idx = NAMES.findIndex(
      (n) => n.toLowerCase() === currentName.toLowerCase(),
    );
    const prevIdx = (idx - 1 + NAMES.length) % NAMES.length;
    return { ok: true, name: NAMES[prevIdx] };
  }

  // Direct theme name lookup (case-insensitive)
  if (isRegisteredTheme(normalized)) {
    const theme = getTheme(normalized)!;
    if (theme.name.toLowerCase() === currentName.toLowerCase()) {
      return { ok: false, message: `theme: already ${theme.name}.` };
    }
    return { ok: true, name: theme.name };
  }

  return {
    ok: false,
    message: `theme: unknown theme '${arg}' — try ${NAMES.join(', ')}.`,
  };
}
