import type { DynamicIslandPresentation } from './root';

type Presets = Record<
  DynamicIslandPresentation,
  { width: number; ratio: number; radius: number }
>;

export const presets: Presets = {
  compact: {
    width: 280,
    ratio: 58 / 280,
    radius: 29,
  },
  expanded: {
    width: 380,
    ratio: 210 / 380,
    radius: 48,
  },
};
