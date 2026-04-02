"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import Bin from "./scene/Bin";
import CarouselPort from "./scene/CarouselPort";
import SensorBeam from "./scene/SensorBeam";

// Bin data: fill levels + percentages shown after scan
const binSequence = [
  { fillLevel: 0.16, label: "16%" },
  { fillLevel: 0.76, label: "76%" },
  { fillLevel: 0.42, label: "42%" },
  { fillLevel: 0.92, label: "92%" },
  { fillLevel: 0.14, label: "14%" },
];

// The animation cycle for one bin:
// 0.0 - 0.15: bin slides in from side
// 0.15 - 0.25: bin settles into position
// 0.25 - 0.65: scanning (beam active, heatmap appears)
// 0.65 - 0.75: percentage label fades in
// 0.75 - 0.90: pause with result shown
// 0.90 - 1.0: bin slides out
const CYCLE_DURATION = 5; // seconds per bin

function ScanAnimation() {
  const binGroupRef = useRef<THREE.Group>(null);
  const labelRef = useRef<THREE.Group>(null);
  const [currentBin, setCurrentBin] = useState(0);
  const cycleRef = useRef(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [labelOpacity, setLabelOpacity] = useState(0);

  useFrame((_, delta) => {
    cycleRef.current += delta;
    const t = (cycleRef.current % CYCLE_DURATION) / CYCLE_DURATION;

    // Advance to next bin
    const binIndex = Math.floor(cycleRef.current / CYCLE_DURATION) % binSequence.length;
    if (binIndex !== currentBin) {
      setCurrentBin(binIndex);
    }

    // Bin position animation (slides in from right, out to left)
    if (binGroupRef.current) {
      let x = 0;
      let y = 0;
      if (t < 0.15) {
        // Slide in from right
        const slideT = t / 0.15;
        const eased = 1 - Math.pow(1 - slideT, 3); // ease out cubic
        x = 3.5 * (1 - eased);
        y = -0.1 * (1 - eased);
      } else if (t > 0.90) {
        // Slide out to left
        const slideT = (t - 0.90) / 0.10;
        const eased = slideT * slideT * slideT; // ease in cubic
        x = -3.5 * eased;
        y = -0.1 * eased;
      }
      binGroupRef.current.position.x = x;
      binGroupRef.current.position.y = y;
    }

    // Scan progress
    if (t >= 0.25 && t <= 0.65) {
      setScanning(true);
      setScanProgress((t - 0.25) / 0.4);
    } else {
      if (t > 0.65) {
        setScanProgress(1);
      } else {
        setScanProgress(0);
      }
      setScanning(false);
    }

    // Label opacity
    if (t >= 0.65 && t < 0.90) {
      const fadeT = Math.min((t - 0.65) / 0.08, 1);
      setLabelOpacity(fadeT);
    } else {
      setLabelOpacity(0);
    }
  });

  const bin = binSequence[currentBin];
  const isLow = bin.fillLevel < 0.35;

  return (
    <group>
      <CarouselPort />

      {/* Bin on carousel arm */}
      <group ref={binGroupRef}>
        <Bin fillLevel={bin.fillLevel} scanProgress={scanProgress} />
      </group>

      <SensorBeam active={scanning} />

      {/* Fill level label floating above */}
      <group ref={labelRef} position={[0, 2.1, 0]}>
        {labelOpacity > 0.01 && (
          <>
            {/* Background pill */}
            <mesh position={[0, 0, 0]}>
              <planeGeometry args={[0.9, 0.4]} />
              <meshBasicMaterial
                color={isLow ? "#F59E0B" : "#10B981"}
                transparent
                opacity={labelOpacity * 0.15}
                side={THREE.DoubleSide}
              />
            </mesh>
            <Text
              position={[0, 0, 0.01]}
              fontSize={0.28}
              color={isLow ? "#F59E0B" : "#10B981"}
              anchorX="center"
              anchorY="middle"
              font="/fonts/JetBrainsMono-Bold.woff"
              fillOpacity={labelOpacity}
            >
              {bin.label}
            </Text>
            <Text
              position={[0, -0.22, 0.01]}
              fontSize={0.08}
              color="#94A3B8"
              anchorX="center"
              anchorY="middle"
              fillOpacity={labelOpacity * 0.7}
            >
              Füllstand
            </Text>
          </>
        )}
      </group>
    </group>
  );
}

// Subtle mouse parallax
function CameraRig() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      state.pointer.x * 0.08,
      0.03
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      state.pointer.y * 0.04,
      0.03
    );
  });

  return <group ref={groupRef} />;
}

export default function AutoStoreScene({ className = "" }: { className?: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [3.5, 2.5, 3.5], fov: 38 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.35} color="#e2e8f0" />
          <directionalLight position={[4, 6, 3]} intensity={0.7} color="#f8fafc" />
          <directionalLight position={[-2, 3, -1]} intensity={0.15} color="#F59E0B" />

          {/* Main scene */}
          <group position={[0, 0.2, 0]}>
            <ScanAnimation />
          </group>

          <CameraRig />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.3}
            maxPolarAngle={Math.PI / 2.3}
            minPolarAngle={Math.PI / 5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
