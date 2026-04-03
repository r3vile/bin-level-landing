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

// ─── Shared mouse world-position (on the grid plane) ───
const MouseCtx = createContext<React.RefObject<THREE.Vector3>>(null!);

// ─── Robot path definitions (slower speeds) ───
const ROBOT_DEFS = [
  { id: 0, speed: 0.45, waypoints: [[2, 1], [2, 5], [7, 5], [7, 1]] },
  { id: 1, speed: 0.35, waypoints: [[10, 2], [10, 7], [14, 7], [14, 2]] },
  { id: 2, speed: 0.5, waypoints: [[5, 7], [12, 7], [12, 3], [5, 3]] },
  { id: 3, speed: 0.3, waypoints: [[1, 8], [8, 8], [8, 6], [1, 6]] },
  { id: 4, speed: 0.4, waypoints: [[13, 1], [13, 5], [15, 5], [15, 1]] },
  { id: 5, speed: 0.38, waypoints: [[3, 2], [3, 4], [6, 4], [6, 2]] },
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

// ─── Single Robot with mouse avoidance ───
function Robot({ waypoints, speed, id }: { waypoints: number[][]; speed: number; id: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.Mesh>(null);
  const mouseWorldRef = useContext(MouseCtx);

  // Mutable state kept in refs for performance
  const state = useRef({
    progress: Math.random() * waypoints.length,
    paused: false,
    pauseTimer: 0,
    currentSpeed: speed,
  });

  useFrame(({ clock }, delta) => {
    if (!groupRef.current || !mouseWorldRef.current) return;
    const t = clock.getElapsedTime();
    const s = state.current;

    // Compute base position from waypoints
    const totalWP = waypoints.length;
    const loopProgress = s.progress % totalWP;
    const segIndex = Math.floor(loopProgress);
    const segT = loopProgress - segIndex;
    const smoothT = segT * segT * (3 - 2 * segT);

    const from = waypoints[segIndex % totalWP];
    const to = waypoints[(segIndex + 1) % totalWP];

    const baseX = (from[0] + (to[0] - from[0]) * smoothT) * CELL + CELL / 2 - GRID_W / 2;
    const baseZ = (from[1] + (to[1] - from[1]) * smoothT) * CELL + CELL / 2 - GRID_H / 2;

    // Mouse avoidance — speed up along the rail to flee
    const mx = mouseWorldRef.current.x;
    const mz = mouseWorldRef.current.z;
    const dx = baseX - mx;
    const dz = baseZ - mz;
    const dist = Math.sqrt(dx * dx + dz * dz);

    const FLEE_RADIUS = 3.0;
    const SLOW_RADIUS = 5.0;

    let speedMult = 1.0;
    if (dist < FLEE_RADIUS) {
      // If traveling away from mouse (dot > 0), speed up to flee
      // If traveling toward mouse (dot < 0), also speed up to pass through faster
      const urgency = (1 - dist / FLEE_RADIUS);
      speedMult = 1.0 + urgency * urgency * 3.5;
    } else if (dist < SLOW_RADIUS) {
      const t2 = (dist - FLEE_RADIUS) / (SLOW_RADIUS - FLEE_RADIUS);
      const urgency = 1 - t2;
      speedMult = 1.0 + urgency * urgency * 1.5;
    }

    // Advance along path (clamped delta to avoid jumps on tab switch)
    const clampedDelta = Math.min(delta, 0.05);
    s.progress += speed * clampedDelta * speedMult;

    // Recompute position after speed adjustment (robot stays on rail)
    const newLoopProgress = s.progress % totalWP;
    const newSegIndex = Math.floor(newLoopProgress);
    const newSegT = newLoopProgress - newSegIndex;
    const newSmoothT = newSegT * newSegT * (3 - 2 * newSegT);
    const newFrom = waypoints[newSegIndex % totalWP];
    const newTo = waypoints[(newSegIndex + 1) % totalWP];
    const targetX = (newFrom[0] + (newTo[0] - newFrom[0]) * newSmoothT) * CELL + CELL / 2 - GRID_W / 2;
    const targetZ = (newFrom[1] + (newTo[1] - newFrom[1]) * newSmoothT) * CELL + CELL / 2 - GRID_H / 2;

    // Smooth position (stays exactly on grid rails)
    const prevX = groupRef.current.position.x;
    const prevZ = groupRef.current.position.z;
    const lerpFactor = 0.12;

    groupRef.current.position.set(
      prevX + (targetX - prevX) * lerpFactor,
      RAIL_H * 0.5,
      prevZ + (targetZ - prevZ) * lerpFactor,
    );

    // Face direction of travel (use current segment after flee)
    const dirX = newTo[0] - newFrom[0];
    const dirZ = newTo[1] - newFrom[1];
    if (dirX !== 0 || dirZ !== 0) {
      const targetRot = Math.atan2(dirX, dirZ);
      // Smooth rotation
      const currentRot = groupRef.current.rotation.y;
      let diff = targetRot - currentRot;
      // Wrap angle
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      groupRef.current.rotation.y += diff * 0.1;
    }

    // Pulsing status light — faster when fleeing
    if (lightRef.current) {
      const mat = lightRef.current.material as THREE.MeshBasicMaterial;
      const pulseSpeed = dist < FLEE_RADIUS ? 8 : 3;
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

  useFrame(({ clock }) => {
    if (!sceneRef.current) return;
    const t = clock.getElapsedTime();
    sceneRef.current.rotation.y = Math.sin(t * 0.06) * 0.015 - 0.1;
  });

  return (
    <MouseCtx.Provider value={mouseWorldRef}>
      <MouseTracker mouseWorldRef={mouseWorldRef} />
      <group ref={sceneRef}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[8, 12, 6]} intensity={0.8} color="#e0e8f0" />
        <directionalLight position={[-5, 8, -4]} intensity={0.3} color="#94a3b8" />
        <fog attach="fog" args={["#0B1221", 8, 22]} />

        <RailGrid />
        <BinOpenings />

        {ROBOT_DEFS.map((def) => (
          <Robot key={def.id} id={def.id} waypoints={def.waypoints} speed={def.speed} />
        ))}
      </group>
    </MouseCtx.Provider>
  );
}

export default function AutoStoreGrid({ className = "" }: { className?: string }) {
  return (
    <div className={`${className}`}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [6, 8, 10], fov: 32, near: 0.1, far: 50 }}
        style={{ background: "transparent" }}
        onCreated={({ camera }) => { camera.lookAt(0, -0.5, 0); }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
