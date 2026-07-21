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
    height: presets[state].ratio * presets[state].width,
  };

  return (
    <motion.div
      className="flex items-center justify-center mx-auto text-center text-white transition duration-300 ease-in-out bg-black shadow-2xl overflow-hidden"
      animate={{
        ...bounding,
        borderRadius: presets[state].radius,
        transition: { type: 'spring', ...physics },
      }}
      style={{ willChange }}
      onClick={toggleState}
      role="button"
      tabIndex={0}
      aria-label={state === 'compact' ? 'Expand music player' : 'Collapse music player'}
      aria-expanded={state === 'expanded'}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleState();
        }
      }}
    >
      <AnimatePresence mode="wait">
        {children}
      </AnimatePresence>
    </motion.div>
  );
}
