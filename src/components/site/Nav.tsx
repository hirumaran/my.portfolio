'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';

type SectionItem = {
  id: string;
  num: string;
  label: string;
  detail: string;
  keywords: string;
};

const SECTIONS: readonly SectionItem[] = [
  {
    id: 'top',
    num: '00',
    label: 'Return to top',
    detail: 'Introduction & terminal',
    keywords: 'home hero start terminal',
  },
  {
    id: 'work',
    num: '01',
    label: 'Experiences',
    detail: 'Roles, teams & active work',
    keywords: 'work jobs career microsoft uw google',
  },
  {
    id: 'toolbox',
    num: '02',
    label: 'Toolbox',
    detail: 'Languages, systems & platforms',
    keywords: 'skills stack technology tools',
  },
  {
    id: 'about',
    num: '03',
    label: 'About',
    detail: 'Background & approach',
    keywords: 'bio story profile',
  },
  {
    id: 'contact',
    num: '04',
    label: 'Contact',
    detail: 'Résumé, links & direct line',
    keywords: 'email resume linkedin github phone',
  },
] as const;

const PALETTE_EVENT = 'td-command-palette:open';
const DESKTOP_QUERY = '(min-width: 768px)';

function getShortcutLabel() {
  const platform = navigator.platform || navigator.userAgent;
  return /Mac|iPhone|iPad|iPod/i.test(platform) ? '⌘ K' : 'Ctrl K';
}

