import type { DynamicIslandPresentation } from './root';

type Presets = Record<
  DynamicIslandPresentation,
  { width: number; height: number; radius: string }
>;

export const presets: Presets = {
  compact: {
    width: 230,
    height: 44,
    radius: '22px',
  },
  expanded: {
    width: 380,
    height: 210,
    radius: '36px 36px 40px 40px',
  },
};
