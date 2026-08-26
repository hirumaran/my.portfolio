'use client';

import { skills } from '@/data/resume';

const CATEGORIES: {
  key: keyof typeof skills;
  label: string;
  hero?: boolean;
}[] = [
  { key: 'aiMedia', label: 'AI & INFRASTRUCTURE', hero: true },
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
            <span className="label-wide">WHAT I WORK WITH</span>
          </div>
        </div>

        {/* Category rows: AI & infrastructure first at hero scale,
            the rest at standard display scale. */}
        {CATEGORIES.map(({ key, label, hero }) => (
          <div
            key={key}
            className="group rule-grid bg-ink md:grid-cols-[280px_1fr]"
          >
            <div className="cell-pad-sm flex items-center">
              <span
                className={
                  hero
                    ? 'label text-ink'
                    : 'label text-ink/60 transition-colors duration-300 group-hover:text-ink'
                }
              >
                {label}
              </span>
            </div>
            <div
              className={`cell-pad-sm flex flex-wrap items-baseline gap-x-6 gap-y-2 ${
                hero ? 'md:py-8' : ''
              }`}
            >
              {skills[key].map((item) => {
                const core = CORE[key].includes(item);
                return (
                  <span
                    key={item}
                    className={
                      core
                        ? 'display text-heading-sm font-light text-ink transition-colors duration-300 ease-[cubic-bezier(0.455,0.03,0.515,0.955)]'
                        : 'display text-body-lg font-light text-ink/40 transition-colors duration-300 ease-[cubic-bezier(0.455,0.03,0.515,0.955)] group-hover:text-ink/80'
                    }
                  >
                    {item}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
