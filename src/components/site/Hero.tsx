'use client';

import Image from 'next/image';
import { ImageDithering } from '@paper-design/shaders-react';
import { useRef, useState } from 'react';
import Terminal from '@/components/site/Terminal';
import { profile } from '@/data/resume';

const TERM_MIN = 300;
const TERM_MAX = 720;
const TERM_DEFAULT = 380;

const clampWidth = (px: number) =>
  Math.min(TERM_MAX, Math.max(TERM_MIN, Math.round(px)));

export default function Hero() {
  // Shared with the terminal: `dither <color>` / `undither` drive the print.
  const [dither, setDither] = useState({ on: true, color: '#292929' });
  const [termWidth, setTermWidth] = useState(TERM_DEFAULT);
  const dragRef = useRef<{ startX: number; startW: number } | null>(null);

  const setWidth = (px: number) => setTermWidth(clampWidth(px));

  return (
    <section id="top" className="border-b-2 border-ink">
      <div
        className="rule-grid hero-grid lg:min-h-[calc(100dvh-56px-2px)]"
        // The 100vw cap keeps the text + portrait columns viable on narrow
        // desktops (e.g. `width 720` at a 1024px window) and tracks live
        // window resizes without JS.
        style={
          {
            '--term-w': `min(${termWidth}px, 100vw - 480px)`,
          } as React.CSSProperties
        }
      >
        {/* Main cell */}
        <div className="cell-pad flex flex-col justify-between gap-12">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <span className="label">{profile.role} — Portfolio</span>
            <span className="label-wide">Est. {profile.location}</span>
          </div>

          <div>
            <h1 className="display-thin text-[clamp(2.75rem,6.5vw,8rem)]">
              <span className="block">{profile.firstName}</span>
              <span className="block">{profile.lastName}</span>
            </h1>
            <p className="display text-subheading md:text-heading-sm max-w-2xl font-light mt-6">
              {profile.tagline}
            </p>
          </div>

          <div className="flex flex-wrap gap-[2px]">
            <a className="btn-inverse" href="#work">
              Experiences <span aria-hidden="true">→</span>
            </a>
            <a className="btn-outline" href="#contact">
              Get in Touch
            </a>
          </div>
        </div>

        {/* Portrait module — full-height dithered print in its own cell.
            Hover reveals the original; the terminal's dither commands
            recolor or remove the effect entirely. */}
        <div
          className="group relative min-h-[440px] md:min-h-[520px] lg:min-h-0"
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
            colorBack="#ffffff"
            colorFront={dither.color}
            colorHighlight={dither.color}
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
        <div className="terminal-cell relative min-h-[440px] overflow-hidden lg:min-h-0">
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
          <div className="absolute inset-0">
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
        </div>
      </div>
    </section>
  );
}
