'use client';
import React, { useRef, useState } from 'react';

type JoypadProps = {
  mode?: 'topdown' | 'platformer';
  onMove?: (dx: number, dy: number) => void;
  onInteract?: () => void;
  onJump?: () => void;
  actionLabel?: string;
};

type StickOffset = {
  x: number;
  y: number;
};

const buttonTouchStyle = { touchAction: 'none' as const };
const analogStickStyle = { touchAction: 'none' as const, width: '112px', height: '112px' };
const ANALOG_MAX_OFFSET = 30;
const ANALOG_DEAD_ZONE = 10;

function snapAxis(value: number): -1 | 0 | 1 {
  if (value > 0.5) {
    return 1;
  }

  if (value < -0.5) {
    return -1;
  }

  return 0;
}

export default function Joypad({
  mode = 'topdown',
  onMove = () => {},
  onInteract = () => {},
  onJump = () => {},
  actionLabel = 'Aktion',
}: JoypadProps) {
  const [stickOffset, setStickOffset] = useState<StickOffset>({ x: 0, y: 0 });
  const [isStickActive, setIsStickActive] = useState(false);
  const analogStickRef = useRef<HTMLDivElement>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const stopMoving = () => onMove(0, 0);
  const createMoveHandlers = (dx: number, dy: number) => ({
    onPointerDown: () => onMove(dx, dy),
    onPointerUp: stopMoving,
    onPointerLeave: stopMoving,
    onPointerCancel: stopMoving,
  });

  const padStyle = 'btn btn-dark bg-opacity-75 rounded-circle shadow fw-bold text-white fs-4 d-flex align-items-center justify-content-center border-0';

  const resetAnalogStick = () => {
    activePointerIdRef.current = null;
    setIsStickActive(false);
    setStickOffset({ x: 0, y: 0 });
    stopMoving();
  };

  const updateAnalogStick = (clientX: number, clientY: number) => {
    if (!analogStickRef.current) {
      return;
    }

    const rect = analogStickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rawX = clientX - centerX;
    const rawY = clientY - centerY;
    const distance = Math.hypot(rawX, rawY);
    const limitedDistance = distance > 0 ? Math.min(distance, ANALOG_MAX_OFFSET) : 0;
    const offsetScale = distance > 0 ? limitedDistance / distance : 0;
    const knobX = rawX * offsetScale;
    const knobY = rawY * offsetScale;

    setStickOffset({ x: knobX, y: knobY });

    if (distance < ANALOG_DEAD_ZONE) {
      stopMoving();
      return;
    }

    const snappedAngle = Math.round(Math.atan2(rawY, rawX) / (Math.PI / 4)) * (Math.PI / 4);
    onMove(snapAxis(Math.cos(snappedAngle)), snapAxis(Math.sin(snappedAngle)));
  };

  const handleAnalogPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    activePointerIdRef.current = event.pointerId;
    setIsStickActive(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    updateAnalogStick(event.clientX, event.clientY);
  };

  const handleAnalogPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== event.pointerId) {
      return;
    }

    updateAnalogStick(event.clientX, event.clientY);
  };

  const handleAnalogPointerRelease = (event: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    resetAnalogStick();
  };

  const handleAnalogPointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== event.pointerId) {
      return;
    }

    resetAnalogStick();
  };

  if (mode === 'platformer') {
    return (
      <div className="d-flex w-100 justify-content-between align-items-end px-2 pb-2 pt-1" style={{ pointerEvents: 'none' }}>
        {/* Left/Right controls */}
        <div className="glass-panel-dark px-2 py-2 d-flex gap-2 align-items-center" style={{ pointerEvents: 'auto', background: 'rgba(11, 19, 34, 0.42)', backdropFilter: 'blur(12px)' }}>
          <button 
            className={padStyle}
            style={{ width: '64px', height: '64px', fontSize: '1.75rem', backgroundColor: 'rgba(33, 37, 41, 0.78)', ...buttonTouchStyle }}
            {...createMoveHandlers(-1, 0)}
          >←</button>
          <button 
            className={padStyle}
            style={{ width: '64px', height: '64px', fontSize: '1.75rem', backgroundColor: 'rgba(33, 37, 41, 0.78)', ...buttonTouchStyle }}
            {...createMoveHandlers(1, 0)}
          >→</button>
        </div>

        {/* Jump Button Right Side */}
        <div className="glass-panel-dark px-2 py-2 d-flex flex-column align-items-center gap-2" style={{ pointerEvents: 'auto', background: 'rgba(11, 19, 34, 0.42)', backdropFilter: 'blur(12px)' }}>
          <span className="small text-uppercase text-white opacity-75">Springen</span>
          <button 
            className="btn rounded-circle shadow fw-bold text-white border-0" 
            style={{ width: '84px', height: '84px', border: '3px solid rgba(255,255,255,0.92)', touchAction: 'none', backgroundColor: 'rgba(220, 53, 69, 0.86)', fontSize: '2rem', lineHeight: 1, padding: 0 }}
            onPointerDown={onJump}
            onPointerCancel={() => undefined}
            aria-label="Springen"
          >
            ↑
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex w-100 justify-content-between align-items-end px-3 pb-3 pt-2" style={{ pointerEvents: 'none' }}>
      {/* Analog Stick Left Side */}
      <div className="glass-panel-dark px-3 py-2 d-flex flex-column align-items-center gap-2" style={{ pointerEvents: 'auto' }}>
        <span className="small text-uppercase text-white opacity-75">Steuern</span>
        <div
          ref={analogStickRef}
          className="position-relative rounded-circle shadow"
          style={{
            ...analogStickStyle,
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.22), rgba(255,255,255,0.08) 45%, rgba(0,0,0,0.25) 100%)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: 'inset 0 6px 18px rgba(255,255,255,0.12), inset 0 -10px 24px rgba(0,0,0,0.25)',
          }}
          onPointerDown={handleAnalogPointerDown}
          onPointerMove={handleAnalogPointerMove}
          onPointerUp={handleAnalogPointerRelease}
          onPointerCancel={handleAnalogPointerCancel}
          onLostPointerCapture={resetAnalogStick}
        >
          <div
            className="position-absolute top-50 start-50 rounded-circle"
            style={{ width: '70px', height: '70px', border: '1px solid rgba(255,255,255,0.14)', transform: 'translate(-50%, -50%)' }}
          />
          <div
            className="position-absolute top-50 start-50"
            style={{ width: '66px', height: '1px', backgroundColor: 'rgba(255,255,255,0.12)', transform: 'translate(-50%, -50%)' }}
          />
          <div
            className="position-absolute top-50 start-50"
            style={{ width: '1px', height: '66px', backgroundColor: 'rgba(255,255,255,0.12)', transform: 'translate(-50%, -50%)' }}
          />
          <div
            className="position-absolute top-50 start-50 rounded-circle"
            style={{
              width: '46px',
              height: '46px',
              background: 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(208,218,230,0.88))',
              border: '1px solid rgba(255,255,255,0.35)',
              boxShadow: '0 10px 20px rgba(0,0,0,0.25)',
              transform: `translate(calc(-50% + ${stickOffset.x}px), calc(-50% + ${stickOffset.y}px))`,
              transition: isStickActive ? 'none' : 'transform 120ms ease-out',
            }}
          />
        </div>
      </div>

      {/* Action Button Right Side */}
      <div className="glass-panel-dark px-3 py-2 d-flex flex-column align-items-center gap-2" style={{ pointerEvents: 'auto' }}>
        <span className="small text-uppercase text-white opacity-75">Aktion</span>
        <button 
          className="btn btn-primary rounded-circle shadow fw-bold" 
          style={{ width: '92px', height: '92px', touchAction: 'manipulation', fontSize: '0.85rem', lineHeight: 1.1, padding: '0.35rem' }}
          onPointerDown={onInteract}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
