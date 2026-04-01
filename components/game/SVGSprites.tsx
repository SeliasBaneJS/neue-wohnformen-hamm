import React from 'react';

// Character Top-Down Sprite
export function CharacterSprite({ shirt, hair, gender, isPlayer }: { shirt: string, hair: string, gender: string, isPlayer?: boolean }) {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="24" cy="40" rx="16" ry="6" fill="rgba(0,0,0,0.3)" />
      {/* Body */}
      <rect x={gender === 'M' ? "10" : "12"} y="14" width={gender === 'M' ? "28" : "24"} height="20" rx="8" ry="8" fill={shirt} stroke="#111" strokeWidth="2" />
      {/* Hands */}
      <circle cx="10" cy="24" r="5" fill="#ffdcb3" stroke="#111" strokeWidth="1.5" />
      <circle cx="38" cy="24" r="5" fill="#ffdcb3" stroke="#111" strokeWidth="1.5" />
      {/* Head */}
      <circle cx="24" cy="18" r="12" fill="#ffdcb3" stroke="#111" strokeWidth="2" />
      {/* Hair Top Down */}
      {gender === 'F' ? (
        <path d="M 12 18 C 12 2, 36 2, 36 18 C 40 28, 8 28, 12 18 Z" fill={hair} />
      ) : (
        <path d="M 13 16 C 12 4, 36 4, 35 16 C 35 22, 13 22, 13 16 Z" fill={hair} />
      )}
      {/* Eye indicators (so we know which way they face - assuming facing south/down) */}
      {!isPlayer && (
        <>
          <circle cx="20" cy="22" r="1.5" fill="#333" />
          <circle cx="28" cy="22" r="1.5" fill="#333" />
        </>
      )}
      {isPlayer && (
         <path d="M 24 2 L 18 -6 L 30 -6 Z" fill="#ff3333" stroke="#fff" strokeWidth="1" />
      )}
    </svg>
  );
}

// Grill Top-Down Sprite
export function GrillSprite({ fire }: { fire?: boolean }) {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="65" rx="30" ry="10" fill="rgba(0,0,0,0.4)" />
      {/* Legs */}
      <line x1="25" y1="40" x2="15" y2="70" stroke="#333" strokeWidth="4" strokeLinecap="round" />
      <line x1="55" y1="40" x2="65" y2="70" stroke="#333" strokeWidth="4" strokeLinecap="round" />
      {/* Base Kettle */}
      <circle cx="40" cy="40" r="28" fill="#111" stroke="#333" strokeWidth="2" />
      <circle cx="40" cy="40" r="24" fill="#222" />
      {/* Grid */}
      {[...Array(9)].map((_, i) => (
        <line key={i} x1={18 + i*5.5} y1="20" x2={18 + i*5.5} y2="60" stroke="#555" strokeWidth="2" />
      ))}
      {[...Array(9)].map((_, i) => (
        <line key={`h${i}`} x1="20" y1={18 + i*5.5} x2="60" y2={18 + i*5.5} stroke="#555" strokeWidth="2" />
      ))}
      {/* Fire / Coal */}
      {fire ? (
         <>
           <path d="M 30 50 Q 35 20 40 45 Q 45 15 50 50 Z" fill="#ff4500" opacity="0.8" />
           <path d="M 35 48 Q 40 30 45 48 Z" fill="#ffd700" opacity="0.9" />
           <circle cx="35" cy="40" r="4" fill="#dd3300" />
           <circle cx="45" cy="45" r="5" fill="#dd3300" />
         </>
      ) : (
         <>
           <circle cx="35" cy="40" r="4" fill="#444" />
           <circle cx="45" cy="45" r="5" fill="#444" />
           <circle cx="40" cy="35" r="4" fill="#333" />
         </>
      )}
      {/* Side Shelf */}
      <rect x="66" y="32" width="12" height="16" rx="2" fill="#8b4513" stroke="#4a2509" strokeWidth="2" />
    </svg>
  );
}

// Organic Tree Canopy
export function TreeSprite() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="90" rx="35" ry="15" fill="rgba(0,0,0,0.3)" />
      {/* Trunk (barely visible from top down, mostly just shadow anchor) */}
      <circle cx="60" cy="65" r="10" fill="#3e2723" />
      {/* Leaves Cluster */}
      <path d="M 60 10 Q 80 10 90 30 Q 110 30 110 50 Q 115 70 95 85 Q 80 100 60 100 Q 40 100 25 85 Q 5 70 10 50 Q 10 30 30 30 Q 40 10 60 10 Z" fill="#2e7d32" stroke="#1b5e20" strokeWidth="3" />
      {/* Highlights */}
      <path d="M 60 20 Q 75 20 80 35 Q 95 35 95 50 Q 100 65 85 75 Q 85 50 60 50 Q 35 50 35 75 Q 20 65 25 50 Q 25 35 40 35 Q 45 20 60 20 Z" fill="#4caf50" opacity="0.6" />
      <circle cx="40" cy="40" r="15" fill="#66bb6a" opacity="0.4" />
      <circle cx="75" cy="45" r="18" fill="#66bb6a" opacity="0.4" />
      <circle cx="60" cy="70" r="20" fill="#66bb6a" opacity="0.3" />
    </svg>
  );
}

