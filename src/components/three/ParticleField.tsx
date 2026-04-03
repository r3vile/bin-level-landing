"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 120;

function Particles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate random initial positions and velocities
  const particles = useMemo(() => {
    const data = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      data.push({
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 12,
        z: (Math.random() - 0.5) * 6 - 2,
        vx: (Math.random() - 0.5) * 0.003,
        vy: (Math.random() - 0.5) * 0.003,
        scale: Math.random() * 0.6 + 0.2,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.3 + 0.15,
      });
    }
    return data;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i];
      // Gentle floating motion
      const floatX = Math.sin(t * p.speed + p.phase) * 0.3;
      const floatY = Math.cos(t * p.speed * 0.7 + p.phase) * 0.2;

      dummy.position.set(
        p.x + floatX + p.vx * t * 60,
        p.y + floatY + p.vy * t * 60,
        p.z
      );

      // Wrap around when going out of bounds
      if (dummy.position.x > 12) dummy.position.x -= 24;
      if (dummy.position.x < -12) dummy.position.x += 24;
      if (dummy.position.y > 8) dummy.position.y -= 16;
      if (dummy.position.y < -8) dummy.position.y += 16;

      // Subtle pulsing scale
      const pulse = 1 + Math.sin(t * 1.5 + p.phase) * 0.15;
      const s = p.scale * pulse;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <circleGeometry args={[0.04, 8]} />
      <meshBasicMaterial
        color="#F59E0B"
        transparent
        opacity={0.25}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}

function Lines() {
  const lineRef = useRef<THREE.LineSegments>(null);

  // Static network lines between some "node" positions
  const geometry = useMemo(() => {
    const positions: number[] = [];
    const nodes: [number, number, number][] = [];

    // Create a set of nodes
    for (let i = 0; i < 30; i++) {
      nodes.push([
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 4 - 3,
      ]);
    }

    // Connect nearby nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i][0] - nodes[j][0];
        const dy = nodes[i][1] - nodes[j][1];
        const dz = nodes[i][2] - nodes[j][2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 4.5) {
          positions.push(...nodes[i], ...nodes[j]);
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!lineRef.current) return;
    const t = clock.getElapsedTime();
    // Slow subtle rotation
    lineRef.current.rotation.z = Math.sin(t * 0.05) * 0.02;
    lineRef.current.rotation.y = Math.cos(t * 0.03) * 0.01;
  });

  return (
    <lineSegments ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        color="#F59E0B"
        transparent
        opacity={0.04}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

export default function ParticleField({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: "transparent" }}
      >
        <Particles />
        <Lines />
      </Canvas>
    </div>
  );
}
