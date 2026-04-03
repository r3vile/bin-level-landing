"use client";

import { useRef, useMemo, createContext, useContext } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─── Grid dimensions ───
const COLS = 16;
const ROWS = 10;
const CELL = 1.0;
const RAIL_W = 0.06;
const RAIL_H = 0.04;
const GRID_W = COLS * CELL;
const GRID_H = ROWS * CELL;

// ─── Colour palette ───
const COL_RAIL = "#8899aa";
const COL_RAIL_HIGHLIGHT = "#a0b4c4";
const COL_ROBOT_BODY = "#1a1a1a";
const COL_ROBOT_TOP = "#dc2626";
const COL_ROBOT_LIGHT = "#F59E0B";
const COL_BIN_INSIDE = "#0e1622";

// ─── Shared state between all robots ───
const MouseCtx = createContext<React.RefObject<THREE.Vector3>>(null!);

// Shared registry: each robot writes its current + target cell so others can avoid it
// Key: "col,row" → robot id occupying that cell
type OccupancyMap = Map<string, number>;
const OccupancyCtx = createContext<React.RefObject<OccupancyMap>>(null!);

function cellKey(col: number, row: number): string {
  return `${col},${row}`;
}

// ─── Robot path definitions ───
// Speed = cells per second
const ROBOT_DEFS = [
  { id: 0,  speed: 1.4, waypoints: [[2, 1], [2, 5], [7, 5], [7, 1]] },
  { id: 1,  speed: 1.1, waypoints: [[10, 2], [10, 7], [14, 7], [14, 2]] },
  { id: 2,  speed: 1.6, waypoints: [[5, 7], [12, 7], [12, 3], [5, 3]] },
  { id: 3,  speed: 1.0, waypoints: [[1, 8], [8, 8], [8, 6], [1, 6]] },
  { id: 4,  speed: 1.3, waypoints: [[13, 1], [13, 5], [15, 5], [15, 1]] },
  { id: 5,  speed: 1.2, waypoints: [[3, 2], [3, 4], [6, 4], [6, 2]] },
  { id: 6,  speed: 1.3, waypoints: [[0, 0], [0, 4], [4, 4], [4, 0]] },
  { id: 7,  speed: 1.0, waypoints: [[9, 0], [9, 3], [12, 3], [12, 0]] },
  { id: 8,  speed: 1.5, waypoints: [[7, 6], [7, 9], [11, 9], [11, 6]] },
  { id: 9,  speed: 1.2, waypoints: [[14, 5], [14, 9], [15, 9], [15, 5]] },
  { id: 10, speed: 1.1, waypoints: [[0, 5], [0, 9], [3, 9], [3, 5]] },
  { id: 11, speed: 1.4, waypoints: [[8, 1], [8, 4], [10, 4], [10, 1]] },
];

// ─── Mouse Raycaster — projects pointer onto grid plane (y=0) ───
function MouseTracker({ mouseWorldRef }: { mouseWorldRef: React.RefObject<THREE.Vector3> }) {
  const { camera } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const intersection = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ pointer }) => {
    if (!mouseWorldRef.current) return;
    raycaster.setFromCamera(pointer, camera);
    if (raycaster.ray.intersectPlane(plane, intersection)) {
      mouseWorldRef.current.lerp(intersection, 0.12);
    }
  });

  return null;
}

