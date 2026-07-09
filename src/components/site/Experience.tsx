'use client';

import { experience } from '@/data/resume';

type Job = (typeof experience)[number];

/** Museum plaque number (01–04) in encounter order — position in the resume data. */
function plaqueNumber(job: Job): string {
  return `0${experience.indexOf(job) + 1}`;
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
            className="rule-grid bg-ink md:grid-cols-[280px_1fr]"
          >
            <div className="cell-pad-sm md:px-[45px] md:py-[43px] flex flex-col gap-2">
              <span className="display-thin text-heading">
                {plaqueNumber(job)}
              </span>
              <span className="label">{job.role}</span>
              <span className="label-wide">{job.period}</span>
              <span className="label-wide mt-auto pt-6">
                {job.tech.join(' / ')}
              </span>
            </div>
            <div className="cell-pad">
              <h3 className="display text-heading-sm md:text-display">
                {job.company}
              </h3>
              <p className="text-body-lg font-light mt-3 max-w-3xl">
                {job.headline}
              </p>
              <ul className="mt-6 divide-y divide-carbon [&>li]:py-3 max-w-3xl">
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
            <div key={job.company} className="cell-pad">
              <div className="flex flex-col gap-2">
                <span className="display-thin text-heading">
                  {plaqueNumber(job)}
                </span>
                <span className="label">{job.role}</span>
                <span className="label-wide">{job.period}</span>
              </div>
              <h3 className="display text-heading-sm mt-4">{job.company}</h3>
              <p className="text-body font-light mt-2">{job.headline}</p>
              <ul className="mt-6 divide-y divide-carbon [&>li]:py-3">
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
