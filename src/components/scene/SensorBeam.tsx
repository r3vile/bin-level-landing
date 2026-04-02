"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SensorBeamProps {
  active: boolean; // whether the scan is happening
}

export default function SensorBeam({ active }: SensorBeamProps) {
  const beamRef = useRef<THREE.Mesh>(null);
  const sensorRef = useRef<THREE.Mesh>(null);
  const scanLineRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (beamRef.current) {
      const mat = beamRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = active ? 0.08 + Math.sin(t * 3) * 0.04 : 0;
    }

    if (sensorRef.current) {
      const mat = sensorRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = active ? 1.2 + Math.sin(t * 4) * 0.4 : 0.2;
    }

    if (scanLineRef.current) {
      scanLineRef.current.visible = active;
      if (active) {
        // Scan line sweeps down through the beam
        const sweep = ((t * 0.8) % 1);
        scanLineRef.current.position.y = 1.1 - sweep * 1.3;
        const mat = scanLineRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.15 + Math.sin(sweep * Math.PI) * 0.15;
      }
    }

    if (ringRef.current) {
      ringRef.current.visible = active;
      ringRef.current.rotation.z = t * 1.5;
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = active ? 0.25 + Math.sin(t * 2) * 0.1 : 0;
    }
  });

  return (
    <group position={[0, 1.4, 0]}>
      {/* Sensor device housing */}
      <mesh ref={sensorRef} position={[0, 0, 0]}>
        <boxGeometry args={[0.22, 0.1, 0.18]} />
        <meshStandardMaterial
          color="#1a1a2e"
          emissive="#F59E0B"
          emissiveIntensity={0.2}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      {/* Sensor lens */}
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.02, 12]} />
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#F59E0B"
          emissiveIntensity={active ? 1.5 : 0.3}
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>

      {/* Status LED */}
      <mesh position={[0.08, 0.05, 0.09]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial
          color={active ? "#10B981" : "#64748B"}
          emissive={active ? "#10B981" : "#64748B"}
          emissiveIntensity={active ? 2 : 0.3}
        />
      </mesh>

      {/* Beam cone — wider at bottom (bin surface) */}
      <mesh ref={beamRef} position={[0, -0.75, 0]}>
        <cylinderGeometry args={[0.03, 0.7, 1.4, 12, 1, true]} />
        <meshBasicMaterial
          color="#F59E0B"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Sweep scan line */}
      <mesh ref={scanLineRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 0.6, 16]} />
        <meshBasicMaterial
          color="#F59E0B"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Rotating ring indicator */}
      <mesh ref={ringRef} position={[0, -0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.12, 0.008, 8, 24]} />
        <meshBasicMaterial color="#F59E0B" transparent opacity={0} />
      </mesh>

      {/* Point light from sensor */}
      {active && (
        <pointLight position={[0, -0.1, 0]} color="#F59E0B" intensity={0.6} distance={2.5} />
      )}
    </group>
  );
}