// ─── Rail Grid ───
function RailGrid() {
  const { railGeo, railMat, railHighMat } = useMemo(() => {
    const geo = new THREE.BoxGeometry(1, RAIL_H, RAIL_W);
    const mat = new THREE.MeshStandardMaterial({
      color: COL_RAIL, roughness: 0.35, metalness: 0.7,
    });
    const highMat = new THREE.MeshStandardMaterial({
      color: COL_RAIL_HIGHLIGHT, roughness: 0.25, metalness: 0.8,
    });
    return { railGeo: geo, railMat: mat, railHighMat: highMat };
  }, []);

  const rails = useMemo(() => {
    const items: { pos: [number, number, number]; rot: number; isOuter: boolean }[] = [];
    for (let r = 0; r <= ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        items.push({
          pos: [c * CELL + CELL / 2 - GRID_W / 2, 0, r * CELL - GRID_H / 2],
          rot: 0, isOuter: r === 0 || r === ROWS,
        });
      }
    }
    for (let c = 0; c <= COLS; c++) {
      for (let r = 0; r < ROWS; r++) {
        items.push({
          pos: [c * CELL - GRID_W / 2, 0, r * CELL + CELL / 2 - GRID_H / 2],
          rot: Math.PI / 2, isOuter: c === 0 || c === COLS,
        });
      }
    }
    return items;
  }, []);

  return (
    <group>
      {rails.map((rail, i) => (
        <mesh key={i} geometry={railGeo} material={rail.isOuter ? railHighMat : railMat}
          position={rail.pos} rotation={[0, rail.rot, 0]} />
      ))}
      {Array.from({ length: (COLS + 1) * (ROWS + 1) }, (_, i) => {
        const c = i % (COLS + 1);
        const r = Math.floor(i / (COLS + 1));
        return (
          <mesh key={`nub-${i}`}
            position={[c * CELL - GRID_W / 2, RAIL_H * 0.5, r * CELL - GRID_H / 2]}>
            <boxGeometry args={[RAIL_W * 1.6, RAIL_H * 0.5, RAIL_W * 1.6]} />
            <meshStandardMaterial color={COL_RAIL_HIGHLIGHT} roughness={0.3} metalness={0.8} />
          </mesh>
        );
      })}
    </group>
  );
}

// ─── Bin openings ───
function BinOpenings() {
  return (
    <>
      {Array.from({ length: COLS * ROWS }, (_, i) => {
        const c = i % COLS;
        const r = Math.floor(i / COLS);
        return (
          <mesh key={i}
            position={[c * CELL + CELL / 2 - GRID_W / 2, -RAIL_H * 0.6, r * CELL + CELL / 2 - GRID_H / 2]}
            rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[CELL * 0.72, CELL * 0.72]} />
            <meshBasicMaterial color={COL_BIN_INSIDE} transparent opacity={0.5} />
          </mesh>
        );
      })}
    </>
  );
}

// ─── Helpers ───
// Convert grid cell (col, row) to world position
function cellToWorld(col: number, row: number): [number, number] {
  return [
    col * CELL + CELL / 2 - GRID_W / 2,
    row * CELL + CELL / 2 - GRID_H / 2,
  ];
}

// Check if a grid cell is too close to the mouse (within 2 cells)
function isCellNearMouse(col: number, row: number, mouseWorld: THREE.Vector3): boolean {
  const [wx, wz] = cellToWorld(col, row);
  const dx = wx - mouseWorld.x;
  const dz = wz - mouseWorld.z;
  return (dx * dx + dz * dz) < (2.2 * CELL) * (2.2 * CELL);
}

// Check if a grid cell is within grid bounds
function inBounds(col: number, row: number): boolean {
  return col >= 0 && col < COLS && row >= 0 && row < ROWS;
}

// 4 grid directions: right, down, left, up
const DIRS: [number, number][] = [[1, 0], [0, 1], [-1, 0], [0, -1]];

