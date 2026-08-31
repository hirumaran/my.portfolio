'use client';

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
  return (
    <section id="toolbox" className="border-b-2 border-ink">
      <div className="rule-grid">
        {/* Header row — 02 plaque left, editorial marker right. */}
        <div className="rule-grid bg-ink grid-cols-[1fr_auto]">
          <div className="cell-pad-sm flex items-center">
            <h2 className="label">02 — TOOLBOX</h2>
          </div>
          <div className="cell-pad-sm flex items-center">
            <span className="label-wide md:hidden">SWIPE →</span>
            <span className="label-wide hidden md:inline">WHAT I WORK WITH</span>
          </div>
        </div>

        {/* A capability-led opening replaces the old wall of technology
            names. Each strength is paired with the experience that proves it,
            so the visual emphasis communicates a point of view rather than
            simply making a few tool names larger. */}
        <div
          className="toolbox-strengths rule-grid grid-flow-col auto-cols-[min(86vw,340px)] snap-x snap-mandatory overflow-x-auto overscroll-x-contain bg-ink md:grid-flow-row md:auto-cols-auto md:grid-cols-3 md:snap-none md:overflow-visible"
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

        {/* The complete toolkit stays available as a compact reference. On a
            phone every category becomes one readable row instead of a label
            row followed by an oversized, uneven cloud of names. */}
        <div className="rule-grid bg-ink md:grid-cols-2 xl:grid-cols-5">
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
