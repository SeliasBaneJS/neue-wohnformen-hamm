'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CharacterSprite, SausageSprite, SteakSprite, RaccoonSprite, PlatformSprite } from './SVGSprites';
import Joypad from './Joypad';
import { releaseOrientationLock, requestLandscapeOrientation, useGameDeviceMode } from './useGameDeviceMode';

// --- Level Data ---
const LEVEL_END_X = 3500;
const GAME_HEIGHT = 700;
const GROUND_Y = 550;
const LEVEL = {
  platforms: [
    // Ground segments (tall so they fill to bottom)
    { id: 'g1', x: 0, y: GROUND_Y, w: 800, h: 150 },
    { id: 'p1', x: 400, y: 420, w: 150, h: 30 },
    { id: 'p2', x: 650, y: 340, w: 120, h: 30 },
    { id: 'g2', x: 950, y: GROUND_Y, w: 600, h: 150 },
    { id: 'p3', x: 1100, y: 420, w: 140, h: 30 },
    { id: 'p4', x: 1350, y: 340, w: 140, h: 30 },
    { id: 'g3', x: 1700, y: GROUND_Y, w: 400, h: 150 },
    { id: 'p5', x: 1850, y: 420, w: 120, h: 30 },
    { id: 'g4', x: 2300, y: GROUND_Y, w: 1200, h: 150 },
  ],
  items: [
    { id: 's1', type: 'sausage', x: 450, y: 370, collected: false },
    { id: 'st1', type: 'steak', x: 690, y: 290, collected: false },
    { id: 's2', type: 'sausage', x: 1150, y: 370, collected: false },
    { id: 'st2', type: 'steak', x: 1400, y: 290, collected: false },
    { id: 's3', type: 'sausage', x: 1880, y: 370, collected: false },
    { id: 'st3', type: 'steak', x: 2500, y: 500, collected: false },
  ],
  enemies: [
    { id: 'e1', x: 600, y: 500, minX: 400, maxX: 750, dir: 1, dead: false },
    { id: 'e2', x: 1200, y: 500, minX: 1000, maxX: 1400, dir: -1, dead: false },
    { id: 'e3', x: 1800, y: 500, minX: 1750, maxX: 2000, dir: 1, dead: false },
    { id: 'e4', x: 2600, y: 500, minX: 2400, maxX: 3000, dir: -1, dead: false },
  ]
};

// --- Physics Constants ---
const GRAVITY = 1500;
const JUMP_FORCE = -600;
const MOVE_SPEED = 300;
const ENEMY_SPEED = 100;
const PLAYER_W = 40;
const PLAYER_H = 48;

type PlatformerProps = {
  onWin: (score: number) => void;
};

