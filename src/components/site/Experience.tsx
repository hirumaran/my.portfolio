'use client';

import Image from 'next/image';
import { experience } from '@/data/resume';

type Job = (typeof experience)[number];

/** Museum plaque number in encounter order — position in the resume data. */
function plaqueNumber(job: Job): string {
  return `0${experience.indexOf(job) + 1}`;
}

/** The period is the single source of truth: every role ending in Present
 * automatically receives the live marker, including future additions. */
function isActive(job: Job): boolean {
  return /\bpresent\b/i.test(job.period);
}

function ActiveMarker({ className = '' }: { className?: string }) {
  return (
    <span
      className={`label badge-active shrink-0 items-center gap-2 px-3 py-2 ${className}`}
      aria-label="Currently active position"
    >
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="badge-dot absolute inset-0 animate-ping opacity-30" />
        <span className="badge-dot relative h-2 w-2" />
      </span>
      Active now
    </span>
  );
}

/** Brand marks sit like archival seals inside each experience plaque. The
 * company name remains the accessible label, so repeated logo alt text would
 * only add noise for screen-reader users. */
function ExperienceLogo({ job }: { job: Job }) {
  const isSymbol = job.logoFormat === 'symbol';

  return (
    <div
      className={`logo-plate relative shrink-0 overflow-hidden ${
        isSymbol ? 'h-12 w-12 md:h-14 md:w-14' : 'h-11 w-28 md:h-12 md:w-32'
      }`}
      aria-hidden="true"
    >
      <Image
        src={job.logo}
        alt=""
        fill
        sizes={isSymbol ? '(max-width: 767px) 48px, 56px' : '(max-width: 767px) 112px, 128px'}
        className="object-contain object-right saturate-[.72] opacity-80 transition-[filter,opacity] duration-300 group-hover/experience:saturate-100 group-hover/experience:opacity-100"
      />
    </div>
  );
}

export default function Experience() {
  const featured = experience.filter((job) => job.featured);
  const compact = experience.filter((job) => !job.featured);

  // Year span derived from the data, never hardcoded (e.g. "2022 — 2026").
  const years = experience
    .flatMap((job) => job.period.match(/\d{4}/g) ?? [])
    .map(Number);
  const span = `${Math.min(...years)} — ${Math.max(...years)}`;

  return (
    <section id="work" className="border-b-2 border-ink">
      <div className="rule-grid">
        {/* Header row */}
        <div className="rule-grid bg-ink grid-cols-[1fr_auto]">
          <div className="cell-pad-sm flex items-center">
            <h2 className="label">01 — Experiences</h2>
          </div>
          <div className="cell-pad-sm flex items-center">
            <span className="label-wide">{span}</span>
          </div>
        </div>

        {/* Featured entries — full-width rows, [280px_1fr] nested rule-grid */}
        {featured.map((job) => (
          <div
            key={job.company}
            className="group/experience rule-grid bg-ink md:grid-cols-[280px_1fr]"
          >
            <div className="cell-pad-sm md:px-[45px] md:py-[43px] flex flex-col gap-2">
              <div className="flex items-start justify-between gap-5">
                <span className="display-thin text-heading">
                  {plaqueNumber(job)}
                </span>
                <ExperienceLogo job={job} />
              </div>
              <span className="label">{job.role}</span>
              <span className="label-wide">{job.period}</span>
              {isActive(job) ? (
                <ActiveMarker className="mt-2 inline-flex self-start md:hidden" />
              ) : null}
              <span className="label-wide mt-auto pt-6">
                {job.tech.join(' / ')}
              </span>
            </div>
            <div className="cell-pad">
              <div className="flex items-start justify-between gap-8">
                <h3 className="display min-w-0 text-heading-sm md:text-display">
                  {job.company}
                </h3>
                {isActive(job) ? (
                  <ActiveMarker className="hidden md:inline-flex" />
                ) : null}
              </div>
              <p className="text-body-lg font-light mt-3 max-w-3xl">
                {job.headline}
              </p>
              <details className="group mt-5 md:hidden">
                <summary className="label flex min-h-11 cursor-pointer list-none items-center justify-between border-y border-carbon py-3 [&::-webkit-details-marker]:hidden">
                  Project detail
                  <span aria-hidden="true" className="group-open:hidden">＋</span>
                  <span aria-hidden="true" className="hidden group-open:inline">−</span>
                </summary>
                <ul className="divide-y divide-carbon">
                  {job.points.map((point) => (
                    <li key={point} className="py-3 text-body font-light">
                      {point}
                    </li>
                  ))}
                </ul>
              </details>
              <ul className="mt-6 hidden max-w-3xl divide-y divide-carbon [&>li]:py-3 md:block">
                {job.points.map((point) => (
                  <li key={point} className="text-body font-light">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        {/* Non-featured entries — the two share ONE row, nested md:grid-cols-2 */}
        <div className="rule-grid bg-ink md:grid-cols-2">
          {compact.map((job) => (
            <div key={job.company} className="group/experience cell-pad">
              <div className="flex items-start justify-between gap-6">
                <div className="flex flex-col gap-2">
                  <span className="display-thin text-heading">
                    {plaqueNumber(job)}
                  </span>
                  <span className="label">{job.role}</span>
                  <span className="label-wide">{job.period}</span>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <ExperienceLogo job={job} />
                  {isActive(job) ? <ActiveMarker className="inline-flex" /> : null}
                </div>
              </div>
              <h3 className="display text-heading-sm mt-4">{job.company}</h3>
              <p className="text-body font-light mt-2">{job.headline}</p>
              <details className="group mt-5 md:hidden">
                <summary className="label flex min-h-11 cursor-pointer list-none items-center justify-between border-y border-carbon py-3 [&::-webkit-details-marker]:hidden">
                  Project detail
                  <span aria-hidden="true" className="group-open:hidden">＋</span>
                  <span aria-hidden="true" className="hidden group-open:inline">−</span>
                </summary>
                <ul className="divide-y divide-carbon">
                  {job.points.map((point) => (
                    <li key={point} className="py-3 text-body font-light">
                      {point}
                    </li>
                  ))}
                </ul>
              </details>
              <ul className="mt-6 hidden divide-y divide-carbon [&>li]:py-3 md:block">
                {job.points.map((point) => (
                  <li key={point} className="text-body font-light">
                    {point}
                  </li>
                ))}
              </ul>
              <p className="label-wide mt-6">{job.tech.join(' / ')}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
