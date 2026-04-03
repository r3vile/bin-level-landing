"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Classic Perlin 3D noise GLSL — included inline to avoid extra deps
const noiseGLSL = /* glsl */ `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }
`;

const vertexShader = /* glsl */ `
  ${noiseGLSL}

  uniform float u_time;
  uniform float u_intensity;
  uniform vec2 u_mouse;

  varying float v_displacement;
  varying vec3 v_normal;
  varying vec3 v_position;

  void main() {
    // Multi-octave noise for organic feel
    float noise1 = snoise(position * 1.2 + u_time * 0.15) * 0.5;
    float noise2 = snoise(position * 2.4 + u_time * 0.25) * 0.25;
    float noise3 = snoise(position * 4.8 + u_time * 0.1) * 0.125;

    float displacement = (noise1 + noise2 + noise3) * u_intensity;

    // Mouse influence — subtle attraction
    vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    float mouseDist = length(worldPos.xy - u_mouse);
    float mouseInfluence = smoothstep(3.0, 0.0, mouseDist) * 0.15;
    displacement += mouseInfluence;

    v_displacement = displacement;
    v_normal = normalize(normalMatrix * normal);
    v_position = position;

    vec3 newPosition = position + normal * displacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float u_time;
  uniform vec3 u_colorA;
  uniform vec3 u_colorB;
  uniform vec3 u_colorC;

  varying float v_displacement;
  varying vec3 v_normal;
  varying vec3 v_position;

  void main() {
    // Map displacement to color
    float t = v_displacement * 1.8 + 0.5;

    // Three-way gradient: dark amber → bright amber → warm white
    vec3 color = mix(u_colorA, u_colorB, smoothstep(0.0, 0.5, t));
    color = mix(color, u_colorC, smoothstep(0.5, 1.0, t));

    // Fresnel rim glow
    vec3 viewDir = normalize(cameraPosition - v_position);
    float fresnel = pow(1.0 - max(dot(v_normal, viewDir), 0.0), 3.0);
    color += u_colorB * fresnel * 0.6;

    // Subtle inner glow pulsing
    float pulse = sin(u_time * 0.8) * 0.05 + 0.95;
    float alpha = (0.35 + fresnel * 0.45) * pulse;

    gl_FragColor = vec4(color, alpha);
  }
`;

function Blob() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_intensity: { value: 0.4 },
      u_mouse: { value: new THREE.Vector2(0, 0) },
      u_colorA: { value: new THREE.Color("#7C2D12") },   // deep amber/brown
      u_colorB: { value: new THREE.Color("#F59E0B") },   // bright amber
      u_colorC: { value: new THREE.Color("#FDE68A") },   // warm light
    }),
    []
  );

  useFrame(({ clock, pointer }) => {
    if (!meshRef.current) return;

    uniforms.u_time.value = clock.getElapsedTime();

    // Smooth mouse tracking
    const targetX = (pointer.x * viewport.width) / 2;
    const targetY = (pointer.y * viewport.height) / 2;
    mouseRef.current.x += (targetX - mouseRef.current.x) * 0.05;
    mouseRef.current.y += (targetY - mouseRef.current.y) * 0.05;
    uniforms.u_mouse.value.set(mouseRef.current.x, mouseRef.current.y);

    // Gentle floating rotation
    meshRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.15) * 0.3;
    meshRef.current.rotation.x = Math.cos(clock.getElapsedTime() * 0.1) * 0.15;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <icosahedronGeometry args={[1.8, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.FrontSide}
      />
    </mesh>
  );
}

// Orbiting glow rings
function GlowRings() {
  const ringRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    const t = clock.getElapsedTime();
    ringRef.current.rotation.x = t * 0.08;
    ringRef.current.rotation.z = t * 0.05;
  });

  return (
    <group ref={ringRef}>
      {[1.0, 1.3, 1.6].map((scale, i) => (
        <mesh key={i} rotation={[Math.PI * 0.3 * i, Math.PI * 0.2 * i, 0]}>
          <torusGeometry args={[2.2 * scale, 0.005, 8, 128]} />
          <meshBasicMaterial
            color="#F59E0B"
            transparent
            opacity={0.08 - i * 0.02}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function NoiseBlob({ className = "" }: { className?: string }) {
  return (
    <div className={`${className}`}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: "transparent" }}
      >
        <Blob />
        <GlowRings />
      </Canvas>
    </div>
  );
}
