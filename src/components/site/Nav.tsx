'use client';

import { useCallback, useEffect, useState } from 'react';

type SectionItem = {
  id: string;
  num: string;
  label: string;
  href: string;
};

const SECTIONS: readonly SectionItem[] = [
  { id: 'top', num: '00', label: 'Top', href: '#top' },
  { id: 'work', num: '01', label: 'Experiences', href: '#work' },
  { id: 'toolbox', num: '02', label: 'Toolbox', href: '#toolbox' },
  { id: 'about', num: '03', label: 'About', href: '#about' },
  { id: 'contact', num: '04', label: 'Contact', href: '#contact' },
] as const;

export default function Nav() {
  const [activeId, setActiveId] = useState('top');

  useEffect(() => {
    const sectionElements = SECTIONS.flatMap((section) => {
      const element = document.getElementById(section.id);
      return element ? [element] : [];
    });

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .toSorted((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) setActiveId(visible[0].target.id);
      },
      {
        rootMargin: '-46px 0px -58% 0px',
        threshold: [0.08, 0.25, 0.5],
      },
    );

    sectionElements.forEach((element) => observer.observe(element));

    const markTop = () => {
      if (window.scrollY < 80) setActiveId('top');
    };
    window.addEventListener('scroll', markTop, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', markTop);
    };
  }, []);

  const navigate = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, section: SectionItem) => {
      event.preventDefault();
      const target = document.getElementById(section.id);
      if (!target) return;

      const top = Math.max(
        0,
        target.getBoundingClientRect().top + window.scrollY - 46,
      );
      window.scrollTo({
        top,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
      });
      window.history.pushState(null, '', section.href);
      setActiveId(section.id);
    },
    [],
  );

  return (
    <nav
      aria-label="Section navigation"
      className="group/nav sticky top-0 z-[95] hidden h-[46px] select-none border-b-2 border-ink bg-paper md:block"
    >
      <div className="grid h-full grid-cols-[112px_minmax(0,1fr)] xl:grid-cols-[154px_minmax(0,1fr)]">
        <div className="flex items-center justify-between gap-3 border-r-2 border-ink px-4">
          <span className="label">TD</span>
          <span className="label-wide hidden opacity-55 xl:inline">Index</span>
          <span className="h-[2px] w-4 bg-ink" aria-hidden="true" />
        </div>

        <ol className="grid min-w-0 grid-cols-5">
          {SECTIONS.map((section) => {
            const isActive = activeId === section.id;

            return (
              <li
                key={section.id}
                className="min-w-0 border-r border-ink last:border-r-0"
              >
                <a
                  href={section.href}
                  onClick={(event) => navigate(event, section)}
                  aria-current={isActive ? 'location' : undefined}
                  className={`group/item relative flex h-full min-w-0 items-center gap-3 overflow-hidden px-3 transition-colors duration-200 focus-visible:outline-offset-[-2px] lg:px-4 ${
                    isActive
                      ? 'bg-ink text-paper'
                      : 'bg-paper text-ink hover:bg-ink hover:text-paper'
                  }`}
                >
                  <span className="font-term text-[10px] tabular-nums tracking-[0.12em] opacity-70">
                    {section.num}
                  </span>
                  <span
                    className={`label min-w-0 truncate transition-[opacity,transform] duration-200 ${
                      isActive
                        ? 'block translate-y-0 opacity-100'
                        : 'hidden translate-y-0.5 opacity-55 group-hover/item:translate-y-0 group-hover/item:opacity-100 lg:block'
                    }`}
                  >
                    {section.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`ml-auto h-[2px] shrink-0 bg-current transition-[width,opacity] duration-200 ${
                      isActive
                        ? 'w-5 opacity-100'
                        : 'w-2 opacity-35 group-hover/item:w-4 group-hover/item:opacity-100'
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
