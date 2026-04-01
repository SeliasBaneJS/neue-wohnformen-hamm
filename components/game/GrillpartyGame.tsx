'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CHARACTERS, OBSTACLES, GAME_BOUNDS, ITEMS, ItemData, CharacterData } from './gameData';
import { CharacterSprite, GrillSprite, TreeSprite, PropSprite } from './SVGSprites';
import Joypad from './Joypad';
import GrillpartyPlatformer from './GrillpartyPlatformer';
import { requestLandscapeOrientation, useGameDeviceMode } from './useGameDeviceMode';

const PLAYER_SPEED = 300; // px per second

export default function GrillpartyGame() {
  const [player, setPlayer] = useState({ x: 600, y: 800 }); // Start in the garden
  const [dialogue, setDialogue] = useState<{name: string, text: string} | null>(null);
  const [viewport, setViewport] = useState({ w: 800, h: 600 });
  const [isPlatforming, setIsPlatforming] = useState(false);
  const { showMobileControls } = useGameDeviceMode();

  // Game/Quest State
  const [inventory, setInventory] = useState<ItemData['type'][]>([]);
  const [mapItems, setMapItems] = useState<ItemData[]>(ITEMS);
  const [questState, setQuestState] = useState({
    dianaSpoken: false,
    grillLit: false,
    hansToasted: false,
    edeltraudSalad: false
  });

  const keys = useRef<{ [key: string]: boolean }>({});
  const joyVector = useRef({ dx: 0, dy: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef(player);

  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  // Resize listener for camera
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setViewport({
          w: containerRef.current.clientWidth,
          h: containerRef.current.clientHeight
        });
      }
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Game Loop
  useEffect(() => {
    let lastTime = performance.now();
    let reqId: number;

    const handleKeyDown = (e: KeyboardEvent) => { 
      keys.current[e.key.toLowerCase()] = true; 
      // Space only picks up items or closes dialogues - no NPC interaction
      if (e.key === ' ' && dialogue) setDialogue(null);
      if (e.key === ' ' && !dialogue) handleItemPickup();
    };
    const handleKeyUp = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const checkCollision = (nx: number, ny: number) => {
      if (nx < 20 || nx > GAME_BOUNDS.width - 20) return true;
      if (ny < 20 || ny > GAME_BOUNDS.height - 20) return true;
      
      for (const obs of OBSTACLES) {
        if (obs.type === 'parking') continue; // Parking lot is walkable
        if (nx + 10 > obs.x && nx - 10 < obs.x + obs.w && ny + 10 > obs.y && ny - 10 < obs.y + obs.h) {
          return true;
        }
      }

      // Check collision with NPCs (approx 25px radius)
      for (const npc of CHARACTERS) {
        if (Math.hypot(npc.x - nx, npc.y - ny) < 25) {
          return true;
        }
      }
      return false;
    };

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (document.getElementById('dialogue-overlay')) {
         reqId = requestAnimationFrame(loop);
         return;
      }

      let dx = joyVector.current.dx;
      let dy = joyVector.current.dy;

      if (keys.current['arrowup'] || keys.current['w']) dy = -1;
      if (keys.current['arrowdown'] || keys.current['s']) dy = 1;
      if (keys.current['arrowleft'] || keys.current['a']) dx = -1;
      if (keys.current['arrowright'] || keys.current['d']) dx = 1;

      if (dx !== 0 && dy !== 0) {
        const len = Math.sqrt(dx * dx + dy * dy);
        dx /= len;
        dy /= len;
      }

      if (dx !== 0 || dy !== 0) {
        setPlayer(p => {
          let nx = p.x + dx * PLAYER_SPEED * dt;
          let ny = p.y + dy * PLAYER_SPEED * dt;
          
          if (checkCollision(nx, p.y)) nx = p.x;
          if (checkCollision(p.x, ny)) ny = p.y;
          
          return { x: nx, y: ny };
        });
      }

      reqId = requestAnimationFrame(loop);
    };

    reqId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(reqId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogue]);

  // Item pickup only (triggered by spacebar)
  const getNearestItem = (x: number, y: number): { item: ItemData; distance: number } | null => {
    let nearestItem: ItemData | null = null;
    let nearestDistance = 80;

    for (const item of mapItems) {
      const distance = Math.hypot(item.x - x, item.y - y);
      if (distance <= nearestDistance) {
        nearestItem = item;
        nearestDistance = distance;
      }
    }

    return nearestItem ? { item: nearestItem, distance: nearestDistance } : null;
  };

  const getNearestNpc = (x: number, y: number): { npc: CharacterData; distance: number } | null => {
    let nearestNpc: CharacterData | null = null;
    let nearestDistance = 120;

    for (const npc of CHARACTERS) {
      const distance = Math.hypot(npc.x - x, npc.y - y);
      if (distance <= nearestDistance) {
        nearestNpc = npc;
        nearestDistance = distance;
      }
    }

    return nearestNpc ? { npc: nearestNpc, distance: nearestDistance } : null;
  };

  const handleItemPickup = () => {
    if (dialogue) { setDialogue(null); return; }
    const px = playerRef.current.x;
    const py = playerRef.current.y;

    const nearestItem = getNearestItem(px, py);
    if (!nearestItem) {
      return;
    }

    const itemToPickup = nearestItem.item;

    setInventory(prev => [...prev, itemToPickup.type]);
    setMapItems(prev => prev.filter(i => i.id !== itemToPickup.id));
    const names: Record<ItemData['type'], string> = {
      beer: 'Bier (Alkoholfrei)',
      salad: 'Edeltrauds legendärer Nudelsalat',
      coal: 'Grillkohle',
    };
    setDialogue({ name: 'System', text: `Du hast [${names[itemToPickup.type]}] aufgesammelt!` });
  };

  // NPC dialogue (triggered by clicking on a specific NPC)
  const handleNpcClick = (npcId: string) => {
    if (dialogue) { setDialogue(null); return; }
    const npc = CHARACTERS.find(c => c.id === npcId);
    if (!npc) return;
    
    // Check player is within range of this specific NPC
    const dist = Math.hypot(npc.x - player.x, npc.y - player.y);
    if (dist > 120) {
      setDialogue({ name: 'System', text: 'Du bist zu weit weg. Geh näher ran!' });
      return;
    }
    
    if (npc) {
      const closestNPC = npc;
      let text = "Schön, dass du da bist!";
      
      switch (closestNPC.id) {
        case 'diana':
          text = questState.grillLit && questState.hansToasted && questState.edeltraudSalad
            ? "Endlich gibt's Würstchen! Ich hab Grillpartys so vermisst... Deutschland ist doch am schönsten!"
            : "Endlich wieder in Deutschland! Ich hab Grillpartys so vermisst... Aber hier scheint ja noch einiges durcheinander zu sein. Schau dich mal um, vielleicht kannst du helfen!";
          setQuestState(s => ({ ...s, dianaSpoken: true }));
          break;
        case 'jakob':
          text = "Hey! Ich hoffe dir gefällt die Website und das kleine Spiel hier.";
          break;
        case 'edeltraud':
          if (questState.edeltraudSalad) text = "Danke dir! Mein Nudelsalat ist gerettet. Jetzt kann ich ihn endlich auf den Tisch stellen!";
          else if (inventory.includes('salad')) {
             text = "Oh, du hast meinen Salat gefunden! Wunderbar, den hatte ich doch glatt verlegt. Vielen Dank!";
             setInventory(inv => inv.filter(i => i !== 'salad'));
             setQuestState(s => ({ ...s, edeltraudSalad: true }));
          } else {
             text = "Hast du zufällig meinen Nudelsalat gesehen? Ich hab ihn irgendwo abgestellt und finde ihn nicht mehr. Am Grill ist auch die Hölle los, kein Plan was Jörg da wieder verzapft hat.";
          }
          break;
        case 'joerg':
          if (questState.grillLit) text = "Die Würstchen sind perfekt! Sag allen Bescheid, Essen ist fertig!";
          else if (inventory.includes('coal')) {
             text = "Endlich Kohle! Danke! Ich werf den Grill sofort an. ABER MOMENT MAL – wo sind die Würstchen?! Pe! PE! Hast du die Würstchen eingepackt?! ...Natürlich nicht. Kannst du schnell welche holen? Pass auf dem Weg auf, da treiben sich Waschbären rum!";
          } else {
             text = "Na toll! Keine Kohle! Und Pe lacht sich kaputt natürlich. Wenn du irgendwo Grillkohle findest, bring sie mir bitte!";
          }
          break;
        case 'petra':
          if (questState.grillLit) text = "Na Jörg, schau mal einer an! Die Würstchen werden ja gar nicht schwarz. Ich bin beeindruckt. Fast.";
          else text = "Der Herr Grillmeister hat mal wieder die Kohle vergessen. Aber ein großes Mundwerk haben, ne Jörg?";
          break;
        case 'hans':
          if (questState.hansToasted) text = "Prost! Auf gute Nachbarschaft! *strahlt*";
          else if (inventory.includes('beer')) {
            text = "Ein Alkoholfreies! Perfekt! Da sagt endlich keiner mehr nein. PROST! Auf gute Nachbarschaft!";
            setInventory(inv => inv.filter(i => i !== 'beer'));
            setQuestState(s => ({ ...s, hansToasted: true }));
          } else {
            text = "Prost! Möchte jemand anstoßen? ...Nein? Keiner? Alkoholfrei ginge auch? Hm, hat leider keiner da...";
          }
          break;
        case 'sandra':
          text = "Die Kinder sind heute bei den Großeltern. Weißt du, wie lange wir auf so einen Abend gewartet haben? Herrlich!";
          break;
        case 'stephan':
          text = "Stille. Wunderbare Stille. Keine Kinder die 'Papaaaa!' rufen. Traumhaft.";
          break;
        case 'thorsten':
          text = "Tolle Nachbarschaft hier. Man hilft sich, man feiert zusammen. So muss das sein!";
          break;
        case 'angelika':
          text = "Ich hab noch Kartoffelsalat im Kühlschrank. Hol ich gleich mal, bevor Thorsten alles alleine isst!";
          break;
        case 'marlies':
          text = "Früher gab's sowas nicht. Jetzt grillen wir hier alle zusammen im Garten. Wunderbar!";
          break;
        case 'daniel':
          text = "Super Wetter heute! Perfekt zum Grillen. Der Garten sieht echt gut aus.";
          break;
        case 'irene':
          text = "Solche Feste schweißen zusammen. Das macht das Wohnen hier besonders.";
          break;
        case 'karin':
          text = "Ich hab Kuchen gebacken. Steht da hinten auf dem Tisch. Greif zu, bevor Hans alles aufisst!";
          break;
      }
      setDialogue({ name: closestNPC.name, text });
    }
  };

  const handleJoyMove = (dx: number, dy: number) => {
    joyVector.current = { dx, dy };
  };

  const mobileNpcAction = getNearestNpc(player.x, player.y);
  const mobileItemAction = getNearestItem(player.x, player.y);
  const mobileAction = !mobileNpcAction && !mobileItemAction
    ? null
    : !mobileNpcAction
      ? { type: 'item' as const, label: 'Nehmen' }
      : !mobileItemAction
        ? { type: 'npc' as const, label: 'Reden', npcId: mobileNpcAction.npc.id }
        : mobileItemAction.distance <= mobileNpcAction.distance
          ? { type: 'item' as const, label: 'Nehmen' }
          : { type: 'npc' as const, label: 'Reden', npcId: mobileNpcAction.npc.id };

  const handleMobileAction = () => {
    if (dialogue) {
      setDialogue(null);
      return;
    }

    if (mobileAction?.type === 'npc') {
      handleNpcClick(mobileAction.npcId);
      return;
    }

    handleItemPickup();
  };

  const startPlatformer = () => {
    void requestLandscapeOrientation();
    setDialogue(null);
    setIsPlatforming(true);
  };

  // Camera Transformation
  const camX = Math.max(0, Math.min(GAME_BOUNDS.width - viewport.w, player.x - viewport.w / 2));
  const camY = Math.max(0, Math.min(GAME_BOUNDS.height - viewport.h, player.y - viewport.h / 2));

  if (isPlatforming) {
    return (
      <GrillpartyPlatformer onWin={(score) => {
        setIsPlatforming(false);
        setInventory(inv => inv.filter(i => i !== 'coal'));
        setQuestState(s => ({ ...s, grillLit: true }));
        // Spawn next to Jörg after the jump'n'run
        setPlayer({ x: 780, y: 740 });
        setDialogue({ name: 'Jörg', text: `Wahnsinn! Du hast die Würstchen gerettet und ${score} Punkte gesammelt! Ab auf den Grill damit!` });
      }} />
    );
  }

  return (
    <div 
      className="position-relative overflow-hidden user-select-none shadow" 
      style={{
        height: showMobileControls ? 'min(70vh, 560px)' : '75vh',
        minHeight: showMobileControls ? '360px' : '500px',
        borderRadius: '12px',
        border: '5px solid #2e7d32',
        backgroundColor: '#7cb342',
      }}
      ref={containerRef}
    >
      <div 
        className="position-absolute"
        style={{
          width: GAME_BOUNDS.width,
          height: GAME_BOUNDS.height,
          transform: `translate(${-camX}px, ${-camY}px)`,
          transition: 'transform 0.1s linear',
          backgroundImage: 'radial-gradient(#689f38 5%, transparent 5%)',
          backgroundSize: '40px 40px'
        }}
      >
        {/* Draw curved road (Kentroper Weg) and paths matching satellite view */}
        <svg className="position-absolute" width={GAME_BOUNDS.width} height={GAME_BOUNDS.height} style={{ zIndex: 0 }}>
           {/* Main road curve (left side, going around the property) */}
           <path d="M 250 0 Q 100 200 100 500 Q 100 900 300 1100 Q 400 1200 600 1300" fill="none" stroke="#e57373" strokeWidth="25" strokeLinecap="round" opacity="0.5" />
           {/* Access path from road to building */}
           <path d="M 300 800 Q 500 700 700 500 Q 800 400 900 350" fill="none" stroke="#bcaaa4" strokeWidth="50" strokeLinecap="round" opacity="0.7" />
           {/* Parkplatz asphalt */}
           <rect x="480" y="1080" width="440" height="240" rx="12" fill="#757575" opacity="0.6" />
           {/* Parking lines */}
           <line x1="580" y1="1090" x2="580" y2="1300" stroke="#fff" strokeWidth="2" opacity="0.4" />
           <line x1="680" y1="1090" x2="680" y2="1300" stroke="#fff" strokeWidth="2" opacity="0.4" />
           <line x1="780" y1="1090" x2="780" y2="1300" stroke="#fff" strokeWidth="2" opacity="0.4" />
        </svg>

        {/* Draw Obstacles */}
        {OBSTACLES.map(obs => {
          if (obs.type === 'tree') {
            return (
              <div key={obs.id} className="position-absolute" style={{ left: obs.x - 20, top: obs.y - 60, zIndex: 10 }}>
                <TreeSprite />
              </div>
            );
          }
          if (obs.type === 'grill') {
            return (
              <div key={obs.id} className="position-absolute" style={{ left: obs.x, top: obs.y - 20, zIndex: 5 }}>
                <GrillSprite fire={questState.grillLit} />
              </div>
            );
          }
          if (obs.type === 'house') {
            return (
              <div 
                key={obs.id} 
                className="position-absolute d-flex align-items-center justify-content-center shadow-lg"
                style={{
                  left: obs.x, top: obs.y, width: obs.w, height: obs.h,
                  backgroundColor: '#795548', // House roof color
                  boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)',
                  border: '6px solid #4e342e',
                  zIndex: 2,
                }}
              >
                 <span className="text-white opacity-50 fw-bold fs-1" style={{ letterSpacing: '8px' }}>VICANUS I</span>
              </div>
            );
          }
          // Tables and parking
          if (obs.type === 'parking') {
            return null; // parking is drawn via SVG
          }
          return (
            <div 
              key={obs.id} 
              className="position-absolute shadow"
              style={{
                left: obs.x, top: obs.y, width: obs.w, height: obs.h,
                backgroundColor: '#d7ccc8', // wooden table
                borderRadius: obs.type === 'table' && obs.w === obs.h ? '50%' : '8px',
                border: '4px solid #8d6e63',
                zIndex: 4
              }}
            />
          );
        })}

        {/* Draw Items */}
        {mapItems.map(item => (
          <div key={item.id} className="position-absolute" style={{ left: item.x - 16, top: item.y - 16, zIndex: 6 }}>
             <PropSprite type={item.type} />
          </div>
        ))}

        {/* Draw NPCs */}
        {CHARACTERS.map(npc => (
          <div 
            key={npc.id} 
            className="position-absolute d-flex flex-column align-items-center"
            style={{ left: npc.x - 24, top: npc.y - 30, cursor: 'pointer', zIndex: 10 + Math.floor(npc.y) }}
            onClick={(e) => { e.stopPropagation(); handleNpcClick(npc.id); }}
          >
            <div className="bg-white px-2 py-0 rounded text-dark fw-bold shadow-sm" style={{ fontSize: '0.8rem', opacity: 0.9 }}>
              {npc.name}
            </div>
            <CharacterSprite shirt={npc.shirtColor} hair={npc.hairColor} gender={npc.gender} />
          </div>
        ))}

        {/* Draw Player (nameless) */}
        <div 
          className="position-absolute"
          style={{ left: player.x - 24, top: player.y - 24, zIndex: 10 + Math.floor(player.y) + 10 }}
        >
          <CharacterSprite shirt="#ffd700" hair="#333" gender="M" isPlayer={true} />
        </div>
      </div>

      {/* UI Overlay */}
      <div className="position-absolute top-0 start-0 m-3 d-flex flex-column gap-2" style={{ zIndex: 50 }}>
      <div className="bg-dark bg-opacity-75 text-white p-3 rounded-4 shadow">
          <h3 className="h6 fw-bold m-0 text-uppercase letter-spacing-1 text-accent">Grillparty</h3>
          <p className="small mb-1 opacity-75 d-none d-md-block">Rette das Grillfest!</p>
          {showMobileControls && (
            <p className="small mb-1 opacity-75 d-md-none">D-Pad links, Kontext-Aktion rechts.</p>
          )}
          <div className="small opacity-50 d-none d-md-block" style={{ fontSize: '0.7rem' }}>
            <span>WASD / Pfeiltasten = Bewegen</span><br/>
            <span>Leertaste = Items aufsammeln</span><br/>
            <span>Klick auf Nachbarn = Sprechen</span>
          </div>
        </div>
        
        {/* Inventory */}
        {inventory.length > 0 && (
          <div className="bg-white text-dark p-2 rounded-4 shadow-sm border border-2 border-primary d-flex align-items-center gap-2">
            <span className="fw-bold small ms-2">Inventar:</span>
            {inventory.map((item, i) => (
               <div key={i}><PropSprite type={item} /></div>
            ))}
          </div>
        )}
      </div>

      {/* Dialogue Overlay */}
      {dialogue && (
        <div id="dialogue-overlay" className="position-absolute bottom-0 w-100 p-2 p-md-4" style={{ zIndex: 100 }}>
          <div className="bg-white rounded-4 p-4 shadow-lg border border-5 border-primary mx-auto position-relative" style={{ maxWidth: '700px' }}>
            <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
              <h4 className="fw-bold text-primary m-0 fs-3">{dialogue.name}</h4>
              <button className="btn-close" aria-label="Close" onClick={() => setDialogue(null)}></button>
            </div>
            <p className="fs-4 text-dark m-0 lh-base fw-medium">&bdquo;{dialogue.text}&ldquo;</p>
            
            {dialogue.name === 'Jörg' && inventory.includes('coal') && !questState.grillLit ? (
               <div className="mt-4 text-center">
                 <button className="btn btn-warning btn-lg fw-bold px-5 py-3 rounded-pill shadow w-100 fs-4 text-dark" onClick={() => {
                   startPlatformer();
                 }}>⭐ Wurst-Jagd starten (Jump-and-Run) ⭐</button>
               </div>
            ) : (
               <div className="text-muted fw-bold small text-end mt-3 opacity-50 text-uppercase letter-spacing-1 cursor-pointer" onClick={() => setDialogue(null)}>
                  (Tippen zum Fortfahren)
               </div>
            )}
          </div>
        </div>
      )}

      {/* Joypad for Mobile */}
      {showMobileControls && (
        <div className="position-absolute bottom-0 start-0 w-100" style={{ zIndex: 60 }}>
          <Joypad
            onMove={handleJoyMove}
            onInteract={handleMobileAction}
            actionLabel={mobileAction?.label ?? 'Aktion'}
          />
        </div>
      )}

      {/* Victory Overlay - all quests done */}
      {questState.grillLit && questState.hansToasted && questState.edeltraudSalad && !dialogue && (
        <div className="position-absolute top-0 end-0 m-3" style={{ zIndex: 55 }}>
          <div className="bg-success bg-opacity-90 text-white p-3 rounded-4 shadow-lg text-center" style={{ maxWidth: '350px' }}>
            <h3 className="fw-bold mb-2">🎉 Geschafft!</h3>
            <p className="small mb-0">Alle Quests abgeschlossen! Der Grill brennt, Hans hat angestoßen und der Nudelsalat ist auf dem Tisch. Perfekte Grillparty am Kentroper Weg!</p>
          </div>
        </div>
      )}
    </div>
  );
}
