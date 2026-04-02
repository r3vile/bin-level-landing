export const CYCLE = 3600;

export type ProductShape = "box" | "tallBox" | "cylinder" | "flatBox";

export interface Product3D {
  x: number;
  z: number;
  w: number;
  d: number;
  height: number;
  heat: string;
  shape: ProductShape;
}

export interface BinData3D {
  fill: number;
  color: string;
  products: Product3D[];
}

// Bin inner dimensions (world units)
export const BIN_W = 2.6;
export const BIN_D = 2.0;
export const BIN_H = 1.4;

// Aperture dimensions
export const APT_W = 2.8;
export const APT_D = 2.2;

export const bins: BinData3D[] = [
  {
    // 16% fill — one small flat package in the corner
    fill: 16,
    color: "#F59E0B",
    products: [
      { x: 0.1, z: 0.55, w: 0.35, d: 0.35, height: 0.2, heat: "#ddaa00", shape: "flatBox" },
    ],
  },
  {
    // 76% fill — 4 products, good mix
    fill: 76,
    color: "#10B981",
    products: [
      { x: 0.04, z: 0.04, w: 0.42, d: 0.42, height: 0.85, heat: "#0077ee", shape: "tallBox" },
      { x: 0.52, z: 0.04, w: 0.42, d: 0.30, height: 0.55, heat: "#22aa44", shape: "box" },
      { x: 0.04, z: 0.52, w: 0.28, d: 0.42, height: 0.50, heat: "#33bb55", shape: "cylinder" },
      { x: 0.38, z: 0.52, w: 0.56, d: 0.42, height: 0.80, heat: "#0099dd", shape: "tallBox" },
    ],
  },
  {
    // 42% fill — 2 products
    fill: 42,
    color: "#F59E0B",
    products: [
      { x: 0.05, z: 0.05, w: 0.50, d: 0.40, height: 0.50, heat: "#33aa33", shape: "box" },
      { x: 0.05, z: 0.55, w: 0.38, d: 0.38, height: 0.25, heat: "#eeaa00", shape: "cylinder" },
    ],
  },
  {
    // 92% fill — 6 products, densely packed
    fill: 92,
    color: "#10B981",
    products: [
      { x: 0.03, z: 0.03, w: 0.44, d: 0.28, height: 0.85, heat: "#0066cc", shape: "tallBox" },
      { x: 0.52, z: 0.03, w: 0.44, d: 0.28, height: 0.80, heat: "#0088dd", shape: "tallBox" },
      { x: 0.03, z: 0.35, w: 0.28, d: 0.28, height: 0.55, heat: "#22aa55", shape: "box" },
      { x: 0.35, z: 0.35, w: 0.60, d: 0.28, height: 0.75, heat: "#0055bb", shape: "box" },
      { x: 0.03, z: 0.68, w: 0.48, d: 0.28, height: 0.50, heat: "#33bb66", shape: "cylinder" },
      { x: 0.56, z: 0.68, w: 0.40, d: 0.28, height: 0.70, heat: "#0077cc", shape: "box" },
    ],
  },
  {
    // 14% fill — one small item
    fill: 14,
    color: "#F59E0B",
    products: [
      { x: 0.55, z: 0.55, w: 0.36, d: 0.35, height: 0.22, heat: "#cc8800", shape: "flatBox" },
    ],
  },
  {
    // 68% fill — 3 products
    fill: 68,
    color: "#10B981",
    products: [
      { x: 0.04, z: 0.04, w: 0.40, d: 0.52, height: 0.80, heat: "#0088dd", shape: "tallBox" },
      { x: 0.50, z: 0.04, w: 0.44, d: 0.33, height: 0.50, heat: "#44bb55", shape: "box" },
      { x: 0.50, z: 0.44, w: 0.44, d: 0.48, height: 0.55, heat: "#22aa44", shape: "cylinder" },
    ],
  },
];