// ─── Single Robot with collision avoidance + mouse speed boost ───
function Robot({ waypoints, speed, id }: { waypoints: number[][]; speed: number; id: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.Mesh>(null);
  const mouseWorldRef = useContext(MouseCtx);
  const occupancyRef = useContext(OccupancyCtx);

  const state = useRef({
    col: waypoints[0][0],
    row: waypoints[0][1],
    targetCol: waypoints[0][0],
    targetRow: waypoints[0][1],
    wpIndex: 0,
    cellT: 0,
    waiting: false,
  });

  // Stagger initial position
  useMemo(() => {
    const s = state.current;
    const stagger = Math.floor(Math.random() * waypoints.length);
    s.wpIndex = stagger % waypoints.length;
    s.col = waypoints[s.wpIndex][0];
    s.row = waypoints[s.wpIndex][1];
    s.targetCol = s.col;
    s.targetRow = s.row;
  }, [waypoints]);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current || !mouseWorldRef.current || !occupancyRef.current) return;
    const t = clock.getElapsedTime();
    const s = state.current;
    const clampedDelta = Math.min(delta, 0.05);
    const mouse = mouseWorldRef.current;
    const occ = occupancyRef.current;

    // ── Register our occupied cells ──
    occ.set(cellKey(s.col, s.row), id);
    if (s.targetCol !== s.col || s.targetRow !== s.row) {
      occ.set(cellKey(s.targetCol, s.targetRow), id);
    }

    // ── Mouse proximity → speed boost ──
    const [worldX, worldZ] = cellToWorld(s.col, s.row);
    const mouseDx = worldX - mouse.x;
    const mouseDz = worldZ - mouse.z;
    const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDz * mouseDz);

    const BOOST_RADIUS = 4.0;
    let speedMult = 1.0;
    if (mouseDist < BOOST_RADIUS) {
      const urgency = 1 - mouseDist / BOOST_RADIUS;
      speedMult = 1.0 + urgency * urgency * 3.0; // up to 4x speed
    }

    // ── Advance interpolation toward target cell ──
    if (s.targetCol !== s.col || s.targetRow !== s.row) {
      s.cellT += speed * speedMult * clampedDelta;
      s.waiting = false;

      if (s.cellT >= 1) {
        // Clear old cell from occupancy
        occ.delete(cellKey(s.col, s.row));
        s.col = s.targetCol;
        s.row = s.targetRow;
        s.cellT = 0;
      }
    }

    // ── Pick next target when at a cell ──
    if (s.cellT === 0) {
      const wp = waypoints[s.wpIndex];
      if (s.col === wp[0] && s.row === wp[1]) {
        s.wpIndex = (s.wpIndex + 1) % waypoints.length;
      }

      const goalWP = waypoints[s.wpIndex];
      const dc = Math.sign(goalWP[0] - s.col);
      const dr = Math.sign(goalWP[1] - s.row);

      // Preferred moves: toward waypoint first, then perpendiculars
      const moves: [number, number][] = [];
      if (dc !== 0) moves.push([dc, 0]);
      if (dr !== 0) moves.push([0, dr]);
      for (const [dirC, dirR] of DIRS) {
        if (!moves.some(m => m[0] === dirC && m[1] === dirR)) {
          moves.push([dirC, dirR]);
        }
      }

      // Check each candidate: must be in-bounds, not near mouse, not occupied by another robot
      let picked = false;
      for (const [mc, mr] of moves) {
        const nc = s.col + mc;
        const nr = s.row + mr;
        if (!inBounds(nc, nr)) continue;
        if (isCellNearMouse(nc, nr, mouse)) continue;
        // Check occupancy — another robot there?
        const occupant = occ.get(cellKey(nc, nr));
        if (occupant !== undefined && occupant !== id) continue;
        s.targetCol = nc;
        s.targetRow = nr;
        picked = true;
        break;
      }

      if (!picked) {
        s.waiting = true;
      }
    }

    // ── Compute world position ──
    const [curX, curZ] = cellToWorld(s.col, s.row);
    const [tgtX, tgtZ] = cellToWorld(s.targetCol, s.targetRow);
    groupRef.current.position.set(
      curX + (tgtX - curX) * s.cellT,
      RAIL_H * 0.5,
      curZ + (tgtZ - curZ) * s.cellT,
    );

    // ── Face direction of travel ──
    const dirX = s.targetCol - s.col;
    const dirZ = s.targetRow - s.row;
    if (dirX !== 0 || dirZ !== 0) {
      const targetRot = Math.atan2(dirX, dirZ);
      let diff = targetRot - groupRef.current.rotation.y;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      groupRef.current.rotation.y += diff * 0.15;
    }

    // ── Status light — faster pulse when near mouse or waiting ──
    if (lightRef.current) {
      const mat = lightRef.current.material as THREE.MeshBasicMaterial;
      const pulseSpeed = s.waiting ? 6 : mouseDist < BOOST_RADIUS ? 5 : 3;
      mat.opacity = 0.6 + Math.sin(t * pulseSpeed + id * 2) * 0.3;
    }
  });

  const bodyH = 0.28;
  const bodyW = 0.6;
  const bodyD = 0.6;

  return (
    <group ref={groupRef}>
      <mesh position={[0, bodyH / 2, 0]}>
        <boxGeometry args={[bodyW, bodyH, bodyD]} />
        <meshStandardMaterial color={COL_ROBOT_BODY} roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0, bodyH + 0.02, 0]}>
        <boxGeometry args={[bodyW + 0.02, 0.04, bodyD + 0.02]} />
        <meshStandardMaterial color={COL_ROBOT_TOP} roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[0, bodyH * 0.5, bodyD / 2 + 0.001]}>
        <planeGeometry args={[bodyW * 0.7, bodyH * 0.55]} />
        <meshBasicMaterial color="#0a0a0a" />
      </mesh>
      <mesh position={[0, bodyH * 0.5, bodyD / 2 + 0.003]}>
        <planeGeometry args={[bodyW * 0.35, bodyH * 0.3]} />
        <meshBasicMaterial color="#334155" transparent opacity={0.4} />
      </mesh>
      <mesh ref={lightRef} position={[0, bodyH + 0.08, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color={COL_ROBOT_LIGHT} transparent opacity={0.8} />
      </mesh>
      <pointLight position={[0, bodyH + 0.12, 0]} color={COL_ROBOT_LIGHT}
        intensity={0.3} distance={1.5} decay={2} />
      {([
        [-bodyW * 0.35, 0.04, bodyD * 0.35],
        [bodyW * 0.35, 0.04, bodyD * 0.35],
        [-bodyW * 0.35, 0.04, -bodyD * 0.35],
        [bodyW * 0.35, 0.04, -bodyD * 0.35],
      ] as [number, number, number][]).map((pos, i) => (
        <mesh key={i} position={pos} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.06, 8]} />
          <meshStandardMaterial color="#444" roughness={0.6} metalness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Scene composition ───
function Scene() {
  const sceneRef = useRef<THREE.Group>(null);
  const mouseWorldRef = useRef(new THREE.Vector3(999, 0, 999));
  const occupancyRef = useRef<OccupancyMap>(new Map());

  useFrame(({ clock }) => {
    if (!sceneRef.current) return;
    const t = clock.getElapsedTime();
    sceneRef.current.rotation.y = Math.sin(t * 0.06) * 0.015 - 0.1;
  });

  return (
    <MouseCtx.Provider value={mouseWorldRef}>
      <OccupancyCtx.Provider value={occupancyRef}>
        <MouseTracker mouseWorldRef={mouseWorldRef} />
        <group ref={sceneRef}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[8, 12, 6]} intensity={0.8} color="#e0e8f0" />
          <directionalLight position={[-5, 8, -4]} intensity={0.3} color="#94a3b8" />
          <fog attach="fog" args={["#0B1221", 12, 32]} />

          <RailGrid />
          <BinOpenings />

          {ROBOT_DEFS.map((def) => (
            <Robot key={def.id} id={def.id} waypoints={def.waypoints} speed={def.speed} />
          ))}
        </group>
      </OccupancyCtx.Provider>
    </MouseCtx.Provider>
  );
}

export default function AutoStoreGrid({ className = "" }: { className?: string }) {
  return (
    <div className={`${className}`}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [10, 13, 16], fov: 32, near: 0.1, far: 60 }}
        style={{ background: "transparent" }}
        onCreated={({ camera }) => { camera.lookAt(0, -0.5, 0); }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
