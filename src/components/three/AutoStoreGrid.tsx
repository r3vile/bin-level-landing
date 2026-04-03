"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ─── Grid dimensions ───
const COLS = 16;
const ROWS = 10;
const CELL = 1.0; // cell size in world units
const RAIL_W = 0.06;
const RAIL_H = 0.04;
const GRID_W = COLS * CELL;
const GRID_H = ROWS * CELL;

// ─── Colour palette (AutoStore-inspired) ───
const COL_RAIL = "#8899aa";
const COL_RAIL_HIGHLIGHT = "#a0b4c4";
const COL_ROBOT_BODY = "#1a1a1a";
const COL_ROBOT_TOP = "#dc2626"; // AutoStore red
const COL_ROBOT_LIGHT = "#F59E0B"; // amber status light
const COL_BIN_INSIDE = "#0e1622";

// ─── Robot path definitions ───
// Each robot has a list of waypoints (grid col, grid row) it cycles through
const ROBOT_DEFS = [
  { id: 0, speed: 1.6, waypoints: [[2, 1], [2, 5], [7, 5], [7, 1]] },
  { id: 1, speed: 1.3, waypoints: [[10, 2], [10, 7], [14, 7], [14, 2]] },
  { id: 2, speed: 1.8, waypoints: [[5, 7], [12, 7], [12, 3], [5, 3]] },
  { id: 3, speed: 1.1, waypoints: [[1, 8], [8, 8], [8, 6], [1, 6]] },
  { id: 4, speed: 1.5, waypoints: [[13, 1], [13, 5], [15, 5], [15, 1]] },
  { id: 5, speed: 1.4, waypoints: [[3, 2], [3, 4], [6, 4], [6, 2]] },
];

// ─── Rail Grid ───
function RailGrid() {
  const gridRef = useRef<THREE.Group>(null);

  const { railGeo, railMat, railHighMat } = useMemo(() => {
    const geo = new THREE.BoxGeometry(1, RAIL_H, RAIL_W);
    const mat = new THREE.MeshStandardMaterial({
      color: COL_RAIL,
      roughness: 0.35,
      metalness: 0.7,
    });
    const highMat = new THREE.MeshStandardMaterial({
      color: COL_RAIL_HIGHLIGHT,
      roughness: 0.25,
      metalness: 0.8,
    });
    return { railGeo: geo, railMat: mat, railHighMat: highMat };
  }, []);

  // Build rail instances
  const rails = useMemo(() => {
    const items: { pos: [number, number, number]; rot: number; isOuter: boolean }[] = [];

    // Horizontal rails (along X)
    for (let r = 0; r <= ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        items.push({
          pos: [c * CELL + CELL / 2 - GRID_W / 2, 0, r * CELL - GRID_H / 2],
          rot: 0,
          isOuter: r === 0 || r === ROWS,
        });
      }
    }
    // Vertical rails (along Z)
    for (let c = 0; c <= COLS; c++) {
      for (let r = 0; r < ROWS; r++) {
        items.push({
          pos: [c * CELL - GRID_W / 2, 0, r * CELL + CELL / 2 - GRID_H / 2],
          rot: Math.PI / 2,
          isOuter: c === 0 || c === COLS,
        });
      }
    }
    return items;
  }, []);

  return (
    <group ref={gridRef}>
      {rails.map((rail, i) => (
        <mesh
          key={i}
          geometry={railGeo}
          material={rail.isOuter ? railHighMat : railMat}
          position={rail.pos}
          rotation={[0, rail.rot, 0]}
        />
      ))}
      {/* Intersection nubs — small cubes at each grid crossing */}
      {Array.from({ length: (COLS + 1) * (ROWS + 1) }, (_, i) => {
        const c = i % (COLS + 1);
        const r = Math.floor(i / (COLS + 1));
        return (
          <mesh
            key={`nub-${i}`}
            position={[c * CELL - GRID_W / 2, RAIL_H * 0.5, r * CELL - GRID_H / 2]}
          >
            <boxGeometry args={[RAIL_W * 1.6, RAIL_H * 0.5, RAIL_W * 1.6]} />
            <meshStandardMaterial color={COL_RAIL_HIGHLIGHT} roughness={0.3} metalness={0.8} />
          </mesh>
        );
      })}
    </group>
  );
}

// ─── Bin openings (dark squares visible through the grid) ───
function BinOpenings() {
  return (
    <instancedMesh args={[undefined, undefined, COLS * ROWS]}>
      <planeGeometry args={[CELL * 0.75, CELL * 0.75]} />
      <meshBasicMaterial color={COL_BIN_INSIDE} transparent opacity={0.6} />
      {Array.from({ length: COLS * ROWS }, (_, i) => {
        const c = i % COLS;
        const r = Math.floor(i / COLS);
        return (
          <group key={i}>
            <mesh
              position={[
                c * CELL + CELL / 2 - GRID_W / 2,
                -RAIL_H * 0.6,
                r * CELL + CELL / 2 - GRID_H / 2,
              ]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[CELL * 0.72, CELL * 0.72]} />
              <meshBasicMaterial color={COL_BIN_INSIDE} transparent opacity={0.5} />
            </mesh>
          </group>
        );
      })}
    </instancedMesh>
  );
}

