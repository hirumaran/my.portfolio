'use client';

import { motion, useScroll, useTransform } from 'motion/react';

export default function ScrollBlur() {
  const { scrollYProgress } = useScroll();

  // Stay invisible at the very top so the current viewport content is crisp.
  // Fade in once the user starts scrolling, then fade out near the bottom.
  const opacity = useTransform(scrollYProgress, [0, 0.04, 0.75, 0.92], [0, 1, 1, 0]);

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 pointer-events-none z-[40] h-[8vh] min-h-[72px] max-h-[130px]"
      style={{
        opacity,
        background: 'linear-gradient(to top, color-mix(in srgb, var(--paper) 55%, transparent) 0%, color-mix(in srgb, var(--paper) 12%, transparent) 50%, transparent 100%)',
        backdropFilter: 'blur(6px) saturate(1.1)',
        WebkitBackdropFilter: 'blur(6px) saturate(1.1)',
        maskImage: 'linear-gradient(to top, black 0%, black 50%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to top, black 0%, black 50%, transparent 100%)',
      }}
      aria-hidden="true"
    />
  );
}
