"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BIN_W, BIN_D, BIN_H, APT_W, APT_D } from "./binData";
import type { Product3D } from "./binData";
import BinProducts from "./BinProducts";
import ScanEffect from "./ScanEffect";
import HeatmapOverlay from "./HeatmapOverlay";

const WALL = 0.045;
const RIB_DEPTH = 0.025;
const RIB_WIDTH = 0.03;
const LIP_H = 0.06;
const LIP_OVERHANG = 0.03;

// Clipping planes to restrict visibility to aperture
const clipPlanes = [
  new THREE.Plane(new THREE.Vector3(1, 0, 0), APT_W / 2),
  new THREE.Plane(new THREE.Vector3(-1, 0, 0), APT_W / 2),
  new THREE.Plane(new THREE.Vector3(0, 0, 1), APT_D / 2),
  new THREE.Plane(new THREE.Vector3(0, 0, -1), APT_D / 2),
];

// Outer wall — lighter gray plastic
const wallMat = new THREE.MeshStandardMaterial({
  color: "#8b9099",
  roughness: 0.55,
  metalness: 0.02,
  clippingPlanes: clipPlanes,
  clipShadows: true,
  side: THREE.DoubleSide,
});

// Inner wall — darker gray (shadow side)
const innerMat = new THREE.MeshStandardMaterial({
  color: "#5c6370",
  roughness: 0.65,
  metalness: 0.02,
  clippingPlanes: clipPlanes,
  clipShadows: true,
  side: THREE.DoubleSide,
});

// Ribs — slightly darker than outer wall
const ribMat = new THREE.MeshStandardMaterial({
  color: "#6e747c",
  roughness: 0.5,
  metalness: 0.03,
  clippingPlanes: clipPlanes,
  clipShadows: true,
});

// Lip — lighter, catches more light
const lipMat = new THREE.MeshStandardMaterial({
  color: "#969ca4",
  roughness: 0.45,
  metalness: 0.03,
  clippingPlanes: clipPlanes,
  clipShadows: true,
});

const gridMat = new THREE.LineBasicMaterial({
  color: "#4b5563",
  transparent: true,
  opacity: 0.15,
  clippingPlanes: clipPlanes,
});

// Generate rib positions along a given length
function ribPositions(length: number, count: number): number[] {
  const positions: number[] = [];
  const spacing = length / (count + 1);
  for (let i = 1; i <= count; i++) {
    positions.push(-length / 2 + spacing * i);
  }
  return positions;
}

interface Props {
  products: Product3D[];
  binOffX: React.MutableRefObject<number>;
  scanProgress: React.MutableRefObject<number>;
}

