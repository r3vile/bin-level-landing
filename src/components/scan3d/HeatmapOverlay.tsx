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
    // Fade in red floor with a soft ramp — peaks at 0.55 opacity
    if (sp > 0) {
      const target = Math.min(sp * 1.5, 0.55);
      matRef.current.opacity = THREE.MathUtils.lerp(matRef.current.opacity, target, 0.1);
      // Add subtle emissive glow to the red floor
      matRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        matRef.current.emissiveIntensity,
        0.25,
        0.08,
      );
    } else {
      matRef.current.opacity = THREE.MathUtils.lerp(matRef.current.opacity, 0, 0.15);
      matRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        matRef.current.emissiveIntensity,
        0,
        0.15,
      );
    }
  });

  return (
    <mesh position={[0, binFloorY + 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[BIN_W * 0.95, BIN_D * 0.95]} />
      <meshStandardMaterial
        ref={matRef}
        color="#cc2200"
        emissive="#cc2200"
        emissiveIntensity={0}
        transparent
        opacity={0}
        roughness={0.85}
        depthWrite={false}
      />
    </mesh>
  );
}
