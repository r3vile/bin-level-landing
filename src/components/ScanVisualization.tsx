"use client";

import { useEffect, useRef } from "react";

// Each bin defines products as rectangles + their heatmap color
// The heatmap is generated FROM these same rectangles
interface Product {
  x: number; y: number; w: number; h: number; // 0-1 normalized
  heat: string; // heatmap color (blue=tall, green=medium, yellow=short, red bg=empty)
}

interface BinData {
  fill: number;
  color: string;
  products: Product[];
}

const bins: BinData[] = [
  {
    fill: 16, color: "#F59E0B",
    products: [
      { x: 0.05, y: 0.6, w: 0.35, h: 0.35, heat: "#ddaa00" },
    ],
  },
  {
    fill: 76, color: "#10B981",
    products: [
      { x: 0.04, y: 0.04, w: 0.44, h: 0.44, heat: "#0077ee" },
      { x: 0.52, y: 0.04, w: 0.44, h: 0.32, heat: "#22aa44" },
      { x: 0.04, y: 0.52, w: 0.30, h: 0.44, heat: "#33bb55" },
      { x: 0.38, y: 0.52, w: 0.58, h: 0.44, heat: "#0099dd" },
    ],
  },
  {
    fill: 42, color: "#F59E0B",
    products: [
      { x: 0.05, y: 0.05, w: 0.55, h: 0.4, heat: "#33aa33" },
      { x: 0.05, y: 0.55, w: 0.4, h: 0.4, heat: "#eeaa00" },
    ],
  },
  {
    fill: 92, color: "#10B981",
    products: [
      { x: 0.03, y: 0.03, w: 0.46, h: 0.30, heat: "#0066cc" },
      { x: 0.52, y: 0.03, w: 0.45, h: 0.30, heat: "#0088dd" },
      { x: 0.03, y: 0.36, w: 0.30, h: 0.30, heat: "#22aa55" },
      { x: 0.36, y: 0.36, w: 0.61, h: 0.30, heat: "#0055bb" },
      { x: 0.03, y: 0.69, w: 0.50, h: 0.28, heat: "#33bb66" },
      { x: 0.56, y: 0.69, w: 0.41, h: 0.28, heat: "#0077cc" },
    ],
  },
  {
    fill: 14, color: "#F59E0B",
    products: [
      { x: 0.55, y: 0.6, w: 0.38, h: 0.35, heat: "#cc8800" },
    ],
  },
  {
    fill: 68, color: "#10B981",
    products: [
      { x: 0.04, y: 0.04, w: 0.42, h: 0.55, heat: "#0088dd" },
      { x: 0.50, y: 0.04, w: 0.46, h: 0.35, heat: "#44bb55" },
      { x: 0.50, y: 0.45, w: 0.46, h: 0.50, heat: "#22aa44" },
    ],
  },
];

const CYCLE = 3600; // slightly faster

