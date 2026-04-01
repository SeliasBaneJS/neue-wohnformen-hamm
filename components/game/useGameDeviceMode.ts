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

type FullscreenDocument = Document & {
  webkitExitFullscreen?: () => Promise<void> | void;
  webkitFullscreenElement?: Element | null;
};

type FullscreenCapableElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
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

export function getFullscreenElement(): Element | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const fullscreenDocument = document as FullscreenDocument;
  return fullscreenDocument.fullscreenElement ?? fullscreenDocument.webkitFullscreenElement ?? null;
}

export async function requestElementFullscreen(element: HTMLElement): Promise<boolean> {
  const fullscreenElement = element as FullscreenCapableElement;

  try {
    if (fullscreenElement.requestFullscreen) {
      await fullscreenElement.requestFullscreen();
      return true;
    }
  } catch {
    // Ignore and fall back to prefixed APIs where available.
  }

  try {
    if (fullscreenElement.webkitRequestFullscreen) {
      await fullscreenElement.webkitRequestFullscreen();
      return true;
    }
  } catch {
    // Some mobile browsers do not support fullscreen or require a stricter gesture context.
  }

  return false;
}

export async function exitFullscreenIfActive(): Promise<void> {
  if (typeof document === 'undefined') {
    return;
  }

  const fullscreenDocument = document as FullscreenDocument;

  try {
    if (fullscreenDocument.fullscreenElement && fullscreenDocument.exitFullscreen) {
      await fullscreenDocument.exitFullscreen();
      return;
    }

    if (fullscreenDocument.webkitFullscreenElement && fullscreenDocument.webkitExitFullscreen) {
      await fullscreenDocument.webkitExitFullscreen();
    }
  } catch {
    // Exiting fullscreen should fail silently when the browser rejects the request.
  }
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