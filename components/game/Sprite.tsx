import React from 'react';

type SpriteProps = {
  shirtColor: string;
  hairColor: string;
  gender: 'M' | 'F';
  isPlayer?: boolean;
};

export default function Sprite({ shirtColor, hairColor, gender, isPlayer }: SpriteProps) {
  // A simple but cute Top-Down 2D RPG Character using SVG
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      {/* Drop Shadow */}
      <ellipse cx="20" cy="35" rx="14" ry="5" fill="rgba(0,0,0,0.3)" />

      {/* Shoulders / Body (Top Down View) */}
      <rect 
        x={gender === 'M' ? "8" : "10"} 
        y="12" 
        width={gender === 'M' ? "24" : "20"} 
        height="18" 
        rx="8" 
        ry="8" 
        fill={shirtColor} 
        stroke="#222" 
        strokeWidth="1.5" 
      />

      {/* Hands holding nothing/swinging */}
      <circle cx={gender === 'M' ? "7" : "10"} cy="22" r="4" fill="#fadcbc" stroke="#222" strokeWidth="1" />
      <circle cx={gender === 'M' ? "33" : "30"} cy="22" r="4" fill="#fadcbc" stroke="#222" strokeWidth="1" />

      {/* Head */}
      <circle cx="20" cy="16" r="10" fill="#fadcbc" stroke="#222" strokeWidth="1.5" />

      {/* Hair Top Down */}
      {gender === 'F' ? (
        <path 
           d="M 10 16 C 10 4, 30 4, 30 16 C 32 24, 8 24, 10 16 Z" 
           fill={hairColor} stroke="#222" strokeWidth="1" 
        />
      ) : (
        <path 
           d="M 11 15 C 10 5, 30 5, 29 15 C 29 18, 11 18, 11 15 Z" 
           fill={hairColor} stroke="#222" strokeWidth="1" 
        />
      )}

      {/* Player Indicator Pin */}
      {isPlayer && (
        <path d="M 20 2 L 15 -8 L 25 -8 Z" fill="#ff4d4d" />
      )}
    </svg>
  );
}
