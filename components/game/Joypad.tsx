'use client';
import React from 'react';

type JoypadProps = {
  mode?: 'topdown' | 'platformer';
  onMove?: (dx: number, dy: number) => void;
  onInteract?: () => void;
  onJump?: () => void;
  actionLabel?: string;
};

const buttonTouchStyle = { touchAction: 'none' as const };

export default function Joypad({
  mode = 'topdown',
  onMove = () => {},
  onInteract = () => {},
  onJump = () => {},
  actionLabel = 'Aktion',
}: JoypadProps) {
  const stopMoving = () => onMove(0, 0);
  const createMoveHandlers = (dx: number, dy: number) => ({
    onPointerDown: () => onMove(dx, dy),
    onPointerUp: stopMoving,
    onPointerLeave: stopMoving,
    onPointerCancel: stopMoving,
  });

  const padStyle = 'btn btn-dark bg-opacity-75 rounded-circle shadow fw-bold text-white fs-4 d-flex align-items-center justify-content-center border-0';

  if (mode === 'platformer') {
    return (
      <div className="d-flex w-100 justify-content-between align-items-end px-3 pb-3 pt-2" style={{ pointerEvents: 'none' }}>
        {/* Left/Right controls */}
        <div className="glass-panel-dark px-3 py-2 d-flex gap-3 align-items-center" style={{ pointerEvents: 'auto' }}>
          <button 
            className={padStyle}
            style={{ width: '72px', height: '72px', ...buttonTouchStyle }}
            {...createMoveHandlers(-1, 0)}
          >←</button>
          <button 
            className={padStyle}
            style={{ width: '72px', height: '72px', ...buttonTouchStyle }}
            {...createMoveHandlers(1, 0)}
          >→</button>
        </div>

        {/* Jump Button Right Side */}
        <div className="glass-panel-dark px-3 py-2" style={{ pointerEvents: 'auto' }}>
          <button 
            className="btn btn-danger rounded-circle shadow fw-bold fs-5 text-uppercase" 
            style={{ width: '92px', height: '92px', border: '3px solid #fff', touchAction: 'none' }}
            onPointerDown={onJump}
            onPointerCancel={() => undefined}
          >
            Springen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex w-100 justify-content-between align-items-end px-3 pb-3 pt-2" style={{ pointerEvents: 'none' }}>
      {/* D-Pad Left Side */}
      <div className="glass-panel-dark p-2" style={{ pointerEvents: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 60px)', gridTemplateRows: 'repeat(3, 60px)', gap: '8px' }}>
          <div />
          <button className={padStyle} style={buttonTouchStyle} {...createMoveHandlers(0, -1)}>↑</button>
          <div />
          <button className={padStyle} style={buttonTouchStyle} {...createMoveHandlers(-1, 0)}>←</button>
          <div className="rounded-circle bg-white bg-opacity-25" />
          <button className={padStyle} style={buttonTouchStyle} {...createMoveHandlers(1, 0)}>→</button>
          <div />
          <button className={padStyle} style={buttonTouchStyle} {...createMoveHandlers(0, 1)}>↓</button>
        </div>
      </div>

      {/* Action Button Right Side */}
      <div className="glass-panel-dark px-3 py-2 d-flex flex-column align-items-center gap-2" style={{ pointerEvents: 'auto' }}>
        <span className="small text-uppercase text-white opacity-75">Aktion</span>
        <button 
          className="btn btn-primary rounded-circle shadow fw-bold fs-5 text-uppercase" 
          style={{ width: '92px', height: '92px', touchAction: 'manipulation' }}
          onPointerDown={onInteract}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
