'use client';

import { useSyncExternalStore } from 'react';
import { profile } from '@/data/resume';
import TextPressure from '@/components/TextPressure';

const DESKTOP_QUERY = '(min-width: 768px)';

const subscribeToDesktopViewport = (onChange: () => void) => {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};

const getDesktopViewportSnapshot = () =>
  window.matchMedia(DESKTOP_QUERY).matches;

const getServerDesktopViewportSnapshot = () => false;

export default function Contact() {
  const telHref = `tel:${profile.phone.replace(/\D/g, '')}`;
  const isDesktopViewport = useSyncExternalStore(
    subscribeToDesktopViewport,
    getDesktopViewportSnapshot,
    getServerDesktopViewportSnapshot,
  );

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
            <span className="label-wide text-[#15803d] md:hidden">
              Available
            </span>
            <span className="label-wide hidden text-[#15803d] md:inline">
              {profile.availability}
            </span>
          </div>
        </div>

        {/* Headline */}
        <div className="cell-pad">
          <h2 className="display-thin max-w-5xl text-[clamp(2.75rem,12vw,4.25rem)] md:text-[clamp(2.5rem,7vw,6rem)]">
            Building something? Let’s talk.
          </h2>
        </div>

        {/* Phone-only action deck. The mobile footer is deliberately compact:
            primary actions stay within thumb reach, labels never run into the
            viewport edge, and the page ends with a decisive social plate
            instead of a large empty canvas. */}
        <div className="rule-grid bg-ink md:hidden">
          <div className="cell-pad">
            <p className="label">Direct line</p>
            <a
              href={`mailto:${profile.email}`}
              className="mt-4 flex min-h-14 items-end justify-between gap-5 border-b border-ink pb-3"
            >
              <span className="display min-w-0 break-all text-[clamp(1.65rem,7.4vw,2.15rem)] leading-[1.05]">
                {profile.email}
              </span>
              <span className="display shrink-0 text-heading-sm" aria-hidden="true">
                ↗
              </span>
            </a>
          </div>

          <aside aria-labelledby="mobile-resume-title" className="cell-pad-sm">
            <div className="flex items-start gap-4">
              <div
                aria-hidden="true"
                className="relative h-[62px] w-[50px] shrink-0 text-ink"
              >
                <svg viewBox="0 0 70 88" fill="none" className="h-full w-full">
                  <path
                    d="M1 1H46L69 24V87H1V1Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path d="M46 1V24H69" stroke="currentColor" strokeWidth="2" />
                  <path d="M13 42H57" stroke="currentColor" strokeWidth="2" />
                  <path d="M13 52H49" stroke="currentColor" strokeWidth="2" />
                  <path d="M13 62H55" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-4">
                  <p className="label">Portfolio attachment</p>
                  <span className="label-wide opacity-55">PDF · 02P</span>
                </div>
                <h3
                  id="mobile-resume-title"
                  className="display mt-2 text-subheading font-light"
                >
                  Résumé
                </h3>
                <p className="mt-1 text-body-sm font-light text-ink/60">
                  Experience, education, and technical work.
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-[2px] bg-ink">
              <a
                href={profile.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="label-wide flex min-h-12 items-center justify-between bg-paper px-4 focus-visible:outline-offset-[-2px]"
              >
                View <span aria-hidden="true">↗</span>
              </a>
              <a
                href={profile.resume}
                download={profile.resumeDownloadName}
                className="label-wide flex min-h-12 items-center justify-between bg-paper px-4 focus-visible:outline-offset-[-2px]"
              >
                Download <span aria-hidden="true">↓</span>
              </a>
            </div>
          </aside>

          <div className="grid grid-cols-2 gap-[2px] bg-ink">
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[124px] flex-col justify-between bg-paper p-5 focus-visible:outline-offset-[-2px]"
            >
              <span className="flex items-center justify-between gap-3">
                <span className="label">LinkedIn</span>
                <span className="display text-body-lg" aria-hidden="true">↗</span>
              </span>
              <span className="label-wide break-words leading-relaxed opacity-65">
                thirumaran-deepak
              </span>
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[124px] flex-col justify-between bg-paper p-5 focus-visible:outline-offset-[-2px]"
            >
              <span className="flex items-center justify-between gap-3">
                <span className="label">GitHub</span>
                <span className="display text-body-lg" aria-hidden="true">↗</span>
              </span>
              <span className="label-wide break-words leading-relaxed opacity-65">
                /hirumaran
              </span>
            </a>
            <a
              href={telHref}
              className="flex min-h-[124px] flex-col justify-between bg-paper p-5 focus-visible:outline-offset-[-2px]"
            >
              <span className="flex items-center justify-between gap-3">
                <span className="label">Call</span>
                <span className="display text-body-lg" aria-hidden="true">↗</span>
              </span>
              <span className="label-wide leading-relaxed opacity-65">
                {profile.phone}
              </span>
            </a>
            <div className="flex min-h-[124px] flex-col justify-between bg-paper p-5">
              <span className="label">Based in</span>
              <span className="label-wide leading-relaxed opacity-65">
                {profile.location}
              </span>
            </div>
          </div>

          <a
            href="https://www.instagram.com/tiirumiisu/"
            target="_blank"
            rel="noopener noreferrer"
            className="cell-ink flex min-h-[154px] flex-col justify-between p-5 focus-visible:outline-paper focus-visible:outline-offset-[-4px]"
            aria-label="Thiirumiisu on Instagram (@tiirumiisu)"
          >
            <span className="flex items-center justify-between gap-4">
              <span className="label">Instagram</span>
              <span className="label-wide opacity-60">Open profile ↗</span>
            </span>
            <span className="display-thin whitespace-nowrap text-[clamp(3rem,14vw,4rem)] leading-none">
              @tiirumiisu
            </span>
          </a>
        </div>

        {/* Mailing + resume row — the document plate occupies the formerly
            empty right side while stacking cleanly on smaller screens. */}
        <div className="rule-grid hidden bg-ink md:grid lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="cell-pad min-w-0">
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

          <aside
            aria-labelledby="resume-title"
            className="group cell-pad flex min-h-[260px] flex-col justify-between gap-8 overflow-hidden"
          >
            <div className="flex items-start justify-between gap-6">
              <div
                aria-hidden="true"
                className="relative h-[88px] w-[70px] shrink-0 text-ink transition-colors duration-200 group-hover:bg-ink group-hover:text-paper"
              >
                <svg
                  viewBox="0 0 70 88"
                  fill="none"
                  className="absolute inset-0 h-full w-full"
                >
                  <path
                    d="M1 1H46L69 24V87H1V1Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path d="M46 1V24H69" stroke="currentColor" strokeWidth="2" />
                  <path d="M13 42H57" stroke="currentColor" strokeWidth="2" />
                  <path d="M13 52H49" stroke="currentColor" strokeWidth="2" />
                  <path d="M13 62H55" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span className="label absolute inset-x-0 bottom-2 text-center">
                  PDF
                </span>
              </div>

              <div className="text-right">
                <p className="label">Portfolio Attachment</p>
                <p className="label-wide mt-2">02 pages · Sep 2026</p>
              </div>
            </div>

            <div>
              <h3 id="resume-title" className="display text-heading-sm font-light">
                Résumé
              </h3>
              <p className="mt-1 text-body font-light text-ink/60">
                Experience, education, and technical work — the printable cut.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-[2px] border-2 border-ink bg-ink">
              <a
                href={profile.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="label-wide flex min-h-12 items-center justify-between bg-paper px-3 transition-colors hover:bg-ink hover:text-paper focus-visible:bg-ink focus-visible:text-paper focus-visible:outline-none"
              >
                View
                <span aria-hidden="true">↗</span>
              </a>
              <a
                href={profile.resume}
                download={profile.resumeDownloadName}
                className="label-wide flex min-h-12 items-center justify-between bg-paper px-3 transition-colors hover:bg-ink hover:text-paper focus-visible:bg-ink focus-visible:text-paper focus-visible:outline-none"
              >
                Download
                <span aria-hidden="true">↓</span>
              </a>
            </div>
          </aside>
        </div>

        {/* Meta row */}
        <div className="rule-grid hidden bg-ink md:grid md:grid-cols-4">
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

        {/* TextPressure stays unchanged on desktop and is never mounted into
            the phone layout, where its wide reactive canvas is a poor fit. */}
        <div className="relative hidden overflow-hidden md:block md:h-80">
          {isDesktopViewport ? (
            <a
              href="https://www.instagram.com/tiirumiisu/"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 hidden cursor-pointer cell-pad md:block"
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
          ) : null}
        </div>
      </div>

    </section>
  );
}
