"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { bins, CYCLE } from "./binData";
import WorkspaceSurface from "./WorkspaceSurface";
import Bin from "./Bin";

interface SceneProps {
  onLabelUpdate: (fill: number, color: string, opacity: number) => void;
}

export default function Scene({ onLabelUpdate }: SceneProps) {
  const startRef = useRef(performance.now());
  const binOffX = useRef(0);
  const scanProgress = useRef(0);
  const [currentBinIdx, setCurrentBinIdx] = useState(0);
  const lastBinIdx = useRef(0);

  const onLabelUpdateRef = useRef(onLabelUpdate);
  onLabelUpdateRef.current = onLabelUpdate;

  useFrame(() => {
    const elapsed = performance.now() - startRef.current;
    const binIdx = Math.floor(elapsed / CYCLE) % bins.length;
    const t = (elapsed % CYCLE) / CYCLE;
    const bin = bins[binIdx];

    // Timing — same as 2D version
    const slideIn = Math.min(t / 0.10, 1);
    const easeIn = 1 - Math.pow(1 - slideIn, 3);
    const scanP = t < 0.14 ? 0 : t > 0.50 ? 1 : (t - 0.14) / 0.36;
    const labelP = t < 0.54 ? 0 : Math.min((t - 0.54) / 0.06, 1);
    const slideOut = t > 0.85 ? Math.min((t - 0.85) / 0.15, 1) : 0;
    const easeOut = slideOut * slideOut;

    // Bin offset (slides in from right, out to left)
    binOffX.current = (1 - easeIn) * 6 - easeOut * 6;
    scanProgress.current = scanP;

    // Update React state only when bin changes
    if (binIdx !== lastBinIdx.current) {
      lastBinIdx.current = binIdx;
      setCurrentBinIdx(binIdx);
    }

    // Label update (called every frame for smooth opacity transitions)
    onLabelUpdateRef.current(bin.fill, bin.color, labelP);
  });

  const bin = bins[currentBinIdx];

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 8, 4]} intensity={0.85} />
      <directionalLight position={[-2, 4, -2]} intensity={0.2} />

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
