'use client';

import { stats } from '@/data/resume';

export default function Impact() {
  return (
    <section aria-label="Impact in numbers" className="border-b-2 border-ink">
      <div className="rule-grid grid-cols-2 md:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="cell-ink flex min-h-[180px] flex-col justify-between gap-6 p-5 md:px-[45px] md:py-[43px]"
          >
            <span className="label text-paper">IMPACT 0{i + 1}</span>
            <div>
              <p className="display-thin text-[clamp(40px,6vw,72px)] text-paper">
                {stat.prefix}
                {stat.value}
                {stat.suffix}
              </p>
              <p className="label-wide mt-2 max-w-[24ch] text-paper">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
