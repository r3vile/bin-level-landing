"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BIN_W, BIN_D, BIN_H, APT_W, APT_D } from "./binData";
import type { Product3D } from "./binData";
import BinProducts from "./BinProducts";
import ScanEffect from "./ScanEffect";
import HeatmapOverlay from "./HeatmapOverlay";

const WALL = 0.04;
const binColor = new THREE.Color("#6b7280");

// Clipping planes to restrict visibility to aperture
const clipPlanes = [
  new THREE.Plane(new THREE.Vector3(1, 0, 0), APT_W / 2),   // left clip
  new THREE.Plane(new THREE.Vector3(-1, 0, 0), APT_W / 2),  // right clip
  new THREE.Plane(new THREE.Vector3(0, 0, 1), APT_D / 2),   // front clip
  new THREE.Plane(new THREE.Vector3(0, 0, -1), APT_D / 2),  // back clip
];

const wallMat = new THREE.MeshStandardMaterial({
  color: binColor,
  roughness: 0.85,
  metalness: 0.05,
  clippingPlanes: clipPlanes,
  clipShadows: true,
  side: THREE.DoubleSide,
});

const gridMat = new THREE.LineBasicMaterial({
  color: "#4b5563",
  transparent: true,
  opacity: 0.3,
  clippingPlanes: clipPlanes,
});

interface Props {
  products: Product3D[];
  binOffX: React.MutableRefObject<number>;
  scanProgress: React.MutableRefObject<number>;
}

export default function Bin({ products, binOffX, scanProgress }: Props) {
  const groupRef = useRef<THREE.Group>(null!);

  // Bin sits below the workspace surface
  const binTopY = -0.02;
  const binFloorY = binTopY - BIN_H;

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.x = binOffX.current;
    }
  });

  // Grid lines inside bin (bottom face)
  const gridGeom = useMemo(() => {
    const points: THREE.Vector3[] = [];
    // Vertical lines (along Z)
    for (let i = 1; i < 4; i++) {
      const x = -BIN_W / 2 + (BIN_W / 4) * i;
      points.push(new THREE.Vector3(x, binFloorY + 0.005, -BIN_D / 2));
      points.push(new THREE.Vector3(x, binFloorY + 0.005, BIN_D / 2));
    }
    // Horizontal lines (along X)
    for (let i = 1; i < 3; i++) {
      const z = -BIN_D / 2 + (BIN_D / 3) * i;
      points.push(new THREE.Vector3(-BIN_W / 2, binFloorY + 0.005, z));
      points.push(new THREE.Vector3(BIN_W / 2, binFloorY + 0.005, z));
    }
    const g = new THREE.BufferGeometry().setFromPoints(points);
    return g;
  }, [binFloorY]);

  return (
    <group ref={groupRef}>
      {/* Bottom */}
      <mesh position={[0, binFloorY, 0]} material={wallMat}>
        <boxGeometry args={[BIN_W, WALL, BIN_D]} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-BIN_W / 2, binTopY - BIN_H / 2, 0]} material={wallMat}>
        <boxGeometry args={[WALL, BIN_H, BIN_D]} />
      </mesh>
      {/* Right wall */}
      <mesh position={[BIN_W / 2, binTopY - BIN_H / 2, 0]} material={wallMat}>
        <boxGeometry args={[WALL, BIN_H, BIN_D]} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, binTopY - BIN_H / 2, -BIN_D / 2]} material={wallMat}>
        <boxGeometry args={[BIN_W, BIN_H, WALL]} />
      </mesh>
      {/* Front wall */}
      <mesh position={[0, binTopY - BIN_H / 2, BIN_D / 2]} material={wallMat}>
        <boxGeometry args={[BIN_W, BIN_H, WALL]} />
      </mesh>

      {/* Grid lines on floor */}
      <lineSegments geometry={gridGeom} material={gridMat} />

      {/* Products */}
      <BinProducts products={products} scanProgress={scanProgress} binFloorY={binFloorY + WALL / 2} />

      {/* Heatmap red floor */}
      <HeatmapOverlay scanProgress={scanProgress} binFloorY={binFloorY + WALL / 2 + 0.001} />

      {/* Scan laser plane */}
      <ScanEffect scanProgress={scanProgress} binTopY={binTopY} />
    </group>
  );
}
