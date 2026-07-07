'use client';

import { profile } from '@/data/resume';

const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'Toolbox', href: '#toolbox' },
  { label: 'About', href: '#about' },
] as const;

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-paper">
        <nav aria-label="Primary" className="flex h-14 items-stretch">
          {/* Zone 1 — wordmark */}
          <a
            href="#top"
            className="label-wide flex cursor-pointer items-center px-5 text-ink"
          >
            {profile.name}
          </a>

          {/* Zone 2 — section links (desktop only) */}
          <div className="hidden flex-1 items-stretch justify-end border-l-2 border-ink md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-link flex h-full items-center px-5"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Zone 3 — inverse CTA cell */}
          <a
            href="#contact"
            className="label ml-auto flex cursor-pointer items-center border-l-2 border-ink bg-ink px-5 text-paper transition-colors duration-300 ease-[cubic-bezier(0.455,0.03,0.515,0.955)] hover:bg-paper hover:text-ink md:ml-0"
          >
            Contact
          </a>
        </nav>
    </header>
  );
}
