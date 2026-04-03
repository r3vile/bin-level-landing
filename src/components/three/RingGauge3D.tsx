"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface RingProps {
  progress: number; // 0-1, how full the ring should be
  color?: string;
  active: boolean;
}

function Ring({ progress, color = "#F59E0B", active }: RingProps) {
  const ringRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(0);

  // Animated ring geometry - we'll update via morph
  const { bgGeo, fgGeo, glowGeo } = useMemo(() => {
    const bg = new THREE.RingGeometry(1.1, 1.35, 64, 1, 0, Math.PI * 2);
    const fg = new THREE.RingGeometry(1.1, 1.35, 64, 1, -Math.PI / 2, 0.001);
    const glow = new THREE.RingGeometry(1.0, 1.45, 64, 1, -Math.PI / 2, 0.001);
    return { bgGeo: bg, fgGeo: fg, glowGeo: glow };
  }, []);

  useFrame(({ clock }) => {
    if (!ringRef.current || !glowRef.current) return;
    const t = clock.getElapsedTime();

    // Ease toward target progress
    const target = active ? progress : 0;
    progressRef.current += (target - progressRef.current) * 0.03;
    const p = progressRef.current;

    // Update ring arc
    const angle = p * Math.PI * 2;
    ringRef.current.geometry.dispose();
    ringRef.current.geometry = new THREE.RingGeometry(1.1, 1.35, 64, 1, -Math.PI / 2, angle);

    glowRef.current.geometry.dispose();
    glowRef.current.geometry = new THREE.RingGeometry(1.0, 1.45, 64, 1, -Math.PI / 2, angle);

    // Subtle rotation
    const group = ringRef.current.parent;
    if (group) {
      group.rotation.z = Math.sin(t * 0.5) * 0.03;
    }
  });

  const threeColor = useMemo(() => new THREE.Color(color), [color]);

  return (
    <group>
      {/* Background ring (dim track) */}
      <mesh geometry={bgGeo}>
        <meshBasicMaterial
          color="#334155"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Glow ring (behind foreground) */}
      <mesh ref={glowRef} geometry={glowGeo} position={[0, 0, -0.01]}>
        <meshBasicMaterial
          color={threeColor}
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Foreground ring (progress) */}
      <mesh ref={ringRef} geometry={fgGeo} position={[0, 0, 0.01]}>
        <meshBasicMaterial
          color={threeColor}
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Center glow dot */}
      <mesh position={[0, 0, -0.02]}>
        <circleGeometry args={[0.85, 32]} />
        <meshBasicMaterial
          color={threeColor}
          transparent
          opacity={0.03}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// Orbiting particles around the ring
function OrbitParticles({ active, color = "#F59E0B" }: { active: boolean; color?: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const count = 6;

  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2,
      radius: 1.22,
      speed: 0.15 + Math.random() * 0.1,
      size: 0.025 + Math.random() * 0.02,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      const p = particles[i];
      const angle = p.angle + t * p.speed;
      const radiusPulse = p.radius + Math.sin(t * 2 + p.phase) * 0.05;
      child.position.set(
        Math.cos(angle) * radiusPulse,
        Math.sin(angle) * radiusPulse,
        0.02
      );
      const opacity = active ? 0.6 : 0.1;
      ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = opacity;
    });
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i}>
          <circleGeometry args={[p.size, 8]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.1}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

interface RingGauge3DProps {
  progress: number;
  color?: string;
  active: boolean;
  className?: string;
}

export default function RingGauge3D({ progress, color = "#F59E0B", active, className = "" }: RingGauge3DProps) {
  return (
    <div className={`${className}`}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0, 4], fov: 35 }}
        style={{ background: "transparent" }}
      >
        <Ring progress={progress} color={color} active={active} />
        <OrbitParticles active={active} color={color} />
      </Canvas>
    </div>
  );
}
