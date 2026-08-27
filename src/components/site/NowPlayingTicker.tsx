'use client';

import { AnimatePresence, motion } from 'motion/react';

type NowPlayingTickerProps = {
  artist: string;
  reducedMotion: boolean;
  style: React.CSSProperties;
  title: string;
};

const TICKER_ITEMS = [0, 1, 2, 3, 4, 5] as const;

function RollingTitle({
  reducedMotion,
  title,
}: {
  reducedMotion: boolean;
  title: string;
}) {
  return (
    <span className="stock-ticker-title">
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={title}
          className="stock-ticker-title-value"
          initial={reducedMotion ? false : { opacity: 0, y: '105%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: '-105%' }}
          transition={{
            duration: reducedMotion ? 0 : 0.38,
            ease: [0.455, 0.03, 0.515, 0.955],
          }}
        >
          {title}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function TickerCell({
  reducedMotion,
  title,
}: Pick<NowPlayingTickerProps, 'reducedMotion' | 'title'>) {
  return (
    <div className="stock-ticker-cell">
      <span className="stock-ticker-state">Now Playing</span>
      <RollingTitle title={title} reducedMotion={reducedMotion} />
    </div>
  );
}

function TickerSequence(
  props: Pick<NowPlayingTickerProps, 'reducedMotion' | 'title'>,
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
  reducedMotion,
  style,
  title,
}: NowPlayingTickerProps) {
  const tickerProps = { reducedMotion, title };

  return (
    <>
      <div className="stock-ticker" style={style} aria-hidden="true">
        <div className="stock-ticker-track">
          <TickerSequence {...tickerProps} />
          <TickerSequence {...tickerProps} />
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        Now playing {title} by {artist}.
      </p>
    </>
  );
}
