"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BIN_W, BIN_D } from "./binData";

interface Props {
  scanProgress: React.MutableRefObject<number>;
  binFloorY: number;
}

export default function HeatmapOverlay({ scanProgress, binFloorY }: Props) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null!);

  useFrame(() => {
    if (!matRef.current) return;
    const sp = scanProgress.current;
    // Fade in red floor as scan reveals
    matRef.current.opacity = sp > 0 ? Math.min(sp * 1.2, 0.7) : 0;
  });

  return (
    <mesh position={[0, binFloorY + 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[BIN_W * 0.95, BIN_D * 0.95]} />
      <meshStandardMaterial
        ref={matRef}
        color="#cc2200"
        transparent
        opacity={0}
        roughness={0.9}
        depthWrite={false}
      />
    </mesh>
  );
}
