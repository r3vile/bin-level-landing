"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const STREAM_COUNT = 40;

function DataStream({ active }: { active: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: STREAM_COUNT }, () => ({
      t: Math.random(), // position along path (0-1)
      speed: 0.08 + Math.random() * 0.12,
      offset: (Math.random() - 0.5) * 0.3,
      yOffset: (Math.random() - 0.5) * 0.15,
      size: 0.02 + Math.random() * 0.03,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime();

    for (let i = 0; i < STREAM_COUNT; i++) {
      const p = particles[i];

      // Advance position along the path
      if (active) {
        p.t = (p.t + p.speed * 0.016) % 1;
      }

      // Map t to x position (-5 to 5)
      const x = (p.t - 0.5) * 10;

      // Wave motion
      const wave = Math.sin(x * 0.8 + time * 2 + p.phase) * 0.15;

      dummy.position.set(
        x,
        p.yOffset + wave,
        p.offset
      );

      // Fade at edges
      const edgeFade = 1 - Math.pow(Math.abs(p.t - 0.5) * 2, 3);
      const s = p.size * (active ? edgeFade * 1.5 + 0.5 : 0.3);
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, STREAM_COUNT]}>
      <circleGeometry args={[1, 8]} />
      <meshBasicMaterial
        color="#F59E0B"
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}

// Pulsing nodes at the 3 step positions
function StepNodes({ active }: { active: boolean }) {
  const nodesRef = useRef<THREE.Group>(null);

  const positions: [number, number, number][] = [
    [-3.33, 0, 0],
    [0, 0, 0],
    [3.33, 0, 0],
  ];

  useFrame(({ clock }) => {
    if (!nodesRef.current) return;
    const t = clock.getElapsedTime();

    nodesRef.current.children.forEach((node, i) => {
      const pulse = active ? 1 + Math.sin(t * 2 + i * 1.2) * 0.2 : 0.5;
      node.scale.set(pulse, pulse, pulse);
      ((node as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = active ? 0.7 : 0.2;
    });
  });

  return (
    <group ref={nodesRef}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <circleGeometry args={[0.12, 16]} />
          <meshBasicMaterial
            color="#F59E0B"
            transparent
            opacity={0.2}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// Connecting beam line
function BeamLine({ active }: { active: boolean }) {
  const lineRef = useRef<THREE.Mesh>(null);
  const opacityRef = useRef(0);

  useFrame(() => {
    if (!lineRef.current) return;
    const target = active ? 0.08 : 0.02;
    opacityRef.current += (target - opacityRef.current) * 0.05;
    ((lineRef.current as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = opacityRef.current;
  });

  return (
    <mesh ref={lineRef} position={[0, 0, -0.01]}>
      <planeGeometry args={[8, 0.02]} />
      <meshBasicMaterial
        color="#F59E0B"
        transparent
        opacity={0.02}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function DataFlow({ active, className = "" }: { active: boolean; className?: string }) {
  return (
    <div className={`${className}`}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ background: "transparent" }}
      >
        <BeamLine active={active} />
        <DataStream active={active} />
        <StepNodes active={active} />
      </Canvas>
    </div>
  );
}