export default function Bin({ products, binOffX, scanProgress }: Props) {
  const groupRef = useRef<THREE.Group>(null!);

  const binTopY = -0.02;
  const binFloorY = binTopY - BIN_H;

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.x = binOffX.current;
    }
  });

  // Rib positions
  const xRibs = useMemo(() => ribPositions(BIN_W, 7), []);
  const zRibs = useMemo(() => ribPositions(BIN_D, 5), []);

  // Grid lines on floor
  const gridGeom = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 1; i < 4; i++) {
      const x = -BIN_W / 2 + (BIN_W / 4) * i;
      points.push(new THREE.Vector3(x, binFloorY + 0.005, -BIN_D / 2));
      points.push(new THREE.Vector3(x, binFloorY + 0.005, BIN_D / 2));
    }
    for (let i = 1; i < 3; i++) {
      const z = -BIN_D / 2 + (BIN_D / 3) * i;
      points.push(new THREE.Vector3(-BIN_W / 2, binFloorY + 0.005, z));
      points.push(new THREE.Vector3(BIN_W / 2, binFloorY + 0.005, z));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [binFloorY]);

  const midY = binTopY - BIN_H / 2;

  return (
    <group ref={groupRef}>
      {/* ── Floor ── */}
      <mesh position={[0, binFloorY, 0]} material={innerMat}>
        <boxGeometry args={[BIN_W, WALL, BIN_D]} />
      </mesh>

      {/* ── Inner walls (darker) ── */}
      <mesh position={[-BIN_W / 2 + WALL / 2, midY, 0]} material={innerMat}>
        <boxGeometry args={[WALL, BIN_H, BIN_D]} />
      </mesh>
      <mesh position={[BIN_W / 2 - WALL / 2, midY, 0]} material={innerMat}>
        <boxGeometry args={[WALL, BIN_H, BIN_D]} />
      </mesh>
      <mesh position={[0, midY, -BIN_D / 2 + WALL / 2]} material={innerMat}>
        <boxGeometry args={[BIN_W, BIN_H, WALL]} />
      </mesh>
      <mesh position={[0, midY, BIN_D / 2 - WALL / 2]} material={innerMat}>
        <boxGeometry args={[BIN_W, BIN_H, WALL]} />
      </mesh>

      {/* ── Outer walls (lighter) ── */}
      <mesh position={[-BIN_W / 2 - 0.001, midY, 0]} material={wallMat}>
        <boxGeometry args={[0.005, BIN_H, BIN_D + 0.01]} />
      </mesh>
      <mesh position={[BIN_W / 2 + 0.001, midY, 0]} material={wallMat}>
        <boxGeometry args={[0.005, BIN_H, BIN_D + 0.01]} />
      </mesh>
      <mesh position={[0, midY, -BIN_D / 2 - 0.001]} material={wallMat}>
        <boxGeometry args={[BIN_W + 0.01, BIN_H, 0.005]} />
      </mesh>
      <mesh position={[0, midY, BIN_D / 2 + 0.001]} material={wallMat}>
        <boxGeometry args={[BIN_W + 0.01, BIN_H, 0.005]} />
      </mesh>

      {/* ── Vertical ribs on long walls (left/right) ── */}
      {zRibs.map((z, i) => (
        <group key={`lr-${i}`}>
          {/* Left wall rib */}
          <mesh position={[-BIN_W / 2 - RIB_DEPTH / 2, midY, z]} material={ribMat}>
            <boxGeometry args={[RIB_DEPTH, BIN_H * 0.92, RIB_WIDTH]} />
          </mesh>
          {/* Right wall rib */}
          <mesh position={[BIN_W / 2 + RIB_DEPTH / 2, midY, z]} material={ribMat}>
            <boxGeometry args={[RIB_DEPTH, BIN_H * 0.92, RIB_WIDTH]} />
          </mesh>
        </group>
      ))}

      {/* ── Vertical ribs on short walls (front/back) ── */}
      {xRibs.map((x, i) => (
        <group key={`fb-${i}`}>
          {/* Back wall rib */}
          <mesh position={[x, midY, -BIN_D / 2 - RIB_DEPTH / 2]} material={ribMat}>
            <boxGeometry args={[RIB_WIDTH, BIN_H * 0.92, RIB_DEPTH]} />
          </mesh>
          {/* Front wall rib */}
          <mesh position={[x, midY, BIN_D / 2 + RIB_DEPTH / 2]} material={ribMat}>
            <boxGeometry args={[RIB_WIDTH, BIN_H * 0.92, RIB_DEPTH]} />
          </mesh>
        </group>
      ))}

      {/* ── Top lip / rim ── */}
      {/* Left lip */}
      <mesh position={[-BIN_W / 2 - LIP_OVERHANG / 2, binTopY + LIP_H / 2, 0]} material={lipMat}>
        <boxGeometry args={[WALL + LIP_OVERHANG + RIB_DEPTH, LIP_H, BIN_D + (WALL + LIP_OVERHANG + RIB_DEPTH) * 2]} />
      </mesh>
      {/* Right lip */}
      <mesh position={[BIN_W / 2 + LIP_OVERHANG / 2, binTopY + LIP_H / 2, 0]} material={lipMat}>
        <boxGeometry args={[WALL + LIP_OVERHANG + RIB_DEPTH, LIP_H, BIN_D + (WALL + LIP_OVERHANG + RIB_DEPTH) * 2]} />
      </mesh>
      {/* Back lip */}
      <mesh position={[0, binTopY + LIP_H / 2, -BIN_D / 2 - LIP_OVERHANG / 2]} material={lipMat}>
        <boxGeometry args={[BIN_W - WALL * 2, LIP_H, WALL + LIP_OVERHANG + RIB_DEPTH]} />
      </mesh>
      {/* Front lip */}
      <mesh position={[0, binTopY + LIP_H / 2, BIN_D / 2 + LIP_OVERHANG / 2]} material={lipMat}>
        <boxGeometry args={[BIN_W - WALL * 2, LIP_H, WALL + LIP_OVERHANG + RIB_DEPTH]} />
      </mesh>

      {/* Grid lines on floor */}
      <lineSegments geometry={gridGeom} material={gridMat} />

      {/* Products */}
      <BinProducts products={products} scanProgress={scanProgress} binFloorY={binFloorY + WALL / 2} />

      {/* Heatmap red floor */}
      <HeatmapOverlay scanProgress={scanProgress} binFloorY={binFloorY + WALL / 2 + 0.001} />

      {/* Scan laser */}
      <ScanEffect scanProgress={scanProgress} binTopY={binTopY} />
    </group>
  );
}
