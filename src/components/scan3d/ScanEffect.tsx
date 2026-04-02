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
  const wideGlowRef = useRef<THREE.Mesh>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);
  const trailRef = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    const sp = scanProgress.current;
    const visible = sp > 0 && sp < 1;
    const y = binTopY - sp * BIN_H;

    // Main bright scan line
    if (lineRef.current) {
      lineRef.current.visible = visible;
      if (visible) lineRef.current.position.y = y;
    }

    // Inner glow
    if (glowRef.current) {
      glowRef.current.visible = visible;
      if (visible) {
        glowRef.current.position.y = y;
        // Pulse the glow slightly
        const pulse = 0.12 + Math.sin(sp * Math.PI * 8) * 0.04;
        (glowRef.current.material as THREE.MeshBasicMaterial).opacity = pulse;
      }
    }

    // Wide ambient glow
    if (wideGlowRef.current) {
      wideGlowRef.current.visible = visible;
      if (visible) wideGlowRef.current.position.y = y;
    }

    // Trailing light band (above scan line — area already scanned glows briefly)
    if (trailRef.current) {
      trailRef.current.visible = visible;
      if (visible) {
        trailRef.current.position.y = y + 0.12;
        const trailOpacity = Math.max(0, 0.06 - sp * 0.02);
        (trailRef.current.material as THREE.MeshBasicMaterial).opacity = trailOpacity;
      }
    }

    // Dynamic amber point light
    if (lightRef.current) {
      lightRef.current.visible = visible;
      if (visible) {
        lightRef.current.position.y = y + 0.5;
        lightRef.current.intensity = 2.0 + Math.sin(sp * Math.PI * 6) * 0.5;
      }
    }
  });

  return (
    <group>
      {/* Core scan line — bright and thin */}
      <mesh ref={lineRef} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <planeGeometry args={[BIN_W * 0.96, BIN_D * 0.96]} />
        <meshBasicMaterial
          color="#fbbf24"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner glow halo */}
      <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <planeGeometry args={[BIN_W * 1.02, BIN_D * 1.02]} />
        <meshBasicMaterial
          color="#f59e0b"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Wide atmospheric glow */}
      <mesh ref={wideGlowRef} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <planeGeometry args={[BIN_W * 1.3, BIN_D * 1.3]} />
        <meshBasicMaterial
          color="#f59e0b"
          transparent
          opacity={0.035}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Light trail behind scan */}
      <mesh ref={trailRef} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <planeGeometry args={[BIN_W * 0.9, BIN_D * 0.9]} />
        <meshBasicMaterial
          color="#fbbf24"
          transparent
          opacity={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Dynamic amber point light */}
      <pointLight
        ref={lightRef}
        color="#f59e0b"
        intensity={0}
        distance={4}
        decay={2}
        visible={false}
      />
    </group>
  );
}
