'use client';

import { useState } from 'react';
import { skills, strengths } from '@/data/resume';

const CATEGORIES: {
  key: keyof typeof skills;
  label: string;
}[] = [
  { key: 'aiMedia', label: 'AI & INFRASTRUCTURE' },
  { key: 'frameworks', label: 'FRAMEWORKS' },
  { key: 'languages', label: 'LANGUAGES' },
  { key: 'cloud', label: 'CLOUD & TOOLS' },
  { key: 'soft', label: 'COLLABORATION' },
];

/* Items that carry the robotics/AI/real-time story lead their row;
   everything else renders smaller and faded behind them. */
const CORE: Record<keyof typeof skills, string[]> = {
  aiMedia: ['WhisperX', 'Gemini API', 'FFmpeg', 'WebSockets', 'PathPlanner'],
  frameworks: ['FastAPI', 'Node.js'],
  languages: ['Python', 'JavaScript'],
  cloud: ['Azure Cloud'],
  soft: [],
};

export default function Skills() {
  const [openCategory, setOpenCategory] =
    useState<keyof typeof skills | null>('aiMedia');

  return (
    <section id="toolbox" className="border-b-2 border-ink">
      <div className="rule-grid">
        {/* Header row — 02 plaque left, editorial marker right. */}
        <div className="rule-grid bg-ink grid-cols-[1fr_auto]">
          <div className="cell-pad-sm flex items-center">
            <h2 className="label">02 — TOOLBOX</h2>
          </div>
          <div className="cell-pad-sm flex items-center">
            <span className="label-wide md:hidden">FOCUS + INDEX</span>
            <span className="label-wide hidden md:inline">WHAT I WORK WITH</span>
          </div>
        </div>

        {/* A capability-led opening replaces the old wall of technology
            names. Each strength is paired with the experience that proves it,
            so the visual emphasis communicates a point of view rather than
            simply making a few tool names larger. */}
        <div className="rule-grid bg-ink md:hidden" aria-label="Core strengths">
          {strengths.map((strength, index) => (
            <article
              key={strength.title}
              className={`cell-pad flex min-h-[248px] flex-col justify-between gap-8 ${
                index === 0 ? 'cell-ink' : ''
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="label">FOCUS 0{index + 1}</span>
                <span className="label-wide opacity-60">{strength.proof}</span>
              </div>

              <div>
                <h3 className="display text-[clamp(1.9rem,9vw,2.5rem)] leading-[1.05]">
                  {strength.title}
                </h3>
                <p className="mt-3 max-w-[34ch] text-body font-light opacity-75">
                  {strength.description}
                </p>
                <ul
                  className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-current pt-4"
                  aria-label="Key tools"
                >
                  {strength.tools.map((tool) => (
                    <li key={tool} className="label-wide">
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div
          className="toolbox-strengths rule-grid hidden bg-ink md:grid md:grid-flow-row md:auto-cols-auto md:grid-cols-3 md:snap-none md:overflow-visible"
          aria-label="Core strengths"
        >
          {strengths.map((strength, index) => (
            <article
              key={strength.title}
              className={`toolbox-strength cell-pad flex min-h-[360px] snap-start flex-col justify-between gap-12 ${
                index === 0 ? 'cell-ink' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-6">
                <span className="label">CORE 0{index + 1}</span>
                <span className="display-thin text-heading" aria-hidden="true">
                  0{index + 1}
                </span>
              </div>

              <div>
                <h3 className="display text-heading-sm md:text-display">
                  {strength.title}
                </h3>
                <p className="mt-3 max-w-[34ch] text-body-lg font-light">
                  {strength.description}
                </p>

                <div className="mt-8 border-t border-current pt-4">
                  <p className="label">Proven at</p>
                  <p className="label-wide mt-2 leading-relaxed">
                    {strength.proof}
                  </p>
                </div>

                <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2" aria-label="Key tools">
                  {strength.tools.map((tool) => (
                    <li key={tool} className="label-wide">
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="rule-grid bg-ink md:grid-cols-[280px_1fr]">
          <div className="cell-pad-sm flex items-center">
            <span className="label">Working vocabulary</span>
          </div>
          <div className="cell-pad-sm">
            <p className="display max-w-4xl text-subheading font-light">
              The languages, frameworks, and platforms behind the work.
            </p>
          </div>
        </div>

        {/* Mobile uses one-at-a-time disclosure so the complete vocabulary is
            easy to scan without five oversized vertical slabs. */}
        <div className="bg-paper md:hidden">
          {CATEGORIES.map(({ key, label }, index) => {
            const open = openCategory === key;
            return (
              <article key={key} className="border-b-2 border-ink last:border-b-0">
                <button
                  type="button"
                  className="flex min-h-[68px] w-full cursor-pointer items-center gap-4 px-5 text-left focus-visible:outline-offset-[-2px]"
                  aria-expanded={open}
                  aria-controls={`toolbox-panel-${key}`}
                  onClick={() => setOpenCategory(open ? null : key)}
                >
                  <span className="label-wide w-7 shrink-0">0{index + 1}</span>
                  <span className="label flex-1">{label}</span>
                  <span className="label-wide opacity-55">
                    {skills[key].length.toString().padStart(2, '0')}
                  </span>
                  <span
                    className={`display text-subheading transition-transform duration-300 ${
                      open ? 'rotate-45' : ''
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>

                <div
                  id={`toolbox-panel-${key}`}
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.455,0.03,0.515,0.955)] ${
                    open
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0'
                  }`}
                  aria-hidden={!open}
                >
                  <div className="overflow-hidden">
                    <ul className="grid grid-cols-2 gap-x-5 gap-y-3 px-5 pb-6 pt-1">
                      {skills[key].map((item) => {
                        const core = CORE[key].includes(item);
                        return (
                          <li
                            key={item}
                            className={`border-t pt-2 display font-light ${
                              core
                                ? 'border-ink text-body-lg text-ink'
                                : 'border-ink/20 text-body text-ink/55'
                            }`}
                          >
                            {item}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* The desktop vocabulary grid stays exactly as it was. */}
        <div className="rule-grid hidden bg-ink md:grid md:grid-cols-2 xl:grid-cols-5">
          {CATEGORIES.map(({ key, label }) => (
            <div key={key} className="toolbox-category cell-pad-sm">
              <h3 className="label">{label}</h3>
              <ul className="mt-5 space-y-2">
                {skills[key].map((item) => {
                  const core = CORE[key].includes(item);
                  return (
                    <li
                      key={item}
                      className={
                        core
                          ? 'display text-body-lg font-light text-ink'
                          : 'display text-body font-light text-ink/60'
                      }
                    >
                      {item}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