// ─── Single Robot ───
function Robot({
  waypoints,
  speed,
  id,
}: {
  waypoints: number[][];
  speed: number;
  id: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(Math.random() * waypoints.length); // stagger start

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Advance along waypoints
    progressRef.current += speed * 0.008;
    const totalWP = waypoints.length;
    const loopProgress = progressRef.current % totalWP;
    const segIndex = Math.floor(loopProgress);
    const segT = loopProgress - segIndex;

    const from = waypoints[segIndex % totalWP];
    const to = waypoints[(segIndex + 1) % totalWP];

    // Smooth easing (smoothstep)
    const smoothT = segT * segT * (3 - 2 * segT);

    const x = (from[0] + (to[0] - from[0]) * smoothT) * CELL + CELL / 2 - GRID_W / 2;
    const z = (from[1] + (to[1] - from[1]) * smoothT) * CELL + CELL / 2 - GRID_H / 2;

    groupRef.current.position.set(x, RAIL_H * 0.5, z);

    // Face direction of travel
    const dx = to[0] - from[0];
    const dz = to[1] - from[1];
    if (dx !== 0 || dz !== 0) {
      groupRef.current.rotation.y = Math.atan2(dx, dz);
    }

    // Pulsing status light
    if (lightRef.current) {
      const mat = lightRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.6 + Math.sin(t * 3 + id * 2) * 0.3;
    }
  });

  const bodyH = 0.28;
  const bodyW = 0.6;
  const bodyD = 0.6;

  return (
    <group ref={groupRef}>
      {/* Body (dark) */}
      <mesh position={[0, bodyH / 2, 0]}>
        <boxGeometry args={[bodyW, bodyH, bodyD]} />
        <meshStandardMaterial color={COL_ROBOT_BODY} roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Top plate (red) */}
      <mesh position={[0, bodyH + 0.02, 0]}>
        <boxGeometry args={[bodyW + 0.02, 0.04, bodyD + 0.02]} />
        <meshStandardMaterial color={COL_ROBOT_TOP} roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Display face (front dark panel) */}
      <mesh position={[0, bodyH * 0.5, bodyD / 2 + 0.001]}>
        <planeGeometry args={[bodyW * 0.7, bodyH * 0.55]} />
        <meshBasicMaterial color="#0a0a0a" />
      </mesh>

      {/* Number on display */}
      <mesh position={[0, bodyH * 0.5, bodyD / 2 + 0.003]}>
        <planeGeometry args={[bodyW * 0.35, bodyH * 0.3]} />
        <meshBasicMaterial color="#334155" transparent opacity={0.4} />
      </mesh>

      {/* Status light (amber on top) */}
      <mesh ref={lightRef} position={[0, bodyH + 0.08, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial
          color={COL_ROBOT_LIGHT}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Light glow */}
      <pointLight
        position={[0, bodyH + 0.12, 0]}
        color={COL_ROBOT_LIGHT}
        intensity={0.3}
        distance={1.5}
        decay={2}
      />

      {/* Wheels (4 small cylinders) */}
      {[
        [-bodyW * 0.35, 0.04, bodyD * 0.35],
        [bodyW * 0.35, 0.04, bodyD * 0.35],
        [-bodyW * 0.35, 0.04, -bodyD * 0.35],
        [bodyW * 0.35, 0.04, -bodyD * 0.35],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
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

  useFrame(({ clock }) => {
    if (!sceneRef.current) return;
    // Very subtle sway
    const t = clock.getElapsedTime();
    sceneRef.current.rotation.y = Math.sin(t * 0.06) * 0.015 - 0.1;
  });

  return (
    <group ref={sceneRef}>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[8, 12, 6]} intensity={0.8} color="#e0e8f0" />
      <directionalLight position={[-5, 8, -4]} intensity={0.3} color="#94a3b8" />

      {/* Slight fog for depth */}
      <fog attach="fog" args={["#0B1221", 8, 22]} />

      <RailGrid />
      <BinOpenings />

      {ROBOT_DEFS.map((def) => (
        <Robot key={def.id} id={def.id} waypoints={def.waypoints} speed={def.speed} />
      ))}
    </group>
  );
}

export default function AutoStoreGrid({ className = "" }: { className?: string }) {
  return (
    <div className={`${className}`}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{
          position: [6, 8, 10],
          fov: 32,
          near: 0.1,
          far: 50,
        }}
        style={{ background: "transparent" }}
        onCreated={({ camera }) => {
          camera.lookAt(0, -0.5, 0);
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
