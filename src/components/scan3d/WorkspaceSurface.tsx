"use client";

import * as THREE from "three";
import { APT_W, APT_D } from "./binData";

const PLATE_W = 5.6;
const PLATE_D = 3.8;
const PLATE_H = 0.15;
const GASKET = 0.08;

const plateMat = new THREE.MeshStandardMaterial({ color: "#b8bcc2", roughness: 0.75, metalness: 0.05 });
const gasketMat = new THREE.MeshStandardMaterial({ color: "#1a1f2e", roughness: 0.9 });
const screwMat = new THREE.MeshStandardMaterial({ color: "#6b7280", roughness: 0.6, metalness: 0.3 });

export default function WorkspaceSurface() {

  // Frame strips around the aperture
  const halfAptW = APT_W / 2;
  const halfAptD = APT_D / 2;
  const halfPlateW = PLATE_W / 2;
  const halfPlateD = PLATE_D / 2;

  // Top strip (positive Z side)
  const topH = halfPlateD - halfAptD;
  // Bottom strip (negative Z side)
  const botH = halfPlateD - halfAptD;
  // Left strip
  const leftW = halfPlateW - halfAptW;
  // Right strip
  const rightW = halfPlateW - halfAptW;

  return (
    <group>
      {/* Top strip */}
      <mesh position={[0, 0, halfAptD + topH / 2]} material={plateMat}>
        <boxGeometry args={[PLATE_W, PLATE_H, topH]} />
      </mesh>
      {/* Bottom strip */}
      <mesh position={[0, 0, -halfAptD - botH / 2]} material={plateMat}>
        <boxGeometry args={[PLATE_W, PLATE_H, botH]} />
      </mesh>
      {/* Left strip */}
      <mesh position={[-halfAptW - leftW / 2, 0, 0]} material={plateMat}>
        <boxGeometry args={[leftW, PLATE_H, APT_D]} />
      </mesh>
      {/* Right strip */}
      <mesh position={[halfAptW + rightW / 2, 0, 0]} material={plateMat}>
        <boxGeometry args={[rightW, PLATE_H, APT_D]} />
      </mesh>

      {/* Gasket frame (thin dark border around aperture) */}
      {/* Front gasket */}
      <mesh position={[0, PLATE_H / 2 + 0.005, halfAptD - GASKET / 2]} material={gasketMat}>
        <boxGeometry args={[APT_W, 0.03, GASKET]} />
      </mesh>
      {/* Back gasket */}
      <mesh position={[0, PLATE_H / 2 + 0.005, -halfAptD + GASKET / 2]} material={gasketMat}>
        <boxGeometry args={[APT_W, 0.03, GASKET]} />
      </mesh>
      {/* Left gasket */}
      <mesh position={[-halfAptW + GASKET / 2, PLATE_H / 2 + 0.005, 0]} material={gasketMat}>
        <boxGeometry args={[GASKET, 0.03, APT_D - GASKET * 2]} />
      </mesh>
      {/* Right gasket */}
      <mesh position={[halfAptW - GASKET / 2, PLATE_H / 2 + 0.005, 0]} material={gasketMat}>
        <boxGeometry args={[GASKET, 0.03, APT_D - GASKET * 2]} />
      </mesh>

      {/* Corner screws */}
      {[
        [halfPlateW - 0.3, halfPlateD - 0.25],
        [-halfPlateW + 0.3, halfPlateD - 0.25],
        [halfPlateW - 0.3, -halfPlateD + 0.25],
        [-halfPlateW + 0.3, -halfPlateD + 0.25],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, PLATE_H / 2 + 0.01, z]} rotation={[-Math.PI / 2, 0, 0]} material={screwMat}>
          <cylinderGeometry args={[0.06, 0.06, 0.02, 12]} />
        </mesh>
      ))}

    </group>
  );
}
