'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useNavigationShortcutLabel } from '@/lib/navigation-shortcut';

type NowPlayingTickerProps = {
  artist: string;
  isPlaying: boolean;
  reducedMotion: boolean;
  style: React.CSSProperties;
  title: string;
};

const TICKER_ITEMS = [0, 1, 2, 3, 4, 5] as const;

function RollingTitle({
  isPlaying,
  reducedMotion,
  shortcutLabel,
  title,
}: {
  isPlaying: boolean;
  reducedMotion: boolean;
  shortcutLabel: string;
  title: string;
}) {
  return (
    <span className="stock-ticker-title">
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={`${isPlaying ? 'playing' : 'idle'}-${title}-${shortcutLabel}`}
          className="stock-ticker-title-value"
          initial={reducedMotion ? false : { opacity: 0, y: '105%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: '-105%' }}
          transition={{
            duration: reducedMotion ? 0 : 0.38,
            ease: [0.455, 0.03, 0.515, 0.955],
          }}
        >
          {isPlaying ? (
            title
          ) : (
            <>
              <span className="md:hidden">{title}</span>
              <span className="hidden md:inline">Press {shortcutLabel}</span>
            </>
          )}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function TickerCell({
  isPlaying,
  reducedMotion,
  shortcutLabel,
  title,
}: Pick<NowPlayingTickerProps, 'isPlaying' | 'reducedMotion' | 'title'> & {
  shortcutLabel: string;
}) {
  return (
    <div className="stock-ticker-cell">
      <span className="stock-ticker-state">
        {isPlaying ? (
          'Now Playing'
        ) : (
          <>
            <span className="md:hidden">Paused</span>
            <span className="hidden md:inline">Navigate</span>
          </>
        )}
      </span>
      <RollingTitle
        isPlaying={isPlaying}
        title={title}
        reducedMotion={reducedMotion}
        shortcutLabel={shortcutLabel}
      />
    </div>
  );
}

function TickerSequence(
  props: Pick<NowPlayingTickerProps, 'isPlaying' | 'reducedMotion' | 'title'> & {
    shortcutLabel: string;
  },
) {
  return (
    <div className="stock-ticker-sequence">
      {TICKER_ITEMS.map((item) => (
        <TickerCell key={item} {...props} />
      ))}
    </div>
  );
}

export default function NowPlayingTicker({
  artist,
  isPlaying,
  reducedMotion,
  style,
  title,
}: NowPlayingTickerProps) {
  const shortcutLabel = useNavigationShortcutLabel();
  const tickerProps = { isPlaying, reducedMotion, shortcutLabel, title };

  return (
    <>
      <div className="stock-ticker" style={style} aria-hidden="true">
        <div className="stock-ticker-track">
          <TickerSequence {...tickerProps} />
          <TickerSequence {...tickerProps} />
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {isPlaying
          ? `Now playing ${title} by ${artist}.`
          : `Music paused. On desktop, press ${shortcutLabel} to open navigation.`}
      </p>
    </>
  );
}
