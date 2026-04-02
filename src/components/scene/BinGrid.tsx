"use client";

import { useMemo } from "react";
import * as THREE from "three";
import Bin from "./Bin";

// 4x4 grid of bins with realistic fill levels (inspired by the real app data)
const binData = [
  [0.76, 0.68, 0.92, 0.16],
  [0.14, 0.79, 0.85, 0.42],
  [0.65, 0.22, 0.88, 0.71],
  [0.91, 0.33, 0.57, 0.12],
];

const GRID_SIZE = 4;
const BIN_SPACING = 1.1;
const GRID_OFFSET = ((GRID_SIZE - 1) * BIN_SPACING) / 2;

export default function BinGrid() {
  // Grid rail lines on top
  const railMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "#334155",
        transparent: true,
        opacity: 0.4,
      }),
    []
  );

  const railLines = useMemo(() => {
    const points: THREE.Vector3[][] = [];
    const y = 0.55;
    // Horizontal rails
    for (let i = 0; i <= GRID_SIZE; i++) {
      const z = i * BIN_SPACING - GRID_OFFSET - BIN_SPACING / 2;
      points.push([
        new THREE.Vector3(-GRID_OFFSET - BIN_SPACING / 2, y, z),
        new THREE.Vector3(GRID_OFFSET + BIN_SPACING / 2, y, z),
      ]);
    }
    // Vertical rails
    for (let i = 0; i <= GRID_SIZE; i++) {
      const x = i * BIN_SPACING - GRID_OFFSET - BIN_SPACING / 2;
      points.push([
        new THREE.Vector3(x, y, -GRID_OFFSET - BIN_SPACING / 2),
        new THREE.Vector3(x, y, GRID_OFFSET + BIN_SPACING / 2),
      ]);
    }
    return points;
  }, []);

  return (
    <group>
      {/* Bins */}
      {binData.map((row, rowIdx) =>
        row.map((fill, colIdx) => (
          <Bin
            key={`${rowIdx}-${colIdx}`}
            position={[
              colIdx * BIN_SPACING - GRID_OFFSET,
              0,
              rowIdx * BIN_SPACING - GRID_OFFSET,
            ]}
            fillLevel={fill}
            isScanning={rowIdx === 0 && colIdx === 3} // The 16% bin is being scanned
          />
        ))
      )}

      {/* Grid rails on top */}
      {railLines.map((pair, i) => (
        <line key={`rail-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([...pair[0].toArray(), ...pair[1].toArray()])}
              itemSize={3}
            />
          </bufferGeometry>
          <primitive object={railMaterial} />
        </line>
      ))}

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.52, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial
          color="#0B1221"
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}
