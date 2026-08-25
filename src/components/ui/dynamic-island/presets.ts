import type { DynamicIslandPresentation } from './root';

type Presets = Record<
  DynamicIslandPresentation,
  { width: number; height: number; radius: string }
>;

export const presets: Presets = {
  compact: {
    width: 230,
    height: 44,
    radius: '0 0 16px 16px',
  },
  expanded: {
    width: 380,
    height: 210,
    radius: '0 0 30px 30px',
  },
};
