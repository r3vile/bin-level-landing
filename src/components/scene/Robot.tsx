"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface RobotProps {
  pathPoints: [number, number][];
  speed?: number;
  color?: string;
}

export default function Robot({ pathPoints, speed = 0.15, color = "#F59E0B" }: RobotProps) {
  const groupRef = useRef<THREE.Group>(null);
  const progressRef = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current || pathPoints.length < 2) return;

    progressRef.current += delta * speed;
    const totalSegments = pathPoints.length - 1;
    const loopProgress = progressRef.current % totalSegments;
    const segmentIndex = Math.floor(loopProgress);
    const segmentT = loopProgress - segmentIndex;

    const from = pathPoints[segmentIndex % pathPoints.length];
    const to = pathPoints[(segmentIndex + 1) % pathPoints.length];

    const x = from[0] + (to[0] - from[0]) * segmentT;
    const z = from[1] + (to[1] - from[1]) * segmentT;

    groupRef.current.position.x = x;
    groupRef.current.position.z = z;
  });

  const y = 0.62;

  return (
    <group ref={groupRef} position={[pathPoints[0][0], y, pathPoints[0][1]]}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.5, 0.22, 0.5]} />
        <meshStandardMaterial
          color="#334155"
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
      {/* Wheel housings */}
      <mesh position={[0, 0.14, 0]}>
        <boxGeometry args={[0.35, 0.08, 0.35]} />
        <meshStandardMaterial
          color="#475569"
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>
      {/* Status light */}
      <mesh position={[0, 0.22, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
        />
      </mesh>
      {/* Light glow */}
      <pointLight
        position={[0, 0.22, 0]}
        color={color}
        intensity={0.3}
        distance={1.5}
      />
    </group>
  );
}
