'use client';

import React, { createContext, useCallback, useMemo, useState } from 'react';

export type DynamicIslandPresentation = 'compact' | 'expanded';

type DynamicIslandContextValue = {
  state: DynamicIslandPresentation;
  setState: React.Dispatch<React.SetStateAction<DynamicIslandPresentation>>;
  toggleState: () => void;
};

export const DynamicIslandContext = createContext<DynamicIslandContextValue>({
  state: 'compact',
  setState: () => void 0,
  toggleState: () => void 0,
});

type RootProps = React.PropsWithChildren<{
  /** Controlled mode: current state */
  state?: DynamicIslandPresentation;
  /** Controlled mode: state setter */
  onStateChange?: (state: DynamicIslandPresentation) => void;
}>;

export function Root({ children, state: controlledState, onStateChange }: RootProps) {
  const [internalState, setInternalState] = useState<DynamicIslandPresentation>('compact');

  const isControlled = controlledState !== undefined;
  const state = isControlled ? controlledState : internalState;

  const setState = useCallback<React.Dispatch<React.SetStateAction<DynamicIslandPresentation>>>(
    (value) => {
      const next = typeof value === 'function' ? value(state) : value;
      if (isControlled) {
        onStateChange?.(next);
      } else {
        setInternalState(next);
      }
    },
    [isControlled, onStateChange, state],
  );

  const toggleState = useCallback(
    () => setState((prev) => (prev === 'compact' ? 'expanded' : 'compact')),
    [setState],
  );

  const contextValue = useMemo<DynamicIslandContextValue>(
    () => ({ state, setState, toggleState }),
    [state, setState, toggleState],
  );

  return (
    <DynamicIslandContext.Provider value={contextValue}>
      {children}
    </DynamicIslandContext.Provider>
  );
}
