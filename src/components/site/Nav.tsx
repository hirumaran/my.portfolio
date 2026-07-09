'use client';

import { profile } from '@/data/resume';

const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'Toolbox', href: '#toolbox' },
  { label: 'About', href: '#about' },
] as const;

const SUPERCELL_URL =
  'https://link.clashroyale.com/?supercell_id&p=12-014e66dd-6da6-40d1-b10c-daf2586c1026';

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-paper">
        <nav aria-label="Primary" className="flex h-14 items-stretch">
          {/* Zone 1 — wordmark swaps to Supercell ID on hover */}
          <a
            href={SUPERCELL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="label-wide group relative flex cursor-pointer items-center px-5 text-ink transition-colors duration-200 hover:bg-ink hover:text-paper"
          >
            <span className="relative">
              <span className="group-hover:opacity-0 transition-opacity duration-200">{profile.name}</span>
              <span className="absolute inset-0 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5 flex-shrink-0 fill-current"
                >
                  <path d="M2 19h20v3H2v-3zM3.96 4.49l3.79 5.51L12 5.5l4.25 4.5 3.79-5.51L18.5 13H5.5L3.96 4.49z" />
                </svg>
                Supercell ID
              </span>
            </span>
          </a>

          {/* Availability status — the one sanctioned color in the system */}
          <span className="flex items-center gap-2 border-l-2 border-ink px-5">
            <span
              aria-hidden="true"
              className="h-2 w-2 bg-[#16a34a]"
            />
            <span className="label-wide whitespace-nowrap text-[#15803d]">
              Open to Work
            </span>
          </span>

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

          {/* Zone 3 — CTA cell. Red stands apart from the terminal's dark cell
              so the contact action is always obvious at a glance. */}
          <a
            href="#contact"
            className="label ml-auto flex cursor-pointer items-center border-l-2 border-[#dc2626] bg-[#dc2626] px-5 text-white transition-colors duration-300 ease-[cubic-bezier(0.455,0.03,0.515,0.955)] hover:bg-paper hover:text-[#dc2626] md:ml-0"
          >
            Contact
          </a>
        </nav>
    </header>
  );
}
