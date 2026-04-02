"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import BinGrid from "./scene/BinGrid";
import Robot from "./scene/Robot";
import SensorBeam from "./scene/SensorBeam";
import FloatingParticles from "./scene/FloatingParticles";

// Gentle mouse-following camera movement
function CameraRig() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const { pointer } = state;
    // Subtle rotation based on mouse position
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      pointer.x * 0.15,
      0.05
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      pointer.y * 0.08,
      0.05
    );
  });

  return <group ref={groupRef} />;
}

export default function AutoStoreScene({ className = "" }: { className?: string }) {
  // Robot paths across the grid (x, z coordinates)
  const robotPath1: [number, number][] = [
    [-1.65, -1.65],
    [1.65, -1.65],
    [1.65, -0.55],
    [-1.65, -0.55],
    [-1.65, -1.65],
  ];

  const robotPath2: [number, number][] = [
    [0.55, 1.65],
    [0.55, -1.65],
    [1.65, -1.65],
    [1.65, 1.65],
    [0.55, 1.65],
  ];

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [7, 5.5, 7], fov: 32 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.2} color="#94A3B8" />
          <directionalLight
            position={[5, 8, 5]}
            intensity={0.6}
            color="#F1F5F9"
            castShadow={false}
          />
          <directionalLight
            position={[-3, 4, -2]}
            intensity={0.15}
            color="#F59E0B"
          />

          {/* Scene content */}
          <group>
            <BinGrid />
            <Robot pathPoints={robotPath1} speed={0.12} color="#F59E0B" />
            <Robot pathPoints={robotPath2} speed={0.09} color="#10B981" />
            <SensorBeam position={[1.65, 0, -1.65]} />
            <FloatingParticles count={35} />
          </group>

          {/* Camera rig for mouse parallax */}
          <CameraRig />

          {/* Controls */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.4}
            maxPolarAngle={Math.PI / 2.2}
            minPolarAngle={Math.PI / 4}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