const subscribeToPlatform = () => () => {};
const getServerShortcutLabel = () => '⌘ K';

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const shortcutLabel = useSyncExternalStore(
    subscribeToPlatform,
    getShortcutLabel,
    getServerShortcutLabel,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const filteredSections = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return SECTIONS;
    return SECTIONS.filter((section) =>
      `${section.label} ${section.detail} ${section.keywords}`
        .toLowerCase()
        .includes(needle),
    );
  }, [query]);
  const resolvedIndex = Math.min(
    selectedIndex,
    Math.max(filteredSections.length - 1, 0),
  );

  const openPalette = useCallback(() => {
    if (!window.matchMedia(DESKTOP_QUERY).matches) return;
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    setQuery('');
    setSelectedIndex(0);
    setIsOpen(true);
  }, []);

  const closePalette = useCallback(() => {
    setIsOpen(false);
    window.requestAnimationFrame(() => {
      const previous = previouslyFocusedRef.current;
      if (previous?.isConnected) previous.focus({ preventScroll: true });
      else triggerRef.current?.focus({ preventScroll: true });
    });
  }, []);

  const navigateTo = useCallback(
    (section: SectionItem) => {
      const target = document.getElementById(section.id);
      if (!target) return;

      closePalette();
      window.history.pushState(null, '', `#${section.id}`);
      window.scrollTo({
        top: Math.max(0, target.getBoundingClientRect().top + window.scrollY),
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
      });
    },
    [closePalette],
  );

  useEffect(() => {
    const onOpenRequest = () => openPalette();
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (isOpen) closePalette();
        else openPalette();
        return;
      }
      if (event.key === 'Escape' && isOpen) {
        event.preventDefault();
        closePalette();
      }
    };

    window.addEventListener(PALETTE_EVENT, onOpenRequest);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener(PALETTE_EVENT, onOpenRequest);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [closePalette, isOpen, openPalette]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const desktopQuery = window.matchMedia(DESKTOP_QUERY);
    const closeWhenNarrow = (event: MediaQueryListEvent) => {
      if (!event.matches) closePalette();
    };
    document.body.style.overflow = 'hidden';
    desktopQuery.addEventListener('change', closeWhenNarrow);
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());

    return () => {
      window.cancelAnimationFrame(frame);
      desktopQuery.removeEventListener('change', closeWhenNarrow);
      document.body.style.overflow = previousOverflow;
    };
  }, [closePalette, isOpen]);

  const keepFocusInDialog = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Tab') return;
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable?.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const onSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelectedIndex((index) =>
        filteredSections.length ? (index + 1) % filteredSections.length : 0,
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelectedIndex((index) =>
        filteredSections.length
          ? (index - 1 + filteredSections.length) % filteredSections.length
          : 0,
      );
    } else if (event.key === 'Enter' && filteredSections[resolvedIndex]) {
      event.preventDefault();
      navigateTo(filteredSections[resolvedIndex]);
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openPalette}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="navigation-command-palette"
        aria-keyshortcuts="Meta+K Control+K"
        aria-label={`Open navigation command palette, ${shortcutLabel}`}
        title={`Open navigation (${shortcutLabel})`}
        className="group fixed left-0 top-1/2 z-[80] hidden h-14 w-11 -translate-y-1/2 touch-manipulation cursor-pointer items-center bg-transparent focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink md:flex"
      >
        <span
          className="h-8 w-px bg-ink opacity-[0.12] transition-[height,width,opacity] duration-200 group-hover:h-10 group-hover:w-[3px] group-hover:opacity-100 group-focus-visible:h-10 group-focus-visible:w-[3px] group-focus-visible:opacity-100"
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 translate-x-1 items-center whitespace-nowrap border-2 border-ink bg-paper px-3 py-2.5 text-ink opacity-0 shadow-[4px_4px_0_var(--ink)] transition-[opacity,transform] duration-150 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
          aria-hidden="true"
        >
          <span className="font-term text-[11px]" aria-hidden="true">
            &gt;_
          </span>
          <span className="label mx-3">Navigate</span>
          <span className="font-term text-[10px] opacity-55">{shortcutLabel}</span>
        </span>
      </button>

      {isOpen ? (
        <div
          className="command-palette-scrim fixed inset-0 z-[9998] hidden bg-[color-mix(in_srgb,var(--ink)_58%,transparent)] px-5 pt-[12vh] backdrop-blur-[3px] md:block"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closePalette();
          }}
        >
          <section
            ref={dialogRef}
            id="navigation-command-palette"
            role="dialog"
            aria-modal="true"
            aria-labelledby="navigation-command-title"
            onKeyDown={keepFocusInDialog}
            className="command-palette-panel mx-auto w-full max-w-[680px] border-2 border-ink bg-paper text-ink shadow-[10px_10px_0_var(--ink)]"
          >
            <header className="flex min-h-12 items-center justify-between border-b border-ink px-5">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 bg-ink" aria-hidden="true" />
                <h2 id="navigation-command-title" className="label">
                  Navigation / Command Index
                </h2>
              </div>
              <button
                type="button"
                onClick={closePalette}
                className="label-wide -mr-2 px-2 py-2 opacity-55 transition-opacity hover:opacity-100"
                aria-label="Close command palette"
              >
                ESC
              </button>
            </header>

            <div className="grid grid-cols-[52px_1fr] items-center border-b-2 border-ink focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-ink">
              <span className="grid h-full place-items-center border-r border-ink font-term text-lg" aria-hidden="true">
                &gt;
              </span>
              <input
                ref={inputRef}
                value={query}
                name="portfolio-navigation"
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={onSearchKeyDown}
                placeholder="Search sections…"
                aria-label="Search portfolio sections"
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                className="display min-w-0 bg-transparent px-5 py-5 text-[clamp(1.2rem,2.4vw,1.8rem)] font-light outline-none placeholder:text-ink/35"
              />
            </div>

            <div className="max-h-[min(470px,55vh)] overflow-y-auto overscroll-contain p-2">
              {filteredSections.length ? (
                <ol aria-label="Navigation results">
                  {filteredSections.map((section, index) => {
                    const isSelected = index === resolvedIndex;
                    return (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          onMouseEnter={() => setSelectedIndex(index)}
                          onClick={(event) => {
                            if (
                              event.metaKey ||
                              event.ctrlKey ||
                              event.shiftKey ||
                              event.altKey
                            ) {
                              return;
                            }
                            event.preventDefault();
                            navigateTo(section);
                          }}
                          className={`grid w-full touch-manipulation grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-4 px-4 py-3.5 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-current ${
                            isSelected
                              ? 'bg-ink text-paper'
                              : 'bg-paper text-ink hover:bg-ink hover:text-paper'
                          }`}
                        >
                          <span className="font-term text-[10px] tracking-[0.12em] opacity-60">
                            {section.num}
                          </span>
                          <span className="min-w-0">
                            <span className="label block truncate">{section.label}</span>
                            <span className="mt-1 block truncate font-term text-[11px] opacity-55">
                              {section.detail}
                            </span>
                          </span>
                          <span className="font-term text-sm opacity-65" aria-hidden="true">
                            ↵
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <p className="px-5 py-10 text-center font-term text-sm opacity-55">
                  No route matches “{query}”.
                </p>
              )}
            </div>

            <footer className="flex items-center justify-between gap-5 border-t border-ink px-5 py-3 font-term text-[10px] uppercase tracking-[0.1em] opacity-55">
              <span>↑ ↓ Select&nbsp;&nbsp; ↵ Open</span>
              <span>{shortcutLabel} Toggle</span>
            </footer>
          </section>
        </div>
      ) : null}
    </>
  );
}