export default function GrillpartyPlatformer({ onWin }: PlatformerProps) {
  const [player, setPlayer] = useState({ x: 100, y: 100, vx: 0, vy: 0, grounded: false });
  const [items, setItems] = useState(LEVEL.items);
  const [enemies, setEnemies] = useState(LEVEL.enemies);
  const [cameraX, setCameraX] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'playing'|'gameover'|'won'>('playing');
   const { showMobileControls, isPortrait } = useGameDeviceMode();
   const requiresLandscape = showMobileControls && isPortrait && gameState === 'playing';

  const keys = useRef<{ [key: string]: boolean }>({});
  const joyVector = useRef({ dx: 0 });
   const timeRef = useRef(0);
  const reqRef = useRef<number>(0);
  const playerRef = useRef(player);
   const containerRef = useRef<HTMLDivElement>(null);
   const [viewport, setViewport] = useState({ width: 0, height: 0 });

   useEffect(() => {
      playerRef.current = player;
   }, [player]);

   useEffect(() => {
      const updateViewport = () => {
         if (!containerRef.current) {
            return;
         }

         setViewport({
            width: containerRef.current.clientWidth,
            height: containerRef.current.clientHeight,
         });
      };

      updateViewport();

      if (!containerRef.current) {
         return;
      }

      const resizeObserver = new ResizeObserver(updateViewport);
      resizeObserver.observe(containerRef.current);
      window.addEventListener('resize', updateViewport);

      return () => {
         resizeObserver.disconnect();
         window.removeEventListener('resize', updateViewport);
      };
   }, []);

  const getAABB = (x: number, y: number, w: number, h: number) => ({ l: x, r: x + w, t: y, b: y + h });

   const worldScale = showMobileControls && !requiresLandscape && viewport.height > 0
      ? Math.min(1, viewport.height / GAME_HEIGHT)
      : 1;
   const visibleWorldWidth = viewport.width > 0 ? viewport.width / worldScale : 900;
   const maxCameraX = Math.max(0, LEVEL_END_X - visibleWorldWidth);

   useEffect(() => {
      if (!showMobileControls) {
         return;
      }

      void requestLandscapeOrientation();

      return () => {
         releaseOrientationLock();
      };
   }, [showMobileControls]);

  useEffect(() => {
      timeRef.current = performance.now();

    const handleKD = (e: KeyboardEvent) => { keys.current[e.code] = true; };
    const handleKU = (e: KeyboardEvent) => { keys.current[e.code] = false; };
    window.addEventListener('keydown', handleKD);
    window.addEventListener('keyup', handleKU);

    const checkCollisions = (px: number, py: number, vy: number) => {
      let grounded = false;
      let newY = py;

      // Platform Collisions (only top down for simplicity)
      for (const plat of LEVEL.platforms) {
         if (px + 10 < plat.x + plat.w && px + PLAYER_W - 10 > plat.x) {
            // Check top edge collision if moving down
            if (vy >= 0 && py + PLAYER_H >= plat.y && py + PLAYER_H - vy * 0.05 <= plat.y + 15) {
               newY = plat.y - PLAYER_H;
               grounded = true;
               break;
            }
         }
      }
      return { newY, grounded };
    };

    const loop = (time: number) => {
      if (gameState !== 'playing') {
         reqRef.current = requestAnimationFrame(loop);
         return;
      }

      if (requiresLandscape) {
         timeRef.current = time;
         reqRef.current = requestAnimationFrame(loop);
         return;
      }
      
      const dt = Math.min((time - timeRef.current) / 1000, 0.1); // max 100ms delta to prevent huge jumps
      timeRef.current = time;

      const p = playerRef.current;
      let vx = 0;
      let vy = p.vy + GRAVITY * dt;

      // Input
      if (keys.current['ArrowLeft'] || keys.current['KeyA']) vx = -MOVE_SPEED;
      if (keys.current['ArrowRight'] || keys.current['KeyD']) vx = MOVE_SPEED;
      if (joyVector.current.dx !== 0) vx = joyVector.current.dx * MOVE_SPEED;

      // Jump
      if ((keys.current['Space'] || keys.current['ArrowUp'] || keys.current['KeyW']) && p.grounded) {
         vy = JUMP_FORCE;
      }

      // X Movement
      let nx = p.x + vx * dt;
      nx = Math.max(0, Math.min(nx, LEVEL_END_X - PLAYER_W));

      // Y Movement & Collision
      let ny = p.y + vy * dt;
      const col = checkCollisions(nx, ny, vy);
      ny = col.newY;
      const grounded = col.grounded;
      if (grounded) vy = 0;

      // Death by falling
      if (ny > GAME_HEIGHT + 100) {
         setGameState('gameover');
      }

      // Update Player State
      setPlayer({ x: nx, y: ny, vx, vy, grounded });
      const followOffset = showMobileControls ? visibleWorldWidth * 0.28 : 300;
      setCameraX(Math.max(0, Math.min(nx - followOffset, maxCameraX)));

      // Enemy Movement & Collision
      setEnemies(prevEnemies => {
         let hit = false;
         let bounced = false;
         const pBox = getAABB(nx, ny, PLAYER_W, PLAYER_H);

         const next = prevEnemies.map(e => {
            if (e.dead) return e;
            let nex = e.x + e.dir * ENEMY_SPEED * dt;
            let ndir = e.dir;
            if (nex < e.minX) { nex = e.minX; ndir = 1; }
            if (nex > e.maxX) { nex = e.maxX; ndir = -1; }

            // Collision with player
            const eBox = getAABB(nex + 2, e.y + 2, 36, 36); // 90% hitbox for raccoon
            if (pBox.r > eBox.l && pBox.l < eBox.r && pBox.b > eBox.t && pBox.t < eBox.b) {
               // Stomp? (player falling onto top half of enemy)
               if (vy > 0 && p.y + PLAYER_H < e.y + 20) {
                  bounced = true;
                  setScore(s => s + 50);
                  return { ...e, dead: true };
               } else {
                  hit = true;
               }
            }
            return { ...e, x: nex, dir: ndir };
         });

         if (hit) setGameState('gameover');
         if (bounced) setPlayer(prev => ({ ...prev, vy: JUMP_FORCE * 0.8 }));
         return next;
      });

      // Item Collection
      setItems(prevItems => {
         const pBox = getAABB(nx, ny, PLAYER_W, PLAYER_H);
         return prevItems.map(i => {
            if (i.collected) return i;
            const iBox = getAABB(i.x, i.y, 40, 40);
            if (pBox.r > iBox.l && pBox.l < iBox.r && pBox.b > iBox.t && pBox.t < iBox.b) {
               setScore(s => s + (i.type === 'steak' ? 100 : 50));
               return { ...i, collected: true };
            }
            return i;
         });
      });

      // Win Condition (reach Jörg)
      if (nx > 3300) {
         setGameState('won');
      }

      reqRef.current = requestAnimationFrame(loop);
    };

    reqRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('keydown', handleKD);
      window.removeEventListener('keyup', handleKU);
      cancelAnimationFrame(reqRef.current);
    };
   }, [gameState, maxCameraX, requiresLandscape, showMobileControls, visibleWorldWidth]);

  const handleJoyMove = (dx: number) => { joyVector.current.dx = dx; };
  const handleJoyJump = () => {
     if (playerRef.current.grounded && gameState === 'playing') {
        setPlayer(p => ({ ...p, vy: JUMP_FORCE }));
     }
  };

  const restartPlatformer = () => {
    setPlayer({ x: 100, y: 100, vx: 0, vy: 0, grounded: false });
    setItems(LEVEL.items);
    setEnemies(LEVEL.enemies);
    setScore(0);
    timeRef.current = performance.now();
    setGameState('playing');
  };

  return (
    <div 
         ref={containerRef}
      className="position-relative overflow-hidden user-select-none shadow" 
         style={{
            height: showMobileControls ? 'clamp(320px, 72vh, 420px)' : '600px',
            minHeight: showMobileControls ? '320px' : '600px',
            backgroundColor: '#87CEEB',
            border: '5px solid #1976D2',
            borderRadius: '12px',
         }}
    >
      {/* Background Parallax Layer */}
      <div className="position-absolute" style={{ width: '200%', height: '100%', transform: `translateX(${-cameraX * 0.2}px)`, opacity: 0.6 }}>
         {/* Simple Clouds */}
         <div style={{ position:'absolute', top: 50, left: 200, fontSize: '64px' }}>☁️</div>
         <div style={{ position:'absolute', top: 100, left: 800, fontSize: '64px' }}>☁️</div>
         <div style={{ position:'absolute', top: 30, left: 1500, fontSize: '64px' }}>☁️</div>
         <div style={{ position:'absolute', top: 80, left: 2200, fontSize: '64px' }}>☁️</div>
      </div>

      {/* World Layer */}
         <div
            className="position-absolute top-0 start-0"
            style={{
               width: LEVEL_END_X,
               height: GAME_HEIGHT,
               transform: `scale(${worldScale})`,
               transformOrigin: 'top left',
            }}
         >
            <div className="position-absolute top-0 start-0" style={{ width: LEVEL_END_X, height: GAME_HEIGHT, transform: `translateX(${-cameraX}px)` }}>
               {/* Draw Platforms */}
               {LEVEL.platforms.map(p => (
                   <div key={p.id} className="position-absolute shadow-sm" style={{ left: p.x, top: p.y }}>
                      <PlatformSprite width={p.w} height={p.h} />
                   </div>
               ))}

               {/* Draw Items */}
               {items.filter(i => !i.collected).map(i => (
                   <div key={i.id} className="position-absolute" style={{ left: i.x, top: i.y }}>
                      {i.type === 'sausage' ? <SausageSprite /> : <SteakSprite />}
                   </div>
               ))}

               {/* Draw Waschbären */}
               {enemies.filter(e => !e.dead).map(e => (
                   <div key={e.id} className="position-absolute" style={{ left: e.x, top: e.y }}>
                      <RaccoonSprite direction={e.dir} />
                   </div>
               ))}

               {/* Draw Player */}
               <div className="position-absolute" style={{ left: player.x, top: player.y, zIndex: 10 }}>
                   <CharacterSprite shirt="#ffd700" hair="#333" gender="M" isPlayer={true} />
               </div>

               {/* Goal Area (Jörg waiting) */}
               <div className="position-absolute d-flex flex-column align-items-center" style={{ left: 3350, top: GROUND_Y - 58 }}>
                   <div className="bg-white px-2 py-0 rounded text-dark fw-bold shadow-sm" style={{ fontSize: '0.8rem', opacity: 0.9 }}>Jörg</div>
                   <CharacterSprite shirt="#8B0000" hair="#8b4513" gender="M" />
               </div>
        </div>
      </div>

      {/* UI Overlay */}
      <div className="position-absolute top-0 start-0 m-3 d-flex justify-content-between w-100" style={{ paddingRight: '20px' }}>
         <div className="bg-dark bg-opacity-75 text-white px-3 py-2 rounded shadow">
           <h3 className="h6 fw-bold m-0 text-uppercase letter-spacing-1 text-warning">Die Wurst-Jagd</h3>
           <span className="fw-bold">Punkte: {score}</span>
           {showMobileControls && gameState === 'playing' && !requiresLandscape && (
                   <div className="small opacity-75 mt-1">Laufen links, Springen rechts.</div>
           )}
         </div>
      </div>

      {requiresLandscape && (
         <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-4" style={{ zIndex: 120, background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.88), rgba(13, 71, 161, 0.92))' }}>
            <div className="glass-panel text-center text-dark p-4 p-md-5" style={{ maxWidth: '420px' }}>
               <div className="display-4 mb-3">↻</div>
               <h2 className="h3 fw-bold text-primary mb-3">Bitte ins Querformat drehen</h2>
               <p className="mb-4 text-secondary">Die Wurst-Jagd wird auf dem Handy horizontal gespielt. Nach dem Drehen laeuft das Jump-and-Run automatisch weiter.</p>
               <button className="btn btn-light btn-lg rounded-pill px-4 shadow-sm" onClick={() => { void requestLandscapeOrientation(); }}>
                 Querformat anfordern
               </button>
            </div>
         </div>
      )}

      {/* Game Over Screen */}
      {gameState === 'gameover' && (
         <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex flex-column justify-content-center align-items-center" style={{ zIndex: 100 }}>
            <h1 className="display-4 fw-bold text-danger text-shadow mb-4">Wasted.</h1>
            <p className="text-white fs-5 mb-4">Die Waschbären haben gesiegt oder du bist in den Abgrund gefallen!</p>
            <button className="btn btn-warning btn-lg fw-bold px-5 rounded-pill shadow" onClick={restartPlatformer}>Nochmal versuchen</button>
         </div>
      )}

      {/* Victory Screen */}
      {gameState === 'won' && (
         <div className="position-absolute top-0 start-0 w-100 h-100 bg-success bg-opacity-90 d-flex flex-column justify-content-center align-items-center" style={{ zIndex: 100 }}>
            <h1 className="display-4 fw-bold text-white text-shadow mb-4">Level geschafft!</h1>
            <p className="text-white fs-4 mb-4">Jörg ist stolz auf dich. Du hast {score} Punkte gesammelt!</p>
            <button className="btn btn-light btn-lg fw-bold px-5 rounded-pill shadow text-success" onClick={() => onWin(score)}>Zurück in den Garten</button>
         </div>
      )}

      {/* Mobile Joypad */}
         {showMobileControls && !requiresLandscape && (
            <div className="position-absolute bottom-0 w-100" style={{ zIndex: 50 }}>
                <Joypad mode="platformer" onMove={handleJoyMove} onJump={handleJoyJump} />
            </div>
         )}
    </div>
  );
}
