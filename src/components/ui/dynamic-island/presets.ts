import type { DynamicIslandPresentation } from './root';

type Presets = Record<
  DynamicIslandPresentation,
  { width: number; height: number; radius: string }
>;

export const presets: Presets = {
  compact: {
    width: 290,
    height: 54,
    radius: '0 0 22px 22px',
  },
  expanded: {
    width: 420,
    height: 218,
    radius: '0 0 34px 34px',
  },
};
