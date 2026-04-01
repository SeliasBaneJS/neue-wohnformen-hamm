'use client';

import { useEffect, useState } from 'react';

type GameDeviceMode = {
  width: number;
  height: number;
  isPortrait: boolean;
  showMobileControls: boolean;
  isMobilePreview: boolean;
};

type NavigatorWithUserAgentData = Navigator & {
  userAgentData?: {
    mobile?: boolean;
  };
};

const MOBILE_PREVIEW_QUERY = 'mobilePreview';

function isMobileUserAgent(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }

  const navigatorWithUserAgentData = navigator as NavigatorWithUserAgentData;

  if (navigatorWithUserAgentData.userAgentData?.mobile) {
    return true;
  }

  const isIpadLikeDevice = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  if (isIpadLikeDevice) {
    return true;
  }

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

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
  const isMobileDevice = isMobileUserAgent();

  const width = window.innerWidth;
  const height = window.innerHeight;

  return {
    width,
    height,
    isPortrait: height >= width,
    showMobileControls: isMobilePreview || isMobileDevice,
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