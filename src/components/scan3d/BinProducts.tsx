"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Product3D, BIN_W, BIN_D, BIN_H } from "./binData";

const neutralColor = new THREE.Color("#4a4035");
const tmpColor = new THREE.Color();

interface Props {
  products: Product3D[];
  scanProgress: React.MutableRefObject<number>;
  binFloorY: number;
}

function ProductMesh({
  product,
  scanProgress,
  binFloorY,
}: {
  product: Product3D;
  scanProgress: React.MutableRefObject<number>;
  binFloorY: number;
}) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null!);
  const targetColor = useMemo(() => new THREE.Color(product.heat), [product.heat]);

  // World position of product in bin
  const posX = -BIN_W / 2 + product.x * BIN_W + (product.w * BIN_W) / 2;
  const posZ = -BIN_D / 2 + product.z * BIN_D + (product.d * BIN_D) / 2;
  const h = product.height * BIN_H;
  const posY = binFloorY + h / 2;

  const sizeW = product.w * BIN_W * 0.95;
  const sizeD = product.d * BIN_D * 0.95;

  // Normalized vertical position (0 = top of bin, 1 = bottom)
  const normZ = product.z + product.d / 2;

  useFrame(() => {
    if (!matRef.current) return;
    const sp = scanProgress.current;
    // Reveal when scan line passes this product's center position
    if (sp > normZ) {
      matRef.current.color.lerp(targetColor, 0.08);
      matRef.current.emissive.lerp(tmpColor.copy(targetColor).multiplyScalar(0.15), 0.08);
    } else {
      matRef.current.color.lerp(neutralColor, 0.12);
      matRef.current.emissive.lerp(tmpColor.set("#000000"), 0.12);
    }
  });

  const geom = useMemo(() => {
    switch (product.shape) {
      case "cylinder":
        return <cylinderGeometry args={[Math.min(sizeW, sizeD) / 2, Math.min(sizeW, sizeD) / 2, h, 12]} />;
      case "tallBox":
        return <boxGeometry args={[sizeW, h, sizeD]} />;
      case "flatBox":
        return <boxGeometry args={[sizeW, h, sizeD]} />;
      case "box":
      default:
        return <boxGeometry args={[sizeW, h, sizeD]} />;
    }
  }, [product.shape, sizeW, sizeD, h]);

  return (
    <mesh position={[posX, posY, posZ]}>
      {geom}
      <meshStandardMaterial
        ref={matRef}
        color="#4a4035"
        roughness={0.7}
        metalness={0.05}
      />
    </mesh>
  );
}

export default function BinProducts({ products, scanProgress, binFloorY }: Props) {
  return (
    <group>
      {products.map((p, i) => (
        <ProductMesh key={i} product={p} scanProgress={scanProgress} binFloorY={binFloorY} />
      ))}
    </group>
  );
}
