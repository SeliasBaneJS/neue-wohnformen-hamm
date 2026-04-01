'use client';
import React from 'react';

type JoypadProps = {
  mode?: 'topdown' | 'platformer';
  onMove?: (dx: number, dy: number) => void;
  onInteract?: () => void;
  onJump?: () => void;
};

export default function Joypad({ mode = 'topdown', onMove = () => {}, onInteract = () => {}, onJump = () => {} }: JoypadProps) {
  const padStyle = "btn btn-dark opacity-75 rounded-pill fw-bold text-white fs-4 d-flex align-items-center justify-content-center";

  if (mode === 'platformer') {
    return (
      <div className="d-flex w-100 justify-content-between p-3" style={{ pointerEvents: 'none' }}>
        {/* Left/Right controls */}
        <div style={{ pointerEvents: 'auto', display: 'flex', gap: '15px', alignItems: 'flex-end', paddingBottom: '10px' }}>
          <button 
            className="btn btn-dark opacity-75 rounded-circle shadow fw-bold fs-3 text-white d-flex align-items-center justify-content-center" 
            style={{ width: '60px', height: '60px' }}
            onPointerDown={() => onMove(-1, 0)} onPointerUp={() => onMove(0, 0)} onPointerLeave={() => onMove(0, 0)}
          >←</button>
          <button 
            className="btn btn-dark opacity-75 rounded-circle shadow fw-bold fs-3 text-white d-flex align-items-center justify-content-center" 
            style={{ width: '60px', height: '60px' }}
            onPointerDown={() => onMove(1, 0)} onPointerUp={() => onMove(0, 0)} onPointerLeave={() => onMove(0, 0)}
          >  →</button>
        </div>

        {/* Jump Button Right Side */}
        <div style={{ pointerEvents: 'auto', alignSelf: 'flex-end', paddingBottom: '10px' }}>
          <button 
            className="btn btn-danger rounded-circle shadow fw-bold fs-5 text-uppercase" 
            style={{ width: '80px', height: '80px', border: '3px solid #fff' }}
            onPointerDown={onJump}
          >
            Jump
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex w-100 justify-content-between p-3" style={{ pointerEvents: 'none' }}>
      {/* D-Pad Left Side */}
      <div style={{ pointerEvents: 'auto', display: 'grid', gridTemplateColumns: 'repeat(3, 50px)', gridTemplateRows: 'repeat(3, 50px)', gap: '5px' }}>
        <div />
        <button className={padStyle} onPointerDown={() => onMove(0, -1)} onPointerUp={() => onMove(0, 0)} onPointerLeave={() => onMove(0, 0)}>↑</button>
        <div />
        <button className={padStyle} onPointerDown={() => onMove(-1, 0)} onPointerUp={() => onMove(0, 0)} onPointerLeave={() => onMove(0, 0)}>←</button>
        {/* Center dot */}
        <div className="bg-dark opacity-25 rounded-circle" />
        <button className={padStyle} onPointerDown={() => onMove(1, 0)} onPointerUp={() => onMove(0, 0)} onPointerLeave={() => onMove(0, 0)}>→</button>
        <div />
        <button className={padStyle} onPointerDown={() => onMove(0, 1)} onPointerUp={() => onMove(0, 0)} onPointerLeave={() => onMove(0, 0)}>↓</button>
      </div>

      {/* Action Button Right Side */}
      <div style={{ pointerEvents: 'auto', alignSelf: 'flex-end', paddingBottom: '20px' }}>
        <button 
          className="btn btn-primary rounded-circle shadow fw-bold fs-5 text-uppercase" 
          style={{ width: '80px', height: '80px' }}
          onClick={onInteract}
        >
          Sprechen
        </button>
      </div>
    </div>
  );
}
