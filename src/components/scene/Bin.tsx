"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface BinProps {
  position: [number, number, number];
  fillLevel: number; // 0.0 - 1.0
  isScanning?: boolean;
}

export default function Bin({ position, fillLevel, isScanning = false }: BinProps) {
  const glowRef = useRef<THREE.Mesh>(null);
  const fillRef = useRef<THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>>(null);

  const isLow = fillLevel < 0.35;
  const fillColor = isLow ? "#F59E0B" : "#10B981";
  const emissiveIntensity = isLow ? 0.4 : 0.15;

  // Pulsing glow for low-fill bins
  useFrame((state) => {
    if (glowRef.current && isLow) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.15 + 0.85;
      glowRef.current.scale.setScalar(pulse);
    }
    if (fillRef.current && isScanning) {
      const scanPulse = Math.sin(state.clock.elapsedTime * 4) * 0.1 + 0.9;
      fillRef.current.material.opacity = 0.6 * scanPulse;
    }
  });

  const binHeight = 1;
  const binSize = 0.85;
  const fillHeight = fillLevel * binHeight;
  const fillY = -binHeight / 2 + fillHeight / 2;

  const edgeMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "#475569",
        transparent: true,
        opacity: 0.3,
      }),
    []
  );

  return (
    <group position={position}>
      {/* Bin wireframe edges */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(binSize, binHeight, binSize)]} />
        <primitive object={edgeMaterial} />
      </lineSegments>

      {/* Fill level */}
      {fillLevel > 0 && (
        <mesh ref={fillRef} position={[0, fillY, 0]}>
          <boxGeometry args={[binSize - 0.04, fillHeight, binSize - 0.04]} />
          <meshStandardMaterial
            color={fillColor}
            emissive={fillColor}
            emissiveIntensity={emissiveIntensity}
            transparent
            opacity={0.55}
          />
        </mesh>
      )}

      {/* Glow sphere for low-fill bins */}
      {isLow && (
        <mesh ref={glowRef} position={[0, 0, 0]}>
          <sphereGeometry args={[0.6, 8, 8]} />
          <meshBasicMaterial
            color="#F59E0B"
            transparent
            opacity={0.04}
          />
        </mesh>
      )}

      {/* Top highlight line when scanning */}
      {isScanning && (
        <mesh position={[0, binHeight / 2 + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[binSize, binSize]} />
          <meshBasicMaterial
            color="#F59E0B"
            transparent
            opacity={0.15}
          />
        </mesh>
      )}
    </group>
  );
}
