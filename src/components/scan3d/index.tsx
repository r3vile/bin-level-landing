"use client";

import { Suspense, useRef, useCallback, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";

export default function ScanVisualization3D({ className = "" }: { className?: string }) {
  const [label, setLabel] = useState({ fill: 0, color: "#F59E0B", opacity: 0 });
  const labelRef = useRef(label);
  labelRef.current = label;

  const onLabelUpdate = useCallback((fill: number, color: string, opacity: number) => {
    const prev = labelRef.current;
    if (fill !== prev.fill || Math.abs(opacity - prev.opacity) > 0.02) {
      setLabel({ fill, color, opacity });
    }
  }, []);

  return (
    <div className={`relative ${className}`}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance", localClippingEnabled: true }}
        camera={{ position: [0, 5.5, 5], fov: 35, near: 0.1, far: 50 }}
        flat
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene onLabelUpdate={onLabelUpdate} />
        </Suspense>
      </Canvas>

      {/* Percentage label overlay */}
      {label.opacity > 0 && (
        <div
          className="absolute bottom-[8%] left-0 right-0 text-center pointer-events-none"
          style={{ opacity: label.opacity }}
        >
          <div
            className="text-4xl sm:text-5xl font-bold font-mono"
            style={{ color: label.color }}
          >
            {label.fill}%
          </div>
          <div className="text-xs text-slate-400/45 mt-1 font-medium">
            Füllstand
          </div>
        </div>
      )}
    </div>
  );
}
