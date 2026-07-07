'use client';

import { profile } from '@/data/resume';

export default function Contact() {
  const telHref = `tel:${profile.phone.replace(/\D/g, '')}`;

  return (
    <section id="contact">
      <div className="rule-grid">
        {/* Header row */}
        <div className="rule-grid grid-cols-[1fr_auto] bg-ink">
          <div className="cell-pad-sm">
            <span className="label">04 — Contact</span>
          </div>
          <div className="cell-pad-sm flex items-center">
            <span className="label-wide">Open to Work</span>
          </div>
        </div>

        {/* Headline */}
        <div className="cell-pad">
          <h2 className="display-thin max-w-5xl text-[clamp(2.5rem,7vw,6rem)]">
            Building something? Let’s talk.
          </h2>
        </div>

        {/* Mailing row — mailto styled as a filled-in underline input */}
        <div className="cell-pad">
          <p className="label">Write to Me</p>
          <a
            href={`mailto:${profile.email}`}
            className="hairline-b mt-4 inline-flex max-w-full cursor-pointer items-baseline gap-4 pb-2 text-heading-sm font-thin text-carbon md:text-heading"
          >
            {/* break-all + min-w-0: the address wraps inside narrow viewports
                instead of pushing the page into horizontal scroll. */}
            <span className="min-w-0 break-all">{profile.email}</span>
            <span aria-hidden="true">↳</span>
          </a>
        </div>

        {/* Meta row */}
        <div className="rule-grid bg-ink md:grid-cols-3">
          <div className="cell-pad-sm">
            <p className="label">LinkedIn</p>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link mt-2 inline-flex min-h-11 items-center"
            >
              {profile.linkedinLabel}
            </a>
          </div>
          <div className="cell-pad-sm">
            <p className="label">Phone</p>
            <a
              href={telHref}
              className="text-link mt-2 inline-flex min-h-11 items-center"
            >
              {profile.phone}
            </a>
          </div>
          <div className="cell-pad-sm">
            <p className="label">Location</p>
            <span className="text-link mt-2 inline-flex min-h-11 items-center">
              {profile.location}
            </span>
          </div>
        </div>
      </div>

      {/* Footer bar — the section's only top rule; it closes the page grid */}
      <footer className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t-2 border-ink bg-paper px-5 py-5 md:px-[45px]">
        <span className="label-wide">© 2026 {profile.name}</span>
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-8 gap-y-2">
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link inline-flex min-h-11 items-center"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="text-link inline-flex min-h-11 items-center"
          >
            Email
          </a>
          <a href="#top" className="text-link inline-flex min-h-11 items-center">
            Top
          </a>
        </nav>
      </footer>
    </section>
  );
}
