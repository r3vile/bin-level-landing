"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Product3D, BIN_W, BIN_D, BIN_H } from "./binData";

const productColors: Record<string, string> = {
  box: "#8b7355",
  tallBox: "#7a6b52",
  cylinder: "#e8e0d4",
  flatBox: "#c4a97d",
};

const tmpEmissive = new THREE.Color();

interface Props {
  products: Product3D[];
  scanProgress: React.MutableRefObject<number>;
  fadeOpacity: React.MutableRefObject<number>;
  binFloorY: number;
}

function ProductMesh({
  product,
  scanProgress,
  fadeOpacity,
  binFloorY,
}: {
  product: Product3D;
  scanProgress: React.MutableRefObject<number>;
  fadeOpacity: React.MutableRefObject<number>;
  binFloorY: number;
}) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null!);
  const targetColor = useMemo(() => new THREE.Color(product.heat), [product.heat]);
  const baseColor = useMemo(
    () => new THREE.Color(productColors[product.shape] || "#8b7355"),
    [product.shape],
  );

  const posX = -BIN_W / 2 + product.x * BIN_W + (product.w * BIN_W) / 2;
  const posZ = -BIN_D / 2 + product.z * BIN_D + (product.d * BIN_D) / 2;
  const h = product.height * BIN_H;
  const posY = binFloorY + h / 2;
  const sizeW = product.w * BIN_W * 0.94;
  const sizeD = product.d * BIN_D * 0.94;
  const normZ = product.z + product.d / 2;

  useFrame(() => {
    if (!matRef.current) return;
    const sp = scanProgress.current;
    const fo = fadeOpacity.current;

    matRef.current.opacity = fo;

    if (sp > normZ) {
      const lerpSpeed = 0.1;
      matRef.current.color.lerp(targetColor, lerpSpeed);
      matRef.current.emissive.lerp(
        tmpEmissive.copy(targetColor).multiplyScalar(0.3),
        lerpSpeed,
      );
      matRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        matRef.current.emissiveIntensity,
        0.6,
        lerpSpeed,
      );
      matRef.current.roughness = THREE.MathUtils.lerp(matRef.current.roughness, 0.4, lerpSpeed);
    } else {
      matRef.current.color.lerp(baseColor, 0.12);
      matRef.current.emissive.lerp(tmpEmissive.set("#000000"), 0.15);
      matRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        matRef.current.emissiveIntensity,
        0,
        0.15,
      );
      matRef.current.roughness = THREE.MathUtils.lerp(matRef.current.roughness, 0.75, 0.12);
    }
  });

  const geom = useMemo(() => {
    switch (product.shape) {
      case "cylinder":
        return (
          <cylinderGeometry
            args={[Math.min(sizeW, sizeD) / 2, Math.min(sizeW, sizeD) / 2, h, 16]}
          />
        );
      case "tallBox":
      case "flatBox":
      case "box":
      default:
        return <boxGeometry args={[sizeW, h, sizeD]} />;
    }
  }, [product.shape, sizeW, sizeD, h]);

  const roughness = product.shape === "cylinder" ? 0.3 : 0.75;
  const metalness = product.shape === "cylinder" ? 0.05 : 0.0;

  return (
    <mesh position={[posX, posY, posZ]}>
      {geom}
      <meshStandardMaterial
        ref={matRef}
        color={productColors[product.shape] || "#8b7355"}
        roughness={roughness}
        metalness={metalness}
        emissiveIntensity={0}
        transparent
        opacity={1}
      />
    </mesh>
  );
}

export default function BinProducts({ products, scanProgress, fadeOpacity, binFloorY }: Props) {
  return (
    <group>
      {products.map((p, i) => (
        <ProductMesh
          key={i}
          product={p}
          scanProgress={scanProgress}
          fadeOpacity={fadeOpacity}
          binFloorY={binFloorY}
        />
      ))}
    </group>
  );
}
