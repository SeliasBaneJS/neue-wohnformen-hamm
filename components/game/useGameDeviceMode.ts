'use client';

import { useEffect, useState } from 'react';

type GameDeviceMode = {
  width: number;
  height: number;
  isPortrait: boolean;
  showMobileControls: boolean;
  isMobilePreview: boolean;
};

const MOBILE_PREVIEW_QUERY = 'mobilePreview';

function readGameDeviceMode(): GameDeviceMode {
  if (typeof window === 'undefined') {
    return {
      width: 0,
      height: 0,
      isPortrait: false,
      showMobileControls: false,
      isMobilePreview: false,
    };
  }

  const searchParams = new URLSearchParams(window.location.search);
  const isMobilePreview = searchParams.get(MOBILE_PREVIEW_QUERY) === '1';
  const hasTouchLikeInput =
    window.matchMedia('(hover: none), (pointer: coarse)').matches ||
    navigator.maxTouchPoints > 0;

  const width = window.innerWidth;
  const height = window.innerHeight;

  return {
    width,
    height,
    isPortrait: height >= width,
    showMobileControls: isMobilePreview || hasTouchLikeInput,
    isMobilePreview,
  };
}

export function useGameDeviceMode(): GameDeviceMode {
  const [mode, setMode] = useState<GameDeviceMode>(() => readGameDeviceMode());

  useEffect(() => {
    const updateMode = () => setMode(readGameDeviceMode());

    updateMode();
    window.addEventListener('resize', updateMode);

    return () => {
      window.removeEventListener('resize', updateMode);
    };
  }, []);

  return mode;
}

type ScreenOrientationWithLock = ScreenOrientation & {
  lock?: (orientation: 'landscape') => Promise<void>;
  unlock?: () => void;
};

export async function requestLandscapeOrientation(): Promise<void> {
  if (typeof window === 'undefined' || typeof screen === 'undefined') {
    return;
  }

  const orientation = screen.orientation as ScreenOrientationWithLock;
  if (!orientation.lock) {
    return;
  }

  try {
    await orientation.lock('landscape');
  } catch {
    // Some mobile browsers only allow this in fullscreen or do not support it.
  }
}

export function releaseOrientationLock(): void {
  if (typeof window === 'undefined' || typeof screen === 'undefined') {
    return;
  }

  const orientation = screen.orientation as ScreenOrientationWithLock;
  orientation.unlock?.();
}