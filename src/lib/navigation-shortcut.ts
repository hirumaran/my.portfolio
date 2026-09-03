'use client';

import { useSyncExternalStore } from 'react';

function getShortcutLabel() {
  const platform = navigator.platform || navigator.userAgent;
  return /Mac|iPhone|iPad|iPod/i.test(platform) ? '⌘ K' : 'Ctrl K';
}

const subscribeToPlatform = () => () => {};
const getServerShortcutLabel = () => '⌘ K';

export function useNavigationShortcutLabel() {
  return useSyncExternalStore(
    subscribeToPlatform,
    getShortcutLabel,
    getServerShortcutLabel,
  );
}
