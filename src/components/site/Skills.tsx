'use client';

import { skills } from '@/data/resume';

const CATEGORIES: { key: keyof typeof skills; label: string }[] = [
  { key: 'languages', label: 'LANGUAGES' },
  { key: 'frameworks', label: 'FRAMEWORKS' },
  { key: 'aiMedia', label: 'AI & MEDIA' },
  { key: 'cloud', label: 'CLOUD & TOOLS' },
  { key: 'soft', label: 'HUMAN' },
];

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
            <span className="label-wide">WHAT I WORK WITH</span>
          </div>
        </div>

        {/* Five category rows: plaque label left, large display items right. */}
        {CATEGORIES.map(({ key, label }) => (
          <div
            key={key}
            className="group rule-grid bg-ink md:grid-cols-[280px_1fr]"
          >
            <div className="cell-pad-sm">
              <span className="label">{label}</span>
            </div>
            <div className="cell-pad-sm flex flex-wrap items-baseline gap-x-6 gap-y-2">
              {skills[key].map((item) => (
                <span
                  key={item}
                  className="display text-subheading font-light text-ink/60 transition-colors duration-300 ease-[cubic-bezier(0.455,0.03,0.515,0.955)] group-hover:text-ink"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
