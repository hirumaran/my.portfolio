'use client';

import { useEffect, useState } from 'react';
import { profile } from '@/data/resume';

/* Bellevue is Pacific Time; America/Los_Angeles handles PST/PDT rollover.
   Built once at module scope — Intl construction is the expensive part. */
const clockFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Los_Angeles',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true,
  timeZoneName: 'short', // PDT / PST, whichever is actually in effect
});

/** Live Pacific-Time plaque, e.g. `BELLEVUE, WA — 09:41:07 PM PDT`.
 *
 * Server and first client paint render a fixed placeholder so hydration
 * matches byte-for-byte; the real time swaps in on mount. The interval
 * re-reads Date.now() every half second instead of counting, so a
 * background-throttled tab snaps back to the correct time on return
 * rather than accumulating drift. Seconds tick by design — a still clock
 * would be a drawing of a clock. */
function BellevueClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, []);

  const time = now === null ? '--:--:-- -- ---' : clockFormat.format(now);

  return (
    <div
      className="hidden items-center gap-3 border-l-2 border-ink px-5 md:flex"
      title={`Local time in ${profile.location}`}
    >
      <span className="label">{profile.location} —</span>
      {/* tabular-nums keeps the plaque frozen in place while it ticks. */}
      <span className="label-wide tabular-nums">{time}</span>
    </div>
  );
}

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-paper">
      <nav aria-label="Primary" className="flex h-14 items-stretch">
        {/* Zone 1 — wordmark */}
        <a
          href="#top"
          className="label-wide flex items-center px-4 md:px-5"
        >
          {profile.name}
        </a>

        {/* Zone 1b — availability, the system's one color accent. */}
        <div className="flex items-center gap-2.5 border-l-2 border-ink px-4 md:px-5">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="badge-dot absolute inset-0 animate-ping opacity-30" />
            <span className="badge-dot relative h-2 w-2" />
          </span>
          {/* "OPEN TO WORK" doesn't fit next to the full wordmark under
              640px; the dot + OPEN reads like a shop sign instead. */}
          <span className="label-wide text-accent hidden sm:inline">
            Open to work
          </span>
          <span className="label-wide text-accent sm:hidden">Open</span>
        </div>

        {/* Zone 1c — live Bellevue clock (desktop only). */}
        <BellevueClock />

        {/* Zone 2 — section links, right-aligned, desktop only. */}
        <div className="hidden flex-1 items-stretch justify-end md:flex">
          <a
            href="#work"
            className="text-link flex items-center border-l-2 border-ink px-5"
          >
            Work
          </a>
          <a
            href="#toolbox"
            className="text-link flex items-center border-l-2 border-ink px-5"
          >
            Toolbox
          </a>
          <a
            href="#about"
            className="text-link flex items-center border-l-2 border-ink px-5"
          >
            About
          </a>
        </div>

        {/* Zone 3 — CONTACT as the Dark Inverse Cell CTA. */}
        <a
          href="#contact"
          className="label ml-auto flex items-center border-l-2 border-ink bg-ink px-4 text-paper transition-colors duration-300 ease-[cubic-bezier(0.455,0.03,0.515,0.955)] hover:bg-paper hover:text-ink md:ml-0 md:px-5"
        >
          Contact
        </a>
      </nav>
    </header>
  );
}