export default function ScanVisualization({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    startRef.current = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = (now: number) => {
      const elapsed = now - startRef.current;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const binIdx = Math.floor(elapsed / CYCLE) % bins.length;
      const t = (elapsed % CYCLE) / CYCLE;
      const bin = bins[binIdx];

      // Timing — faster scan
      const slideIn = Math.min(t / 0.10, 1);
      const easeIn = 1 - Math.pow(1 - slideIn, 3);
      const scanP = t < 0.14 ? 0 : t > 0.50 ? 1 : (t - 0.14) / 0.36;
      const labelP = t < 0.54 ? 0 : Math.min((t - 0.54) / 0.06, 1);
      const slideOut = t > 0.85 ? Math.min((t - 0.85) / 0.15, 1) : 0;
      const easeOut = slideOut * slideOut;

      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h * 0.44;

      // Sizing
      const portW = Math.min(w * 0.85, 400);
      const portH = portW * 0.52;
      const cutW = portW * 0.52;
      const cutH = portH * 0.75;
      const cutX = cx - cutW / 2;
      const cutY = cy - cutH / 2;
      const gasket = 5;

      // ── Static table surface (rectangular, no perspective) ──
      ctx.fillStyle = "#dde2e8";
      ctx.fillRect(cx - portW / 2, cy - portH / 2, portW, portH);
      ctx.strokeStyle = "rgba(0,0,0,0.06)";
      ctx.lineWidth = 1;
      ctx.strokeRect(cx - portW / 2, cy - portH / 2, portW, portH);

      // Corner screws
      ctx.fillStyle = "rgba(120, 130, 145, 0.35)";
      const sm = 10;
      for (const [sx, sy] of [
        [cx - portW / 2 + sm, cy - portH / 2 + sm],
        [cx + portW / 2 - sm, cy - portH / 2 + sm],
        [cx - portW / 2 + sm, cy + portH / 2 - sm],
        [cx + portW / 2 - sm, cy + portH / 2 - sm],
      ]) {
        ctx.beginPath();
        ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Dark gasket around cutout
      ctx.fillStyle = "#1a1f2e";
      ctx.fillRect(cutX - gasket, cutY - gasket, cutW + gasket * 2, cutH + gasket * 2);

      // Warning stickers
      const stY = cutY + cutH + gasket + 3;
      ctx.fillStyle = "#eab308";
      ctx.fillRect(cx - 9, stY, 7, 7);
      ctx.fillRect(cx + 2, stY, 7, 7);

      // Sensor dot (static, no glow)
      ctx.fillStyle = scanP > 0 && scanP < 1 ? "#F59E0B" : "#5a6577";
      ctx.beginPath();
      ctx.arc(cx, cutY - gasket - 10, 3, 0, Math.PI * 2);
      ctx.fill();

      // ── Bin content (slides in/out) ──
      const binOffX = (1 - easeIn) * w * 0.5 - easeOut * w * 0.5;

      ctx.save();
      // Clip to cutout area
      ctx.beginPath();
      ctx.rect(cutX, cutY, cutW, cutH);
      ctx.clip();

      ctx.translate(binOffX, 0);

      // Bin background
      ctx.fillStyle = "#0c1018";
      ctx.fillRect(cutX, cutY, cutW, cutH);

      // Bin internal grid
      ctx.strokeStyle = "rgba(51, 65, 85, 0.2)";
      ctx.lineWidth = 0.5;
      for (let gx = 1; gx < 4; gx++) {
        ctx.beginPath();
        ctx.moveTo(cutX + (cutW / 4) * gx, cutY + 1);
        ctx.lineTo(cutX + (cutW / 4) * gx, cutY + cutH - 1);
        ctx.stroke();
      }
      for (let gy = 1; gy < 3; gy++) {
        ctx.beginPath();
        ctx.moveTo(cutX + 1, cutY + (cutH / 3) * gy);
        ctx.lineTo(cutX + cutW - 1, cutY + (cutH / 3) * gy);
        ctx.stroke();
      }

      // Products inside bin (dark gray rectangles)
      for (const p of bin.products) {
        const px = cutX + p.x * cutW;
        const py = cutY + p.y * cutH;
        const pw = p.w * cutW;
        const ph = p.h * cutH;
        ctx.fillStyle = "rgba(55, 65, 81, 0.35)";
        ctx.fillRect(px, py, pw, ph);
        ctx.strokeStyle = "rgba(75, 85, 99, 0.2)";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(px, py, pw, ph);
      }

      // ── Heatmap overlay — rectangles matching products ──
      if (scanP > 0) {
        // Clip heatmap reveal to scan progress
        ctx.save();
        ctx.beginPath();
        ctx.rect(cutX, cutY, cutW, cutH * scanP);
        ctx.clip();

        // Red/orange base (empty = near sensor)
        ctx.fillStyle = "#cc2200";
        ctx.fillRect(cutX, cutY, cutW, cutH);

        // Slight variation in base
        const baseGrad = ctx.createLinearGradient(cutX, cutY, cutX + cutW, cutY + cutH);
        baseGrad.addColorStop(0, "rgba(200, 40, 0, 0.3)");
        baseGrad.addColorStop(0.5, "rgba(180, 30, 0, 0.1)");
        baseGrad.addColorStop(1, "rgba(210, 50, 0, 0.3)");
        ctx.fillStyle = baseGrad;
        ctx.fillRect(cutX, cutY, cutW, cutH);

        // Product heatmap rectangles — matching product positions exactly
        for (const p of bin.products) {
          const px = cutX + p.x * cutW;
          const py = cutY + p.y * cutH;
          const pw = p.w * cutW;
          const ph = p.h * cutH;

          // Main product heat
          ctx.fillStyle = p.heat;
          ctx.fillRect(px, py, pw, ph);

          // Soft edge blending
          const edgeSize = 4;
          // Top edge
          const tg = ctx.createLinearGradient(0, py, 0, py + edgeSize);
          tg.addColorStop(0, "#cc220088");
          tg.addColorStop(1, "transparent");
          ctx.fillStyle = tg;
          ctx.fillRect(px, py, pw, edgeSize);
          // Bottom edge
          const bg = ctx.createLinearGradient(0, py + ph - edgeSize, 0, py + ph);
          bg.addColorStop(0, "transparent");
          bg.addColorStop(1, "#cc220088");
          ctx.fillStyle = bg;
          ctx.fillRect(px, py + ph - edgeSize, pw, edgeSize);
          // Left edge
          const lg = ctx.createLinearGradient(px, 0, px + edgeSize, 0);
          lg.addColorStop(0, "#cc220088");
          lg.addColorStop(1, "transparent");
          ctx.fillStyle = lg;
          ctx.fillRect(px, py, edgeSize, ph);
          // Right edge
          const rg = ctx.createLinearGradient(px + pw - edgeSize, 0, px + pw, 0);
          rg.addColorStop(0, "transparent");
          rg.addColorStop(1, "#cc220088");
          ctx.fillStyle = rg;
          ctx.fillRect(px + pw - edgeSize, py, edgeSize, ph);
        }

        // Noise grain for realism
        ctx.globalAlpha = 0.06;
        for (let i = 0; i < 80; i++) {
          ctx.fillStyle = Math.random() > 0.5 ? "#ffffff" : "#000000";
          ctx.fillRect(cutX + Math.random() * cutW, cutY + Math.random() * cutH, 1, 1);
        }
        ctx.globalAlpha = 1;

        ctx.restore(); // End heatmap clip
      }

      ctx.restore(); // End bin clip + translate

      // ── Scan line (on top of everything, within cutout bounds) ──
      if (scanP > 0 && scanP < 1) {
        const slY = cutY + scanP * cutH;

        // Soft glow band
        const slGrad = ctx.createLinearGradient(0, slY - 10, 0, slY + 10);
        slGrad.addColorStop(0, "transparent");
        slGrad.addColorStop(0.4, "rgba(245, 158, 11, 0.06)");
        slGrad.addColorStop(0.5, "rgba(245, 158, 11, 0.18)");
        slGrad.addColorStop(0.6, "rgba(245, 158, 11, 0.06)");
        slGrad.addColorStop(1, "transparent");
        ctx.fillStyle = slGrad;
        ctx.fillRect(cutX, slY - 10, cutW, 20);

        // Thin line
        ctx.strokeStyle = "rgba(245, 158, 11, 0.5)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(cutX + 2, slY);
        ctx.lineTo(cutX + cutW - 2, slY);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // ── Percentage label ──
      if (labelP > 0) {
        ctx.save();
        ctx.globalAlpha = labelP;
        const lY = cy + portH / 2 + 44;

        ctx.fillStyle = bin.color;
        ctx.font = `bold ${Math.min(w * 0.1, 48)}px 'JetBrains Mono', 'SF Mono', monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${bin.fill}%`, cx, lY);

        ctx.fillStyle = "rgba(148, 163, 184, 0.45)";
        ctx.font = `500 ${Math.min(w * 0.028, 11)}px system-ui, sans-serif`;
        ctx.fillText("Füllstand", cx, lY + 26);

        ctx.restore();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }} />
    </div>
  );
}
