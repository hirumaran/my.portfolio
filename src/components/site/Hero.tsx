'use client';

import Image from 'next/image';
import { ImageDithering } from '@paper-design/shaders-react';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Terminal from '@/components/site/Terminal';
import MusicIsland from '@/components/site/MusicIsland';
import SiteThemeToggle from '@/components/site/SiteThemeToggle';
import {
  DARK_INK_HEX,
  DARK_PAPER_HEX,
  useSiteTheme,
} from '@/lib/site-theme';
import { profile, terminal } from '@/data/resume';

const TERM_MIN = 300;
const TERM_MAX = 720;
const TERM_DEFAULT = 380;
const MOBILE_QUERY = '(max-width: 767px)';

const subscribeToMobileViewport = (onChange: () => void) => {
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};

const getMobileViewportSnapshot = () =>
  window.matchMedia(MOBILE_QUERY).matches;

const getServerMobileViewportSnapshot = () => false;

const clampWidth = (px: number) =>
  Math.min(TERM_MAX, Math.max(TERM_MIN, Math.round(px)));

export default function Hero() {
  // Shared with the terminal: `dither <color>` / `undither` drive the print.
  const [dither, setDither] = useState({ on: true, color: '#292929' });
  // Site light/dark. The default ink dither (#292929) tracks the theme —
  // light dots on the dark print; any explicitly chosen color stays as-is.
  const siteTheme = useSiteTheme();
  const ditherFront =
    dither.color === '#292929'
      ? siteTheme === 'dark'
        ? DARK_INK_HEX
        : '#292929'
      : dither.color;
  const ditherBack = siteTheme === 'dark' ? DARK_PAPER_HEX : '#ffffff';
  const [termWidth, setTermWidth] = useState(TERM_DEFAULT);
  const [mobileTerminalOpen, setMobileTerminalOpen] = useState(false);
  const isMobileViewport = useSyncExternalStore(
    subscribeToMobileViewport,
    getMobileViewportSnapshot,
    getServerMobileViewportSnapshot,
  );
  const dragRef = useRef<{ startX: number; startW: number } | null>(null);

  const setWidth = (px: number) => setTermWidth(clampWidth(px));

  /* The music island is absolutely centered inside the text cell, so its
     "top middle" follows the cell as the terminal column resizes. The
     center is derived from an actual measurement (ResizeObserver) instead
     of a CSS calc chain so grid-definition drift can't silently skew it. */
  const textCellRef = useRef<HTMLDivElement | null>(null);
  const [mediaRail, setMediaRail] = useState<{
    left: number;
    width: number;
  } | null>(null);

  useEffect(() => {
    const cell = textCellRef.current;
    if (!cell) return;
    const update = () =>
      setMediaRail({
        left: cell.offsetLeft + cell.offsetWidth / 2,
        width: cell.offsetWidth,
      });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(cell);
    const grid = cell.parentElement;
    if (grid) observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="top" className="border-b-2 border-ink">
      <div
        className="rule-grid hero-grid relative min-h-[100dvh]"
        // The 100vw cap keeps the text + portrait columns viable on narrow
        // desktops (e.g. `width 720` at a 1024px window) and tracks live
        // window resizes without JS.
        style={
          {
            '--term-w': `min(${termWidth}px, 100vw - 480px)`,
          } as React.CSSProperties
        }
      >
        {/* Island floats above the cells (overflow-visible on the rail) and
            expands downward into the text cell's headroom. */}
        {mediaRail !== null && (
          <MusicIsland
            islandStyle={{ left: mediaRail.left }}
            tickerStyle={{ left: 0, width: mediaRail.width }}
          />
        )}

        {/* Main cell */}
        <div
          ref={textCellRef}
          className={
            isMobileViewport
              ? 'hero-copy cell-pad flex flex-col gap-10'
              : 'cell-pad flex flex-col gap-12 pt-[120px]'
          }
        >
          {/* Keep the tagline anchored above the CTA row, while the first
              grid track gives the name its own centered middle band. */}
          <div className="grid flex-1 grid-rows-[minmax(0,1fr)_auto]">
            <div
              className={
                isMobileViewport
                  ? 'flex flex-col justify-center'
                  : 'flex items-center'
              }
            >
              {isMobileViewport ? (
                <p className="label-wide mb-5">
                  {profile.role} · {profile.location}
                </p>
              ) : null}
              <h1
                className={
                  isMobileViewport
                    ? 'display-thin text-[clamp(3.2rem,14vw,8rem)]'
                    : 'display-thin text-[clamp(2.75rem,6.5vw,8rem)]'
                }
              >
                <span className="block">{profile.firstName}</span>
                <span className="block">{profile.lastName}</span>
              </h1>
            </div>
            <p className="display text-subheading md:text-heading-sm max-w-2xl font-light mt-4">
              {profile.tagline}
            </p>
          </div>

          {isMobileViewport ? (
            <ol className="mobile-focus-list" aria-label="Areas of focus">
              {terminal.interests.map((interest, index) => (
                <li key={interest}>
                  <span className="label-wide">0{index + 1}</span>
                  <span className="display text-body-lg font-light">{interest}</span>
                </li>
              ))}
            </ol>
          ) : null}

          <div
            className={
              isMobileViewport
                ? 'grid grid-cols-2 gap-[2px]'
                : 'flex flex-wrap gap-[2px]'
            }
          >
            <a className="btn-inverse" href="#work">
              Experiences <span aria-hidden="true">→</span>
            </a>
            <a className="btn-outline" href="#contact">
              Get in Touch
            </a>
            {/* Full-width second row in the mobile 2-col grid (col-span-2),
                in-flow beside the CTAs on desktop. */}
            <SiteThemeToggle />
          </div>
        </div>

        {/* Portrait module — full-height dithered print in its own cell.
            Hover reveals the original; the terminal's dither commands
            recolor or remove the effect entirely. */}
        <div
          className={
            isMobileViewport
              ? 'hero-portrait group relative min-h-[310px]'
              : 'group relative min-h-[440px] md:min-h-[520px] lg:min-h-0'
          }
          role="img"
          aria-label={profile.name}
        >
          <Image
            src="/images/hero.jpg"
            alt=""
            fill
            preload
            sizes="(min-width: 768px) 380px, 100vw"
            className={`object-cover transition-opacity duration-300 ease-[cubic-bezier(0.455,0.03,0.515,0.955)] ${
              dither.on ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
            }`}
          />
          <ImageDithering
            image="/images/hero.jpg"
            colorBack={ditherBack}
            colorFront={ditherFront}
            colorHighlight={ditherFront}
            type="8x8"
            size={2}
            colorSteps={2}
            fit="cover"
            className={`pointer-events-none transition-opacity duration-300 ease-[cubic-bezier(0.455,0.03,0.515,0.955)] ${
              dither.on ? 'opacity-100 group-hover:opacity-0' : 'opacity-0'
            }`}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
            }}
          />
        </div>

        {/* Terminal column — the whole right side on lg+, full-width row on
            smaller screens; width user-adjustable via drag edge / `width`.

            The terminal fills this cell absolutely (see the wrapper below) so
            its output never contributes to the cell's height. Without that, a
            tall output history grows the cell, which grows the grid row, which
            stretches the portrait (fill) and spreads the name (justify-between)
            — cumulative layout drift from repeated commands/theme clicks. The
            cell's height comes only from the grid (the text column on lg, the
            min-h floor below lg); output scrolls inside this fixed box, so the
            hero is mathematically identical before and after any number of
            interactions. */}
        <div
          className={
            isMobileViewport
              ? `terminal-cell relative min-h-[292px] overflow-hidden transition-[height] duration-300 ${
                  mobileTerminalOpen ? 'h-[540px]' : 'h-[292px]'
                }`
              : 'terminal-cell relative min-h-[440px] overflow-hidden lg:min-h-0'
          }
        >
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize terminal — arrow keys adjust, Home resets, End maximizes"
            aria-valuemin={TERM_MIN}
            aria-valuemax={TERM_MAX}
            aria-valuenow={termWidth}
            tabIndex={0}
            title="Drag to resize the terminal"
            // touch-none: touch drags emit pointermove instead of being
            // claimed for scrolling (pointercancel). -outline-offset-2 draws
            // the focus ring inside the strip — the parent's overflow-hidden
            // would clip an outside ring, and paper-on-ink keeps it visible.
            className="absolute inset-y-0 left-0 z-10 hidden w-2 touch-none cursor-col-resize focus-visible:outline-paper focus-visible:-outline-offset-2 lg:block"
            onPointerDown={(e) => {
              // Left/primary presses only: a right-click opens the context
              // menu and cancels the stream, which would strand dragRef.
              if (!e.isPrimary || e.button !== 0) return;
              // Suppress native drag-select so the hero text doesn't get
              // highlighted while resizing.
              e.preventDefault();
              dragRef.current = { startX: e.clientX, startW: termWidth };
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              const drag = dragRef.current;
              if (!drag) return;
              setWidth(drag.startW + (drag.startX - e.clientX));
            }}
            onPointerUp={() => {
              dragRef.current = null;
            }}
            onPointerCancel={() => {
              dragRef.current = null;
            }}
            onLostPointerCapture={() => {
              dragRef.current = null;
            }}
            onDoubleClick={() => setWidth(TERM_DEFAULT)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') {
                e.preventDefault();
                setWidth(termWidth + 16);
              } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                setWidth(termWidth - 16);
              } else if (e.key === 'Home') {
                e.preventDefault();
                setWidth(TERM_DEFAULT);
              } else if (e.key === 'End') {
                e.preventDefault();
                setWidth(TERM_MAX);
              }
            }}
          />
          {/* absolute inset-0 takes the terminal out of flow so it cannot push
              this cell's height — the cell's height is set by the grid, and the
              terminal fills it. The output's own `overflow-y-auto` then scrolls
              internally instead of growing the page. See the cell comment above. */}
          <div
            id="hero-terminal-console"
            className={
              isMobileViewport
                ? 'absolute inset-x-0 top-0 bottom-14'
                : 'absolute inset-0'
            }
          >
            <Terminal
              ditherOn={dither.on}
              onDither={(next) =>
                setDither((prev) => ({
                  on: next.on,
                  color: next.color ?? prev.color,
                }))
              }
              termWidth={termWidth}
              onTermWidth={setWidth}
            />
          </div>
          {isMobileViewport ? (
            <button
              type="button"
              className="absolute inset-x-0 bottom-0 flex min-h-14 cursor-pointer items-center justify-between border-t border-[var(--terminal-fg)] bg-[var(--terminal-bg)] px-5 font-term text-[12px] uppercase tracking-[0.14em] text-[var(--terminal-fg)]"
              aria-expanded={mobileTerminalOpen}
              aria-controls="hero-terminal-console"
              onClick={() => setMobileTerminalOpen((open) => !open)}
            >
              <span>{mobileTerminalOpen ? 'Tuck terminal away' : 'Open full terminal'}</span>
              <span aria-hidden="true">{mobileTerminalOpen ? '↑' : '↓'}</span>
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
