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

function Ground() {
  return (
    <mesh position={[0, -1.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
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
  const fadeOpacity = useRef(1);
  const [currentBinIdx, setCurrentBinIdx] = useState(0);
  const lastBinIdx = useRef(0);
  const { camera } = useThree();

  const onLabelUpdateRef = useRef(onLabelUpdate);
  onLabelUpdateRef.current = onLabelUpdate;

  const basePos = useRef(new THREE.Vector3(0, 6.5, 6));

  useFrame(() => {
    const now = performance.now();
    const elapsed = now - startRef.current;
    const binIdx = Math.floor(elapsed / CYCLE) % bins.length;
    const t = (elapsed % CYCLE) / CYCLE;
    const bin = bins[binIdx];

    // ── New timing with fade-out instead of hard slide ──
    // Slide in:  t = 0.00 → 0.10  (gentle entry from right)
    // Scan:      t = 0.14 → 0.50  (laser sweep)
    // Label:     t = 0.54 → 0.60  (percentage fades in)
    // Hold:      t = 0.60 → 0.78  (scanned result lingers)
    // Fade out:  t = 0.78 → 0.96  (gentle opacity fade to 0)
    // Gap:       t = 0.96 → 1.00  (brief empty pause)

    const slideIn = Math.min(t / 0.10, 1);
    const easeIn = 1 - Math.pow(1 - slideIn, 3);
    const scanP = t < 0.14 ? 0 : t > 0.50 ? 1 : (t - 0.14) / 0.36;

    // Label fades in, then fades out with the bin
    const labelFadeIn = t < 0.54 ? 0 : t < 0.60 ? (t - 0.54) / 0.06 : 1;
    const labelFadeOut = t > 0.78 ? 1 - Math.min((t - 0.78) / 0.14, 1) : 1;
    const labelP = labelFadeIn * labelFadeOut;

    // Bin opacity: full during scan/hold, fades out gently
    let opacity = 1;
    if (t > 0.78) {
      const fadeT = (t - 0.78) / 0.18; // 0 → 1 over fade period
      opacity = 1 - fadeT * fadeT; // Quadratic ease-in fade (slow start, fast end)
      opacity = Math.max(0, opacity);
    }
    // Fade in at the start too (subtle)
    if (t < 0.06) {
      opacity = Math.min(opacity, t / 0.06);
    }

    // Gentle slide-in only, no slide-out — just fade
    binOffX.current = (1 - easeIn) * 5;
    // Tiny drift downward during fade for a "sinking away" feel
    scanProgress.current = scanP;
    fadeOpacity.current = opacity;

    if (binIdx !== lastBinIdx.current) {
      lastBinIdx.current = binIdx;
      setCurrentBinIdx(binIdx);
    }

    onLabelUpdateRef.current(bin.fill, bin.color, labelP);

    // Camera drift
    const driftT = elapsed * 0.0001;
    camera.position.set(
      basePos.current.x + Math.sin(driftT) * 0.25,
      basePos.current.y + Math.sin(driftT * 0.5) * 0.08,
      basePos.current.z + Math.sin(driftT * 0.7) * 0.15,
    );
    camera.lookAt(0, -0.3, 0);
  });

  const bin = bins[currentBinIdx];

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.25} />
      <hemisphereLight args={["#b0c4de", "#1a1a2e", 0.4]} />
      <directionalLight position={[4, 10, 5]} intensity={0.9} color="#fff5e6" />
      <directionalLight position={[-3, 5, -3]} intensity={0.15} color="#c4d4f0" />
      <pointLight position={[0, 3, -4]} intensity={0.3} color="#8090b0" distance={10} decay={2} />

      <Ground />
      <WorkspaceSurface />

      <Bin
        key={currentBinIdx}
        products={bin.products}
        binOffX={binOffX}
        scanProgress={scanProgress}
        fadeOpacity={fadeOpacity}
      />
    </>
  );
}
