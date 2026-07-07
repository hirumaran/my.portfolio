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
        className="rule-grid hero-grid md:min-h-[calc(100dvh-56px-2px)]"
        style={{ '--term-w': `${termWidth}px` } as React.CSSProperties}
      >
        {/* Main cell */}
        <div className="cell-pad flex flex-col justify-between gap-12">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <span className="label">{profile.role} — Portfolio</span>
            <span className="label-wide">Est. {profile.location}</span>
          </div>

          <div>
            <h1 className="display-thin text-[clamp(3rem,10vw,8.5rem)]">
              <span className="block">{profile.firstName}</span>
              <span className="block">{profile.lastName}</span>
            </h1>
            <p className="display text-subheading md:text-heading-sm max-w-2xl font-light mt-6">
              {profile.tagline}
            </p>
          </div>

          <div className="flex flex-wrap gap-[2px]">
            <a className="btn-inverse" href="#work">
              Selected Work →
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
          className="group relative min-h-[440px] md:min-h-0"
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

        {/* Terminal column — the whole right side, width user-adjustable */}
        <div className="cell-ink relative min-h-[440px] overflow-hidden">
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize terminal — arrow keys adjust, Home resets"
            tabIndex={0}
            title="Drag to resize the terminal"
            className="absolute inset-y-0 left-0 z-10 hidden w-2 cursor-col-resize focus-visible:outline-paper md:block"
            onPointerDown={(e) => {
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
              }
            }}
          />
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
    </section>
  );
}
