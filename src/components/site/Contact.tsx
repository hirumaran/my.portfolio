'use client';

import { profile } from '@/data/resume';
import TextPressure from '@/components/TextPressure';

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
          <div className="cell-pad-sm flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-2 w-2 bg-[#16a34a]"
            />
            <span className="label-wide text-[#15803d]">
              Open to Work
            </span>
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
        <div className="rule-grid bg-ink md:grid-cols-4">
          <div className="cell-pad-sm">
            <p className="label">LinkedIn</p>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link mt-2 inline-flex min-h-11 items-center gap-2"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4 flex-shrink-0 fill-current"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              {profile.linkedinLabel}
            </a>
          </div>
          <div className="cell-pad-sm">
            <p className="label">GitHub</p>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link mt-2 inline-flex min-h-11 items-center gap-2"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4 flex-shrink-0 fill-current"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
              </svg>
              {profile.githubLabel}
            </a>
          </div>
          <div className="cell-pad-sm">
            <p className="label">Phone</p>
            <a
              href={telHref}
              className="text-link mt-2 inline-flex min-h-11 items-center gap-2"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4 flex-shrink-0 fill-current"
              >
                <path d="M22.5 17.146c-1.02 0-2.02-.157-2.984-.47a1.5 1.5 0 0 0-1.523.368l-2.1 2.104a15.36 15.36 0 0 1-7.188-7.188l2.1-2.1a1.5 1.5 0 0 0 .368-1.523A11.96 11.96 0 0 1 6.85 1.5 1.5 1.5 0 0 0 5.354 0H1.5A1.5 1.5 0 0 0 0 1.5C0 13.317 9.683 23 21.5 23a1.5 1.5 0 0 0 1.5-1.5v-3.854a1.5 1.5 0 0 0-1.5-1.5Z" />
              </svg>
              {profile.phone}
            </a>
          </div>
          <div className="cell-pad-sm">
            <p className="label">Location</p>
            <span className="text-link mt-2 inline-flex min-h-11 items-center gap-2">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4 flex-shrink-0 fill-current"
              >
                <path d="M12 0a9 9 0 0 0-9 9c0 6.75 9 15 9 15s9-8.25 9-15a9 9 0 0 0-9-9Zm0 12.75a3.75 3.75 0 1 1 0-7.5 3.75 3.75 0 0 1 0 7.5Z" />
              </svg>
              {profile.location}
            </span>
          </div>
        </div>

        {/* Animated nickname footer — cursor-reactive variable font, linked to Instagram */}
        <div className="relative h-48 overflow-hidden md:h-80">
          <a
            href="https://www.instagram.com/tiirumiisu/"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 block cursor-pointer cell-pad"
            aria-label="Thiirumiisu on Instagram (@tiirumiisu)"
          >
            <TextPressure
              text="@tiirumiisu"
              flex
              scale
              width
              weight
              italic
              alpha={false}
              stroke={false}
              textColor="var(--ink)"
              minFontSize={64}
            />
          </a>
        </div>
      </div>

    </section>
  );
}
