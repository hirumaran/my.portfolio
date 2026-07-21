'use client';

import { motion } from 'motion/react';
import type { CSSProperties } from 'react';
import { useMusicPlayer, formatTime } from '@/components/site/MusicPlayerContext';
import { DynamicIsland } from '@/components/ui/dynamic-island';

/* ── Equalizer ── */

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function getLoopingRandomInt(max: number, length: number, base: number) {
  const randoms: number[] = [];
  for (let i = 0; i < length - 1; i++) {
    randoms.push((getRandomInt(max) - max) / 2 + (base / 100) * max);
  }
  randoms.push(randoms[0]!);
  return randoms;
}

function Stick({ length = 50, isPlaying = false }: { length?: number; isPlaying?: boolean }) {
  return (
    <motion.div
      className="w-0.5 shrink-0 rounded-full bg-neutral-50"
      style={{ height: isPlaying ? undefined : 6 }}
      animate={isPlaying ? { height: getLoopingRandomInt(28, 6, length) } : { height: 6 }}
      transition={
        isPlaying
          ? {
              duration: 1.06,
              ease: 'easeInOut',
              times: [0.2, 0.3, 0.5, 0.7, 1.1, 1.3, 1.7],
              repeat: Infinity,
            }
          : { duration: 0.25, ease: 'easeOut' }
      }
    />
  );
}

function Equalizer({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="flex items-center gap-0.5">
      <Stick length={42} isPlaying={isPlaying} />
      <Stick length={62} isPlaying={isPlaying} />
      <Stick length={50} isPlaying={isPlaying} />
      <Stick length={70} isPlaying={isPlaying} />
      <Stick length={56} isPlaying={isPlaying} />
      <Stick length={40} isPlaying={isPlaying} />
    </div>
  );
}

/* ── Artwork ── */

function MiniArtwork({ src }: { src: string }) {
  return (
    <DynamicIsland.Box hide="expanded">
      <div className="h-8 w-8 overflow-hidden"
        style={{ borderRadius: '30%' }}
      >
        <img src={src} alt="" className="h-full w-full object-cover" />
      </div>
    </DynamicIsland.Box>
  );
}

function Artwork({ src }: { src: string }) {
  return (
    <DynamicIsland.Box hide="compact">
      <div className="h-16 w-16 overflow-hidden"
        style={{ borderRadius: '30%' }}
      >
        <img src={src} alt="" className="h-full w-full object-cover" />
      </div>
    </DynamicIsland.Box>
  );
}

/* ── Icons ── */

function PlayIcon({ className = 'h-12 w-12' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 28" className={`${className} fill-current`}>
      <path
        d="M10.345 23.287c.415 0 .763-.15 1.22-.407l12.742-7.404c.838-.481 1.178-.855 1.178-1.46 0-.599-.34-.972-1.178-1.462L11.565 5.158c-.457-.265-.805-.407-1.22-.407-.789 0-1.345.606-1.345 1.57V21.71c0 .971.556 1.577 1.345 1.577z"
        fill="currentColor"
        fillRule="nonzero"
      />
    </svg>
  );
}

function PauseIcon({ className = 'h-12 w-12' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 28" className={`${className} fill-current`}>
      <path
        d="M6 5h6v18H6V5Zm14 0h6v18h-6V5Z"
        fill="currentColor"
        fillRule="nonzero"
      />
    </svg>
  );
}

function SkipIcon({ className = 'h-12 w-12' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 28" className={`${className} fill-current`}>
      <path
        d="M18.14 20.68c.365 0 .672-.107 1.038-.323l8.508-4.997c.623-.365.938-.814.938-1.37 0-.564-.307-.988-.938-1.361l-8.508-4.997c-.366-.216-.68-.324-1.046-.324-.73 0-1.337.556-1.337 1.569v4.773c-.108-.399-.406-.73-.904-1.021L7.382 7.632c-.357-.216-.672-.324-1.037-.324-.73 0-1.345.556-1.345 1.569v10.235c0 1.013.614 1.569 1.345 1.569.365 0 .68-.108 1.037-.324l8.509-4.997c.49-.29.796-.631.904-1.038v4.79c0 1.013.615 1.569 1.345 1.569z"
        fill="currentColor"
        fillRule="nonzero"
      />
    </svg>
  );
}

