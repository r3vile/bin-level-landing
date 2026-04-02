"use client";

import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { bins, CYCLE } from "./binData";
import WorkspaceSurface from "./WorkspaceSurface";
import Bin from "./Bin";

interface SceneProps {
  onLabelUpdate: (fill: number, color: string, opacity: number) => void;
}

// Subtle dark ground plane for depth grounding
function Ground() {
  return (
    <mesh position={[0, -1.6, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow={false}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial
        color="#0a0e17"
        roughness={0.95}
        metalness={0}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

export default function Scene({ onLabelUpdate }: SceneProps) {
  const startRef = useRef(performance.now());
  const binOffX = useRef(0);
  const scanProgress = useRef(0);
  const [currentBinIdx, setCurrentBinIdx] = useState(0);
  const lastBinIdx = useRef(0);
  const { camera } = useThree();

  const onLabelUpdateRef = useRef(onLabelUpdate);
  onLabelUpdateRef.current = onLabelUpdate;

  // Base camera position for drift
  const basePos = useRef(new THREE.Vector3(0, 5.5, 5));

  useFrame(() => {
    const now = performance.now();
    const elapsed = now - startRef.current;
    const binIdx = Math.floor(elapsed / CYCLE) % bins.length;
    const t = (elapsed % CYCLE) / CYCLE;
    const bin = bins[binIdx];

    // Timing
    const slideIn = Math.min(t / 0.10, 1);
    const easeIn = 1 - Math.pow(1 - slideIn, 3);
    const scanP = t < 0.14 ? 0 : t > 0.50 ? 1 : (t - 0.14) / 0.36;
    const labelP = t < 0.54 ? 0 : Math.min((t - 0.54) / 0.06, 1);
    const slideOut = t > 0.85 ? Math.min((t - 0.85) / 0.15, 1) : 0;
    const easeOut = slideOut * slideOut;

    binOffX.current = (1 - easeIn) * 6 - easeOut * 6;
    scanProgress.current = scanP;

    if (binIdx !== lastBinIdx.current) {
      lastBinIdx.current = binIdx;
      setCurrentBinIdx(binIdx);
    }

    onLabelUpdateRef.current(bin.fill, bin.color, labelP);

    // Subtle camera drift — gentle figure-8 orbit
    const driftT = elapsed * 0.0001;
    const driftX = Math.sin(driftT) * 0.25;
    const driftZ = Math.sin(driftT * 0.7) * 0.15;
    const driftY = Math.sin(driftT * 0.5) * 0.08;
    camera.position.set(
      basePos.current.x + driftX,
      basePos.current.y + driftY,
      basePos.current.z + driftZ,
    );
    camera.lookAt(0, -0.3, 0);
  });

  const bin = bins[currentBinIdx];

  return (
    <>
      {/* Lighting — richer setup */}
      <ambientLight intensity={0.25} />
      <hemisphereLight args={["#b0c4de", "#1a1a2e", 0.4]} />
      <directionalLight position={[4, 10, 5]} intensity={0.9} color="#fff5e6" />
      <directionalLight position={[-3, 5, -3]} intensity={0.15} color="#c4d4f0" />
      {/* Soft rim light from behind */}
      <pointLight position={[0, 3, -4]} intensity={0.3} color="#8090b0" distance={10} decay={2} />

      {/* Ground */}
      <Ground />

      {/* Workspace */}
      <WorkspaceSurface />

      {/* Bin */}
      <Bin
        key={currentBinIdx}
        products={bin.products}
        binOffX={binOffX}
        scanProgress={scanProgress}
      />
    </>
  );
}
