'use client';

import { AnimatePresence, motion } from 'motion/react';

type NowPlayingTickerProps = {
  artist: string;
  currentTrackIndex: number;
  reducedMotion: boolean;
  style: React.CSSProperties;
  title: string;
  totalTracks: number;
};

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
  artist,
  currentTrackIndex,
  reducedMotion,
  title,
  totalTracks,
}: Omit<NowPlayingTickerProps, 'style'>) {
  const trackNumber = String(currentTrackIndex + 1).padStart(2, '0');
  const trackTotal = String(totalTracks).padStart(2, '0');

  return (
    <div className="stock-ticker-cell">
      <span className="stock-ticker-state">
        <span aria-hidden="true">▲</span> Now Playing
      </span>
      <RollingTitle title={title} reducedMotion={reducedMotion} />
      <span className="stock-ticker-artist">{artist}</span>
      <span className="stock-ticker-index">
        TRK {trackNumber}/{trackTotal}
      </span>
    </div>
  );
}

function TickerSequence(props: Omit<NowPlayingTickerProps, 'style'>) {
  return (
    <div className="stock-ticker-sequence">
      <TickerCell {...props} />
      <TickerCell {...props} />
    </div>
  );
}

export default function NowPlayingTicker({
  artist,
  currentTrackIndex,
  reducedMotion,
  style,
  title,
  totalTracks,
}: NowPlayingTickerProps) {
  const tickerProps = {
    artist,
    currentTrackIndex,
    reducedMotion,
    title,
    totalTracks,
  };

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