/* ── Main ── */

export default function MusicIsland() {
  const {
    isPlaying,
    currentTime,
    duration,
    status,
    expanded,
    setExpanded,
    currentTrack,
    togglePlayback,
    handleSeek,
    previousTrack,
    nextTrack,
  } = useMusicPlayer();

  const diState = expanded ? 'expanded' : 'compact';
  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <DynamicIsland.Root
      state={diState}
      onStateChange={(s) => setExpanded(s === 'expanded')}
    >
      <DynamicIsland.Container>
        {/* ── Compact ── */}
        <DynamicIsland.CompactContent
          key="compact"
          className="flex w-full items-center justify-between px-3"
        >
          <MiniArtwork src={currentTrack.cover} />
          <div className="flex-1 min-w-0 px-3 text-left">
            <p className="overflow-hidden text-sm font-medium leading-tight text-white truncate whitespace-nowrap">
              {currentTrack.title}
            </p>
          </div>
          <Equalizer isPlaying={isPlaying} />
        </DynamicIsland.CompactContent>

        {/* ── Expanded ── */}
        <DynamicIsland.ExpandedContent
          key="expanded"
          className="w-full h-full p-5"
        >
          {/* Song info row */}
          <DynamicIsland.Box
            hide="compact"
            className="flex items-center gap-5"
          >
            <Artwork src={currentTrack.cover} />
            <div className="flex-1 min-w-0 text-left">
              <p className="overflow-hidden text-lg font-medium leading-tight text-white truncate whitespace-nowrap">
                {currentTrack.title}
              </p>
              <p className="overflow-hidden text-lg leading-tight truncate text-neutral-400 whitespace-nowrap">
                {currentTrack.artist}
              </p>
            </div>
            <Equalizer isPlaying={isPlaying} />
          </DynamicIsland.Box>

          {/* Track progress */}
          <DynamicIsland.Box
            hide="compact"
            className="flex items-center gap-4 mt-5 mb-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xs text-neutral-400 tabular-nums">
              {formatTime(currentTime)}
            </div>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={(e) => handleSeek(parseFloat(e.target.value))}
              className="music-progress music-progress--light w-full appearance-none"
              style={{ '--music-progress': `${progress}%` } as CSSProperties}
              aria-label="Seek"
            />
            <div className="text-xs text-neutral-400 tabular-nums">
              -{formatTime(duration - currentTime)}
            </div>
          </DynamicIsland.Box>

          {/* Controls */}
          <DynamicIsland.Box
            hide="compact"
            className="grid items-center justify-center grid-cols-5 gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div />
            <button
              type="button"
              aria-label="Previous"
              className="flex text-neutral-300 hover:text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                previousTrack();
              }}
            >
              <SkipIcon className="h-12 w-12 m-auto rotate-180" />
            </button>
            <button
              type="button"
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="flex text-white hover:text-neutral-300 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                togglePlayback();
              }}
            >
              {isPlaying ? <PauseIcon className="h-12 w-12 m-auto" /> : <PlayIcon className="h-12 w-12 m-auto" />}
            </button>
            <button
              type="button"
              aria-label="Next"
              className="flex text-neutral-300 hover:text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                nextTrack();
              }}
            >
              <SkipIcon className="h-12 w-12 m-auto" />
            </button>
          </DynamicIsland.Box>

          {/* Status (screen reader only) */}
          <p className="sr-only" role="status" aria-live="polite">
            {status}
          </p>
        </DynamicIsland.ExpandedContent>
      </DynamicIsland.Container>
    </DynamicIsland.Root>
  );
}
