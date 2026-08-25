'use client';

import { AnimatePresence, motion, useWillChange } from 'motion/react';
import React, { useContext } from 'react';
import { physics } from './physics';
import { DynamicIslandContext } from './root';
import { presets } from './presets';

export function Container({ children }: React.PropsWithChildren) {
  const { state, toggleState } = useContext(DynamicIslandContext);

  const willChange = useWillChange();
  const bounding = {
    width: presets[state].width,
    height: presets[state].height,
  };

  return (
    <motion.div
      className="macbook-notch flex max-w-[calc(100vw-24px)] items-center justify-center overflow-hidden bg-black text-center text-white"
      initial={false}
      animate={{
        ...bounding,
        borderRadius: presets[state].radius,
        transition: { type: 'spring', ...physics },
      }}
      style={{ willChange, transformOrigin: 'top center' }}
      onClick={toggleState}
      role="button"
      tabIndex={0}
      aria-label={state === 'compact' ? 'Expand music player' : 'Collapse music player'}
      aria-expanded={state === 'expanded'}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleState();
        }
      }}
    >
      <AnimatePresence initial={false}>
        {children}
      </AnimatePresence>
    </motion.div>
  );
}
