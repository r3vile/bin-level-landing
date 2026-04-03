"use client";

import dynamic from "next/dynamic";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const AutoStoreGrid = dynamic(() => import("@/components/three/AutoStoreGrid"), {
  ssr: false,
  loading: () => <div className="w-full h-[320px] lg:h-[400px]" />,
});

export default function GridDivider() {
  const { ref, isVisible } = useScrollAnimation(0.05);

  return (
    <section
      ref={ref}
      className="relative bg-bg-primary overflow-hidden noise-bg"
    >
      {/* Top fade */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-bg-secondary to-transparent z-10" />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface-light to-transparent z-10" />

      {/* 3D Grid */}
      <div
        className={`w-full h-[320px] lg:h-[400px] transition-opacity duration-1000 ease-apple ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <AutoStoreGrid className="w-full h-full" />
      </div>
    </section>
  );
}