// Props
export function PropSprite({ type }: { type: 'beer' | 'salad' | 'coal' }) {
  if (type === 'beer') return <div style={{fontSize: '32px', filter:'drop-shadow(0px 5px 2px rgba(0,0,0,0.4))'}}>🍻</div>;
  if (type === 'salad') return <div style={{fontSize: '32px', filter:'drop-shadow(0px 5px 2px rgba(0,0,0,0.4))'}}>🥗</div>;
  if (type === 'coal') return <div style={{fontSize: '32px', filter:'drop-shadow(0px 5px 2px rgba(0,0,0,0.4))'}}>🪨</div>;
  return null;
}

// ==========================================
// PLATFORMER ASSETS
// ==========================================

export function SausageSprite() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40">
      {/* Glow */}
      <circle cx="20" cy="20" r="18" fill="#ffd700" opacity="0.4" />
      <path d="M 10 30 Q 5 20 15 10 Q 25 20 30 10 Q 35 20 25 30 Q 15 20 10 30 Z" fill="#b71c1c" stroke="#5d4037" strokeWidth="2" />
      {/* Grill marks */}
      <line x1="12" y1="20" x2="18" y2="16" stroke="#4e342e" strokeWidth="2" />
      <line x1="18" y1="25" x2="24" y2="21" stroke="#4e342e" strokeWidth="2" />
      <line x1="22" y1="29" x2="28" y2="25" stroke="#4e342e" strokeWidth="2" />
    </svg>
  );
}

export function SteakSprite() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="18" fill="#ffd700" opacity="0.4" />
      <path d="M 8 20 C 8 10, 32 10, 32 20 C 32 28, 25 32, 20 32 C 15 32, 8 28, 8 20 Z" fill="#d32f2f" stroke="#795548" strokeWidth="2" />
      {/* T-Bone */}
      <path d="M 16 12 L 16 26 M 16 16 L 26 16" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function RaccoonSprite({ direction = 1 }: { direction?: number }) {
  return (
    <svg width="50" height="50" viewBox="0 0 50 50" style={{ transform: `scaleX(${direction})` }}>
      {/* Tail - bushy striped */}
      <path d="M 40 28 Q 52 18 48 8" fill="none" stroke="#8d6e63" strokeWidth="7" strokeLinecap="round" />
      <path d="M 42 24 Q 50 18 48 12" fill="none" stroke="#3e2723" strokeWidth="3" strokeLinecap="round" />
      <path d="M 44 20 Q 48 16 47 14" fill="none" stroke="#8d6e63" strokeWidth="3" strokeLinecap="round" />
      {/* Body */}
      <ellipse cx="25" cy="32" rx="14" ry="10" fill="#9e9e9e" />
      <ellipse cx="25" cy="34" rx="10" ry="6" fill="#bdbdbd" />
      {/* Legs */}
      <line x1="16" y1="40" x2="14" y2="48" stroke="#424242" strokeWidth="4" strokeLinecap="round" />
      <line x1="22" y1="42" x2="22" y2="48" stroke="#424242" strokeWidth="4" strokeLinecap="round" />
      <line x1="28" y1="42" x2="28" y2="48" stroke="#424242" strokeWidth="4" strokeLinecap="round" />
      <line x1="34" y1="40" x2="36" y2="48" stroke="#424242" strokeWidth="4" strokeLinecap="round" />
      {/* Head */}
      <circle cx="14" cy="24" r="10" fill="#9e9e9e" />
      {/* Raccoon mask (black eye band) */}
      <path d="M 5 22 Q 14 18 23 22 Q 14 26 5 22 Z" fill="#212121" />
      {/* Eyes inside mask */}
      <circle cx="10" cy="22" r="2.5" fill="#fff" />
      <circle cx="10" cy="22" r="1.2" fill="#111" />
      <circle cx="18" cy="22" r="2.5" fill="#fff" />
      <circle cx="18" cy="22" r="1.2" fill="#111" />
      {/* Ears */}
      <circle cx="8" cy="15" r="4" fill="#757575" />
      <circle cx="8" cy="15" r="2" fill="#e0e0e0" />
      <circle cx="20" cy="15" r="4" fill="#757575" />
      <circle cx="20" cy="15" r="2" fill="#e0e0e0" />
      {/* Nose */}
      <circle cx="6" cy="26" r="2" fill="#212121" />
      {/* Snout */}
      <ellipse cx="8" cy="27" rx="4" ry="3" fill="#e0e0e0" />
    </svg>
  );
}

export function PlatformSprite({ width, height }: { width: number, height: number }) {
  return (
    <div style={{
      width, height,
      backgroundColor: '#8d6e63', // dirt brown
      borderTop: '10px solid #4CAF50', // grass
      borderLeft: '2px solid #5d4037',
      borderRight: '2px solid #5d4037',
      borderBottom: '4px solid #3e2723',
      backgroundImage: 'radial-gradient(#5d4037 15%, transparent 15%)',
      backgroundSize: '20px 20px',
      overflow: 'hidden'
    }} />
  );
}

