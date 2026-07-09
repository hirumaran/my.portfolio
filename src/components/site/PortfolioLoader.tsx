'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { profile } from '@/data/resume';

const BOOT_DURATION = 4800;
const BOOT_COMPLETE_HOLD = 360;
const EXIT_DURATION = 800;

const bootSteps = [
  { label: 'Mapping the system', threshold: 18 },
  { label: 'Indexing selected work', threshold: 49 },
  { label: 'Calibrating the interface', threshold: 78 },
] as const;

export default function PortfolioLoader() {
  const [progress, setProgress] = useState(5);
  const [isExiting, setIsExiting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const hasDismissed = useRef(false);
  const frameRef = useRef<number | null>(null);
  const exitTimerRef = useRef<number | null>(null);

  const dismiss = useCallback(() => {
    if (hasDismissed.current) return;

    hasDismissed.current = true;

    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
    }

    setProgress(100);
    setIsExiting(true);
    exitTimerRef.current = window.setTimeout(() => {
      document.documentElement.classList.remove('portfolio-loading');
      setIsComplete(true);
    }, EXIT_DURATION);
  }, []);

  useEffect(() => {
    if (isComplete) return;

    const root = document.documentElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reduceMotion ? 90 : BOOT_DURATION;
    let completionTimer: number | null = null;
    let startedAt: number | null = null;

    root.classList.add('portfolio-loading');

    const advance = (now: number) => {
      if (startedAt === null) startedAt = now;

      const elapsed = now - startedAt;
      const ratio = Math.min(elapsed / duration, 1);
      // A linear readout gives each boot-log step enough screen time to be
      // read, instead of racing through the middle under an ease-out curve.
      setProgress(Math.max(5, Math.round(ratio * 100)));

      if (ratio < 1) {
        frameRef.current = window.requestAnimationFrame(advance);
      } else {
        completionTimer = window.setTimeout(
          dismiss,
          reduceMotion ? 0 : BOOT_COMPLETE_HOLD,
        );
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismiss();
    };

    frameRef.current = window.requestAnimationFrame(advance);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      root.classList.remove('portfolio-loading');
      window.removeEventListener('keydown', handleKeyDown);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      if (completionTimer !== null) window.clearTimeout(completionTimer);
      if (exitTimerRef.current !== null) window.clearTimeout(exitTimerRef.current);
    };
  }, [dismiss, isComplete]);

  if (isComplete) return null;

  const activeStep = bootSteps.reduce(
    (lastStep, step, index) => (progress >= step.threshold ? index : lastStep),
    0,
  );
  const loaderStyle = { '--loader-progress': `${progress}%` } as CSSProperties;

  return (
    <section
      aria-label="Portfolio loading screen"
      aria-busy={!isExiting}
      className={`portfolio-loader${isExiting ? ' portfolio-loader--exit' : ''}`}
      style={loaderStyle}
    >
      <p className="sr-only" aria-live="polite">
        Preparing {profile.name}&apos;s portfolio. {progress}% complete.
      </p>

      <header className="portfolio-loader__masthead" aria-hidden="true">
        <span className="portfolio-loader__brand label-wide">{profile.initials} / Portfolio</span>
        <span className="portfolio-loader__edition label">Selected work — 2026</span>
        <span className="portfolio-loader__signal label">
          <i /> {isExiting ? 'Entry ready' : 'System online'}
        </span>
      </header>

      <div className="portfolio-loader__stage" aria-hidden="true">
        <aside className="portfolio-loader__rail label-wide">
          <span>Thirumaran Deepak / Software Engineer</span>
          <span>Boot sequence / 01</span>
        </aside>

        <div className="portfolio-loader__hero">
          <div className="portfolio-loader__coordinates label">
            <span>47° 37&apos; N</span>
            <span>122° 12&apos; W</span>
          </div>

          <div className="portfolio-loader__monogram">
            <span>{profile.initials.charAt(0)}</span>
            <span>{profile.initials.charAt(1)}</span>
          </div>

          <div className="portfolio-loader__caption">
            <span className="label">Making complex things predictable</span>
            <span className="portfolio-loader__pulse" />
          </div>
        </div>

        <aside className="portfolio-loader__log">
          <div className="portfolio-loader__log-heading">
            <span className="label">Boot log</span>
            <span className="label">{String(activeStep + 1).padStart(2, '0')} / 03</span>
          </div>
          <ol>
            {bootSteps.map((step, index) => {
              const isReached = progress >= step.threshold;
              const isActive = index === activeStep && !isExiting;

              return (
                <li
                  className={isReached ? 'is-reached' : ''}
                  data-active={isActive ? 'true' : undefined}
                  key={step.label}
                >
                  <span className="label">{String(index + 1).padStart(2, '0')}</span>
                  <span className="label">{step.label}</span>
                  <span className="portfolio-loader__step-mark">{isReached ? '✓' : '—'}</span>
                </li>
              );
            })}
          </ol>
        </aside>
      </div>

      <footer className="portfolio-loader__footer">
        <div className="portfolio-loader__meter">
          <span className="label">Loading the field</span>
          <div className="portfolio-loader__track">
            <span />
          </div>
          <span className="portfolio-loader__percentage display">{String(progress).padStart(3, '0')}%</span>
        </div>
        <button className="portfolio-loader__skip label" onClick={dismiss} type="button">
          Skip intro <span aria-hidden="true">↗</span>
        </button>
      </footer>
    </section>
  );
}
