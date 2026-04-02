"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SensorBeamProps {
  position: [number, number, number];
}

export default function SensorBeam({ position }: SensorBeamProps) {
  const beamRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  // Scan line moving down
  const scanLineRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Beam pulse
    if (beamRef.current) {
      const material = beamRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.12 + Math.sin(t * 3) * 0.06;
    }

    // Ring rotation + pulse
    if (ringRef.current) {
      ringRef.current.rotation.y = t * 0.5;
      const scale = 1 + Math.sin(t * 2) * 0.1;
      ringRef.current.scale.set(scale, scale, scale);
    }

    // Scan line moving up and down
    if (scanLineRef.current) {
      const scanY = Math.sin(t * 1.5) * 0.4;
      scanLineRef.current.position.y = scanY;
      const mat = scanLineRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.3 + Math.sin(t * 3) * 0.15;
    }

    // Pulse ring at sensor
    if (pulseRef.current) {
      const pulseScale = 1 + (t % 2) * 0.3;
      const pulseOpacity = Math.max(0, 1 - (t % 2) * 0.5) * 0.15;
      pulseRef.current.scale.set(pulseScale, pulseScale, pulseScale);
      (pulseRef.current.material as THREE.MeshBasicMaterial).opacity = pulseOpacity;
    }
  });

  const beamHeight = 2.2;

  return (
    <group position={position}>
      {/* Sensor housing at top */}
      <mesh position={[0, beamHeight / 2 + 0.6, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 0.15, 8]} />
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#F59E0B"
          emissiveIntensity={0.8}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      {/* Pulse ring around sensor */}
      <mesh
        ref={pulseRef}
        position={[0, beamHeight / 2 + 0.55, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.15, 0.25, 16]} />
        <meshBasicMaterial
          color="#F59E0B"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Main beam cone */}
      <mesh ref={beamRef} position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.05, 0.4, beamHeight, 8, 1, true]} />
        <meshBasicMaterial
          color="#F59E0B"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Scan line plane moving through beam */}
      <mesh ref={scanLineRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.7, 0.7]} />
        <meshBasicMaterial
          color="#F59E0B"
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Rotating ring */}
      <mesh ref={ringRef} position={[0, beamHeight / 2 + 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.2, 0.015, 8, 16]} />
        <meshBasicMaterial
          color="#F59E0B"
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Point light from sensor */}
      <pointLight
        position={[0, beamHeight / 2 + 0.5, 0]}
        color="#F59E0B"
        intensity={0.8}
        distance={3}
      />
    </group>
  );
}
