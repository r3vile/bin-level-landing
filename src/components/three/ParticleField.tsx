"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 160;

function Particles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const mouseRef = useRef(new THREE.Vector2(999, 999));
  const { viewport } = useThree();

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
        // For mouse repulsion
        pushX: 0,
        pushY: 0,
      });
    }
    return data;
  }, []);

  useFrame(({ clock, pointer }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    // Smooth mouse tracking in world coords
    const mx = (pointer.x * viewport.width) / 2;
    const my = (pointer.y * viewport.height) / 2;
    mouseRef.current.x += (mx - mouseRef.current.x) * 0.08;
    mouseRef.current.y += (my - mouseRef.current.y) * 0.08;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i];
      // Gentle floating motion
      const floatX = Math.sin(t * p.speed + p.phase) * 0.3;
      const floatY = Math.cos(t * p.speed * 0.7 + p.phase) * 0.2;

      let px = p.x + floatX + p.vx * t * 60;
      let py = p.y + floatY + p.vy * t * 60;

      // Wrap around when going out of bounds
      if (px > 12) px -= 24;
      if (px < -12) px += 24;
      if (py > 8) py -= 16;
      if (py < -8) py += 16;

      // Mouse proximity — attract nearby particles, repel very close ones
      const dx = px - mouseRef.current.x;
      const dy = py - mouseRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 3.5 && dist > 0.01) {
        const force = (1.0 - dist / 3.5);
        // Gentle attraction toward mouse
        const attractX = -dx * force * 0.008;
        const attractY = -dy * force * 0.008;
        p.pushX += (attractX - p.pushX) * 0.1;
        p.pushY += (attractY - p.pushY) * 0.1;
      } else {
        p.pushX *= 0.95;
        p.pushY *= 0.95;
      }

      dummy.position.set(px + p.pushX, py + p.pushY, p.z);

      // Scale: pulse + proximity boost
      const proximityBoost = dist < 3.5 ? 1 + (1 - dist / 3.5) * 1.5 : 1;
      const pulse = 1 + Math.sin(t * 1.5 + p.phase) * 0.15;
      const s = p.scale * pulse * proximityBoost;
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
        opacity={0.3}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}

function DynamicLines() {
  const lineRef = useRef<THREE.LineSegments>(null);
  const mouseRef = useRef(new THREE.Vector2(999, 999));
  const { viewport } = useThree();

  // Node positions
  const nodes = useMemo(() => {
    return Array.from({ length: 40 }, () => ({
      baseX: (Math.random() - 0.5) * 18,
      baseY: (Math.random() - 0.5) * 10,
      baseZ: (Math.random() - 0.5) * 4 - 3,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.2 + 0.1,
    }));
  }, []);

  useFrame(({ clock, pointer }) => {
    if (!lineRef.current) return;
    const t = clock.getElapsedTime();

    const mx = (pointer.x * viewport.width) / 2;
    const my = (pointer.y * viewport.height) / 2;
    mouseRef.current.x += (mx - mouseRef.current.x) * 0.05;
    mouseRef.current.y += (my - mouseRef.current.y) * 0.05;

    // Compute current node positions with drift
    const currentPos = nodes.map((n) => {
      const x = n.baseX + Math.sin(t * n.speed + n.phase) * 0.5;
      const y = n.baseY + Math.cos(t * n.speed * 0.7 + n.phase) * 0.3;
      return [x, y, n.baseZ] as [number, number, number];
    });

    // Build line segments between nearby nodes
    const positions: number[] = [];
    for (let i = 0; i < currentPos.length; i++) {
      for (let j = i + 1; j < currentPos.length; j++) {
        const dx = currentPos[i][0] - currentPos[j][0];
        const dy = currentPos[i][1] - currentPos[j][1];
        const dz = currentPos[i][2] - currentPos[j][2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // Increase connection distance near mouse
        const midX = (currentPos[i][0] + currentPos[j][0]) / 2;
        const midY = (currentPos[i][1] + currentPos[j][1]) / 2;
        const mouseDist = Math.sqrt(
          (midX - mouseRef.current.x) ** 2 + (midY - mouseRef.current.y) ** 2
        );
        const threshold = mouseDist < 4 ? 5.5 : 4.0;

        if (dist < threshold) {
          positions.push(...currentPos[i], ...currentPos[j]);
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    lineRef.current.geometry.dispose();
    lineRef.current.geometry = geo;

    // Slow subtle rotation
    lineRef.current.rotation.z = Math.sin(t * 0.05) * 0.02;
    lineRef.current.rotation.y = Math.cos(t * 0.03) * 0.01;
  });

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry />
      <lineBasicMaterial
        color="#F59E0B"
        transparent
        opacity={0.05}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

export default function ParticleField({ className = "" }: { className?: string }) {
  // We need pointer events for mouse tracking
  return (
    <div className={`absolute inset-0 ${className}`} style={{ pointerEvents: "none" }}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: "transparent", pointerEvents: "auto" }}
        eventPrefix="client"
      >
        <Particles />
        <DynamicLines />
      </Canvas>
    </div>
  );
}
