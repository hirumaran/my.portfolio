'use client';

import Image from 'next/image';
import { profile, education, activities } from '@/data/resume';

const portraitSrc = '/images/goofy-3.jpg';
const outtakes = [
  { src: '/images/goofy-1.jpg', alt: 'Outtake — Thirumaran pulling a face' },
  { src: '/images/goofy-2.jpg', alt: 'Outtake — Thirumaran unimpressed' },
];

export default function About() {
  return (
    <section id="about" className="border-b-2 border-ink">
      <div className="rule-grid">
        {/* Header row: plaque label left, location marker right. */}
        <div className="rule-grid bg-ink grid-cols-[1fr_auto]">
          <div className="cell-pad-sm">
            <h2 className="label">03 — About</h2>
          </div>
          <div className="cell-pad-sm flex items-center">
            <span className="label-wide">{profile.location}</span>
          </div>
        </div>

        {/* Body: raw portrait cell + copy cell. */}
        <div className="rule-grid bg-ink md:grid-cols-[380px_1fr]">
          {/* Contact-sheet column: the serious print above, the outtakes below. */}
          <div className="rule-grid bg-ink grid-rows-[1fr_auto]">
            <div className="relative min-h-[420px]">
              <Image
                src={portraitSrc}
                alt={profile.name}
                fill
                sizes="(min-width: 768px) 380px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="rule-grid bg-ink grid-cols-2">
              {outtakes.map((frame) => (
                <div key={frame.src} className="relative aspect-square">
                  <Image
                    src={frame.src}
                    alt={frame.alt}
                    fill
                    sizes="(min-width: 768px) 190px, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="cell-pad">
            <p className="display text-subheading md:text-heading-sm font-light max-w-3xl">
              {profile.summary}
            </p>

            <div className="mt-12">
              <h3 className="label">Education</h3>
              <ul className="mt-2">
                {education.map((entry) => (
                  <li
                    key={entry.school}
                    className="hairline-b py-4 grid md:grid-cols-[1fr_auto] gap-1"
                  >
                    <p className="text-body-lg font-light">{entry.school}</p>
                    <p className="label-wide md:text-right">
                      {entry.credential} · {entry.detail}
                    </p>
                    {entry.coursework ? (
                      <p className="text-body font-light mt-1 col-span-full">
                        {entry.coursework}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10">
              <h3 className="label">Beyond the Keyboard</h3>
              <div className="mt-4 flex flex-wrap gap-[2px]">
                {activities.map((activity) => (
                  <span
                    key={activity.name}
                    className="label-wide border-2 border-ink px-3 py-2"
                  >
                    {activity.name} — {activity.role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
