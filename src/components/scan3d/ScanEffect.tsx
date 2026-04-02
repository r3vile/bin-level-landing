"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BIN_W, BIN_D, BIN_H } from "./binData";

interface Props {
  scanProgress: React.MutableRefObject<number>;
  binTopY: number;
}

export default function ScanEffect({ scanProgress, binTopY }: Props) {
  const lineRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);

  useFrame(() => {
    const sp = scanProgress.current;
    const visible = sp > 0 && sp < 1;

    if (lineRef.current) {
      lineRef.current.visible = visible;
      if (visible) {
        const y = binTopY - sp * BIN_H;
        lineRef.current.position.y = y;
      }
    }

    if (glowRef.current) {
      glowRef.current.visible = visible;
      if (visible) {
        const y = binTopY - sp * BIN_H;
        glowRef.current.position.y = y;
      }
    }

    if (lightRef.current) {
      lightRef.current.visible = visible;
      if (visible) {
        const y = binTopY - sp * BIN_H;
        lightRef.current.position.y = y + 0.3;
        lightRef.current.intensity = 1.5;
      }
    }
  });

  return (
    <group>
      {/* Main scan line */}
      <mesh ref={lineRef} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <planeGeometry args={[BIN_W * 0.95, BIN_D * 0.95]} />
        <meshBasicMaterial
          color="#F59E0B"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Glow band */}
      <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <planeGeometry args={[BIN_W * 1.0, BIN_D * 1.0]} />
        <meshBasicMaterial
          color="#F59E0B"
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Amber point light following scan */}
      <pointLight
        ref={lightRef}
        color="#F59E0B"
        intensity={0}
        distance={3}
        decay={2}
        visible={false}
      />
    </group>
  );
}
