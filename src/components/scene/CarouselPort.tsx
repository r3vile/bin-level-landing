"use client";

import { useMemo } from "react";
import * as THREE from "three";

// The port housing — a frame with an opening where bins are presented
export default function CarouselPort() {
  const metalColor = "#3a4557";
  const frameColor = "#2d3748";
  const accentColor = "#475569";

  // The port is a rectangular frame with an opening on top
  const portW = 2.6;
  const portD = 1.8;
  const portH = 0.6;
  const frameThick = 0.12;

  const edgeMaterial = useMemo(
    () => new THREE.LineBasicMaterial({ color: "#64748B", transparent: true, opacity: 0.3 }),
    []
  );

  return (
    <group position={[0, -0.7, 0]}>
      {/* Main port body — dark housing below the opening */}
      <mesh position={[0, -portH / 2, 0]}>
        <boxGeometry args={[portW + 0.3, portH, portD + 0.3]} />
        <meshStandardMaterial color={frameColor} roughness={0.6} metalness={0.3} />
      </mesh>

      {/* Frame around the bin opening */}
      {/* Front rail */}
      <mesh position={[0, 0, portD / 2 + frameThick / 2]}>
        <boxGeometry args={[portW + frameThick * 2, frameThick * 2, frameThick]} />
        <meshStandardMaterial color={metalColor} metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Back rail */}
      <mesh position={[0, 0, -portD / 2 - frameThick / 2]}>
        <boxGeometry args={[portW + frameThick * 2, frameThick * 2, frameThick]} />
        <meshStandardMaterial color={metalColor} metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Left rail */}
      <mesh position={[-portW / 2 - frameThick / 2, 0, 0]}>
        <boxGeometry args={[frameThick, frameThick * 2, portD + frameThick * 2]} />
        <meshStandardMaterial color={metalColor} metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Right rail */}
      <mesh position={[portW / 2 + frameThick / 2, 0, 0]}>
        <boxGeometry args={[frameThick, frameThick * 2, portD + frameThick * 2]} />
        <meshStandardMaterial color={metalColor} metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Corner accents */}
      {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([sx, sz], i) => (
        <mesh
          key={i}
          position={[
            sx * (portW / 2 + frameThick / 2),
            frameThick,
            sz * (portD / 2 + frameThick / 2),
          ]}
        >
          <cylinderGeometry args={[0.04, 0.04, frameThick * 3, 8]} />
          <meshStandardMaterial color={accentColor} metalness={0.6} roughness={0.2} />
        </mesh>
      ))}

      {/* Sensor mount bar across the top */}
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[portW + 0.4, 0.06, 0.08]} />
        <meshStandardMaterial color={metalColor} metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Vertical support posts for sensor bar */}
      <mesh position={[-portW / 2 - 0.15, 0.7, 0]}>
        <boxGeometry args={[0.06, 1.45, 0.06]} />
        <meshStandardMaterial color={metalColor} metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[portW / 2 + 0.15, 0.7, 0]}>
        <boxGeometry args={[0.06, 1.45, 0.06]} />
        <meshStandardMaterial color={metalColor} metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Edge wireframe for visual clarity */}
      <lineSegments position={[0, -portH / 2, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(portW + 0.3, portH, portD + 0.3)]} />
        <primitive object={edgeMaterial} />
      </lineSegments>
    </group>
  );
}
