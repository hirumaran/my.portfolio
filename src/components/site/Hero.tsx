'use client';

import Image from 'next/image';
import Terminal from '@/components/site/Terminal';
import { experience, profile } from '@/data/resume';

export default function Hero() {
  const current = experience[0];
  const previous = experience[1];

  return (
    <section id="top" className="border-b-2 border-ink">
      <div className="rule-grid md:grid-cols-[1fr_minmax(280px,380px)_320px] md:min-h-[calc(100dvh-56px-2px)]">
        {/* Main cell */}
        <div className="cell-pad flex flex-col justify-between gap-12">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <span className="label">{profile.role} — Portfolio</span>
            <span className="label-wide">Est. {profile.location}</span>
          </div>

          <div>
            <h1 className="display-thin text-[clamp(3rem,10vw,8.5rem)]">
              <span className="block">{profile.firstName}</span>
              <span className="block">{profile.lastName}</span>
            </h1>
            <p className="display text-subheading md:text-heading-sm max-w-2xl font-light mt-6">
              {profile.tagline}
            </p>
          </div>

          <div className="flex flex-wrap gap-[2px]">
            <a className="btn-inverse" href="#work">
              Selected Work →
            </a>
            <a className="btn-outline" href="#contact">
              Get in Touch
            </a>
          </div>
        </div>

        {/* Portrait cell — raw print beside the name, museum style */}
        <div className="relative min-h-[440px] md:min-h-0">
          <Image
            src="/images/hero.jpg"
            alt={profile.name}
            fill
            preload
            sizes="(min-width: 768px) 380px, 100vw"
            className="object-cover"
          />
        </div>

        {/* Right rail: three stacked sub-cells with 2px rules between rows */}
        <div className="rule-grid bg-ink grid-rows-[auto_1fr_auto]">
          <div className="cell-pad-sm">
            <span className="label">Currently</span>
            <p className="text-body font-light mt-2">
              Building {profile.currentProject} at {current.company}
            </p>
            <p className="label-wide mt-1">Prev. {previous.company}</p>
          </div>

          <div className="cell-ink min-h-[420px] overflow-hidden md:min-h-0">
            <Terminal />
          </div>

          <div className="cell-pad-sm">
            <span className="label">Status</span>
            <p className="text-body font-light mt-2">
              Looking for an internship where I can own something. I answer
              email fast.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
