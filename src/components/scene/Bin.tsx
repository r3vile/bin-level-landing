"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface BinProps {
  fillLevel: number;
  scanProgress: number; // 0 = no scan, 1 = fully scanned
}

export default function Bin({ fillLevel, scanProgress }: BinProps) {
  const heatmapRef = useRef<THREE.Mesh>(null);

  // Realistic AutoStore bin: ~600x400x330mm, scaled down
  const binW = 1.8;
  const binD = 1.2;
  const binH = 1.0;
  const wallThick = 0.04;

  // Create heatmap texture procedurally — red = empty (near sensor), blue/green = full (far)
  const heatmapTexture = useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    // Base: warm red/orange (empty space near sensor)
    ctx.fillStyle = "#ff3300";
    ctx.fillRect(0, 0, size, size);

    // Products as cooler blobs (blue/green = far from sensor = items)
    const products = [
      { x: 10, y: 8, w: 22, h: 18, color: "#ff9900" },  // medium item
      { x: 35, y: 5, w: 20, h: 25, color: "#44bb00" },  // tall item (green)
      { x: 8, y: 32, w: 25, h: 28, color: "#00aaff" },   // tallest item (blue)
      { x: 38, y: 35, w: 22, h: 24, color: "#ffcc00" },  // short item
    ];

    // Only draw products proportional to fill level
    const numProducts = Math.ceil(products.length * fillLevel);
    for (let i = 0; i < numProducts; i++) {
      const p = products[i];
      // Gradient blob for each product
      const gradient = ctx.createRadialGradient(
        p.x + p.w / 2, p.y + p.h / 2, 2,
        p.x + p.w / 2, p.y + p.h / 2, Math.max(p.w, p.h) / 2
      );
      gradient.addColorStop(0, p.color);
      gradient.addColorStop(0.6, p.color + "cc");
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(p.x, p.y, p.w, p.h);
    }

    // Add noise/grain for realism
    const imageData = ctx.getImageData(0, 0, size, size);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 30;
      imageData.data[i] = Math.max(0, Math.min(255, imageData.data[i] + noise));
      imageData.data[i + 1] = Math.max(0, Math.min(255, imageData.data[i + 1] + noise));
      imageData.data[i + 2] = Math.max(0, Math.min(255, imageData.data[i + 2] + noise));
    }
    ctx.putImageData(imageData, 0, 0);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [fillLevel]);

  // Animate heatmap opacity based on scan progress
  useFrame(() => {
    if (heatmapRef.current) {
      const mat = heatmapRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = scanProgress * 0.9;
    }
  });

  const wallColor = "#2a3548";

  return (
    <group>
      {/* Bin walls — dark plastic look */}
      {/* Bottom */}
      <mesh position={[0, -binH / 2, 0]}>
        <boxGeometry args={[binW, wallThick, binD]} />
        <meshStandardMaterial color={wallColor} roughness={0.7} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-binW / 2, 0, 0]}>
        <boxGeometry args={[wallThick, binH, binD]} />
        <meshStandardMaterial color={wallColor} roughness={0.7} />
      </mesh>
      {/* Right wall */}
      <mesh position={[binW / 2, 0, 0]}>
        <boxGeometry args={[wallThick, binH, binD]} />
        <meshStandardMaterial color={wallColor} roughness={0.7} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, 0, -binD / 2]}>
        <boxGeometry args={[binW, binH, wallThick]} />
        <meshStandardMaterial color={wallColor} roughness={0.7} />
      </mesh>
      {/* Front wall */}
      <mesh position={[0, 0, binD / 2]}>
        <boxGeometry args={[binW, binH, wallThick]} />
        <meshStandardMaterial color={wallColor} roughness={0.7} />
      </mesh>

      {/* Simple product shapes inside bin */}
      {fillLevel > 0.1 && (
        <group position={[0, -binH / 2 + wallThick, 0]}>
          <mesh position={[-0.4, 0.18, -0.1]}>
            <boxGeometry args={[0.6, 0.35, 0.5]} />
            <meshStandardMaterial color="#64748b" roughness={0.8} />
          </mesh>
          {fillLevel > 0.3 && (
            <mesh position={[0.4, 0.3, 0.1]}>
              <boxGeometry args={[0.55, 0.6, 0.45]} />
              <meshStandardMaterial color="#475569" roughness={0.8} />
            </mesh>
          )}
          {fillLevel > 0.6 && (
            <mesh position={[-0.2, 0.12, 0.3]}>
              <boxGeometry args={[0.7, 0.22, 0.35]} />
              <meshStandardMaterial color="#59657a" roughness={0.8} />
            </mesh>
          )}
        </group>
      )}

      {/* Heatmap overlay — appears on top of bin interior when scanned */}
      <mesh
        ref={heatmapRef}
        position={[0, binH / 2 - 0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[binW - wallThick * 2, binD - wallThick * 2]} />
        <meshBasicMaterial
          map={heatmapTexture}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
