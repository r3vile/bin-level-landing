"use client";

import { useEffect, useRef, useCallback } from "react";

// Bin data from real app
const bins = [
  { fill: 16, color: "#F59E0B" },
  { fill: 76, color: "#10B981" },
  { fill: 42, color: "#F59E0B" },
  { fill: 92, color: "#10B981" },
  { fill: 14, color: "#F59E0B" },
  { fill: 68, color: "#10B981" },
];

const CYCLE = 4200;

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; size: number;
}

export default function ScanVisualization({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  const drawHeatmap = useCallback((
    ctx: CanvasRenderingContext2D, fill: number,
    x: number, y: number, w: number, h: number, revealY: number
  ) => {
    if (revealY <= 0) return;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h * revealY);
    ctx.clip();

    // Red/orange base (empty space near sensor)
    const base = ctx.createLinearGradient(x, y, x + w, y + h);
    base.addColorStop(0, "#cc2200");
    base.addColorStop(0.3, "#dd3500");
    base.addColorStop(0.6, "#bb2200");
    base.addColorStop(1, "#aa1800");
    ctx.fillStyle = base;
    ctx.fillRect(x, y, w, h);

    // Product blobs — cooler = taller items
    const blobs = [
      { bx: 0.15, by: 0.12, r: 0.16, c: "#ee8800", min: 0.08 },
      { bx: 0.62, by: 0.10, r: 0.19, c: "#33cc00", min: 0.25 },
      { bx: 0.18, by: 0.55, r: 0.22, c: "#0088ff", min: 0.45 },
      { bx: 0.72, by: 0.58, r: 0.15, c: "#eecc00", min: 0.12 },
      { bx: 0.40, by: 0.32, r: 0.14, c: "#00bb77", min: 0.55 },
      { bx: 0.82, by: 0.35, r: 0.11, c: "#2266ee", min: 0.70 },
      { bx: 0.50, by: 0.75, r: 0.18, c: "#ff6600", min: 0.10 },
    ];
    const fn = fill / 100;
    for (const b of blobs) {
      if (fn < b.min) continue;
      const cx = x + b.bx * w;
      const cy = y + b.by * h;
      const rad = b.r * Math.min(w, h) * (0.7 + (fn - b.min) * 0.4);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
      g.addColorStop(0, b.c);
      g.addColorStop(0.5, b.c + "88");
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.fill();
    }

    // Noise grain
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 120; i++) {
      const nx = x + Math.random() * w;
      const ny = y + Math.random() * h;
      ctx.fillStyle = Math.random() > 0.5 ? "#ffffff" : "#000000";
      ctx.fillRect(nx, ny, 1.5, 1.5);
    }
    ctx.globalAlpha = 1;

    ctx.restore();
  }, []);

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

      // Timing
      const slideIn = Math.min(t / 0.10, 1);
      const easeIn = 1 - Math.pow(1 - slideIn, 4);
      const scanP = t < 0.16 ? 0 : t > 0.58 ? 1 : (t - 0.16) / 0.42;
      const labelP = t < 0.62 ? 0 : Math.min((t - 0.62) / 0.06, 1);
      const slideOut = t > 0.86 ? Math.min((t - 0.86) / 0.14, 1) : 0;
      const easeOut = slideOut * slideOut * slideOut;
      const vis = easeIn * (1 - easeOut);

      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h * 0.46;

      // Responsive sizing
      const portW = Math.min(w * 0.82, 380);
      const portH = portW * 0.58;
      const cutW = portW * 0.55;
      const cutH = portH * 0.72;
      const cutX = cx - cutW / 2;
      const cutY = cy - cutH / 2;

      // Slide offset
      const offX = (1 - easeIn) * w * 0.4 - easeOut * w * 0.5;

      ctx.save();
      ctx.globalAlpha = vis;

      // ── White workspace surface (with perspective) ──
      const perspSkew = 0.02;
      ctx.fillStyle = "#e8ecf1";
      ctx.beginPath();
      ctx.moveTo(cx - portW / 2 - portW * perspSkew, cy - portH / 2);
      ctx.lineTo(cx + portW / 2 + portW * perspSkew, cy - portH / 2);
      ctx.lineTo(cx + portW / 2, cy + portH / 2);
      ctx.lineTo(cx - portW / 2, cy + portH / 2);
      ctx.closePath();
      ctx.fill();

      // Subtle shadow on workspace
      ctx.strokeStyle = "rgba(0,0,0,0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // ── Dark border/gasket around cutout ──
      const gasket = 6;
      ctx.fillStyle = "#1a1f2e";
      ctx.beginPath();
      ctx.roundRect(cutX - gasket, cutY - gasket, cutW + gasket * 2, cutH + gasket * 2, 4);
      ctx.fill();

      // ── Black bin cutout ──
      ctx.save();
      ctx.translate(offX * 0.15, 0); // Bin slides slightly within cutout
      ctx.fillStyle = "#0c1018";
      ctx.beginPath();
      ctx.roundRect(cutX, cutY, cutW, cutH, 2);
      ctx.fill();

      // Bin internal edges (subtle grid pattern like real AutoStore bin)
      ctx.strokeStyle = "rgba(51, 65, 85, 0.25)";
      ctx.lineWidth = 0.5;
      for (let gx = 1; gx < 4; gx++) {
        const lx = cutX + (cutW / 4) * gx;
        ctx.beginPath();
        ctx.moveTo(lx, cutY + 2);
        ctx.lineTo(lx, cutY + cutH - 2);
        ctx.stroke();
      }
      for (let gy = 1; gy < 3; gy++) {
        const ly = cutY + (cutH / 3) * gy;
        ctx.beginPath();
        ctx.moveTo(cutX + 2, ly);
        ctx.lineTo(cutX + cutW - 2, ly);
        ctx.stroke();
      }

      // ── Products inside bin (simple shapes) ──
      if (bin.fill > 15) {
        ctx.fillStyle = "rgba(71, 85, 105, 0.2)";
        ctx.fillRect(cutX + cutW * 0.08, cutY + cutH * 0.1, cutW * 0.3, cutH * 0.35);
        ctx.fillRect(cutX + cutW * 0.42, cutY + cutH * 0.08, cutW * 0.25, cutH * 0.4);
      }
      if (bin.fill > 40) {
        ctx.fillRect(cutX + cutW * 0.12, cutY + cutH * 0.52, cutW * 0.35, cutH * 0.38);
        ctx.fillRect(cutX + cutW * 0.55, cutY + cutH * 0.55, cutW * 0.3, cutH * 0.35);
      }
      if (bin.fill > 70) {
        ctx.fillRect(cutX + cutW * 0.7, cutY + cutH * 0.12, cutW * 0.22, cutH * 0.35);
      }

      // ── Heatmap reveal (clipped to cutout) ──
      drawHeatmap(ctx, bin.fill, cutX + 1, cutY + 1, cutW - 2, cutH - 2, scanP);

      ctx.restore(); // End bin slide

      // ── Scan line ──
      if (scanP > 0 && scanP < 1) {
        const slY = cutY + scanP * cutH;
        const slGrad = ctx.createLinearGradient(0, slY - 15, 0, slY + 15);
        slGrad.addColorStop(0, "transparent");
        slGrad.addColorStop(0.35, "rgba(245, 158, 11, 0.05)");
        slGrad.addColorStop(0.5, "rgba(245, 158, 11, 0.25)");
        slGrad.addColorStop(0.65, "rgba(245, 158, 11, 0.05)");
        slGrad.addColorStop(1, "transparent");
        ctx.fillStyle = slGrad;
        ctx.fillRect(cutX, slY - 15, cutW, 30);

        ctx.strokeStyle = "rgba(245, 158, 11, 0.7)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(cutX + 3, slY);
        ctx.lineTo(cutX + cutW - 3, slY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Scan particles
        if (Math.random() < 0.4) {
          particlesRef.current.push({
            x: cutX + Math.random() * cutW,
            y: slY,
            vx: (Math.random() - 0.5) * 0.8,
            vy: -Math.random() * 2 - 0.5,
            life: 1, size: Math.random() * 2 + 0.5,
          });
        }
      }

      // Particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx; p.y += p.vy; p.life -= 0.025;
        if (p.life <= 0) return false;
        ctx.fillStyle = `rgba(245, 158, 11, ${p.life * 0.6})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });

      // ── Sensor indicator (top center of cutout) ──
      const sensorX = cx;
      const sensorY = cutY - gasket - 18;

      // Sensor dot
      const scanning = scanP > 0 && scanP < 1;
      ctx.fillStyle = scanning ? "#F59E0B" : "#475569";
      ctx.beginPath();
      ctx.arc(sensorX, sensorY, 4, 0, Math.PI * 2);
      ctx.fill();

      if (scanning) {
        // Sensor glow
        const sg = ctx.createRadialGradient(sensorX, sensorY, 0, sensorX, sensorY, 18);
        sg.addColorStop(0, "rgba(245, 158, 11, 0.35)");
        sg.addColorStop(1, "transparent");
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.arc(sensorX, sensorY, 18, 0, Math.PI * 2);
        ctx.fill();

        // Beam lines from sensor to cutout edges
        ctx.strokeStyle = "rgba(245, 158, 11, 0.08)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sensorX, sensorY + 4);
        ctx.lineTo(cutX + 6, cutY);
        ctx.moveTo(sensorX, sensorY + 4);
        ctx.lineTo(cutX + cutW - 6, cutY);
        ctx.stroke();
      }

      // ── Warning sticker (like the real port) ──
      const stickerX = cx - 10;
      const stickerY = cutY + cutH + gasket + 4;
      ctx.fillStyle = "#eab308";
      ctx.fillRect(stickerX, stickerY, 8, 8);
      ctx.fillRect(stickerX + 12, stickerY, 8, 8);
      ctx.strokeStyle = "#0c1018";
      ctx.lineWidth = 0.5;
      ctx.strokeRect(stickerX, stickerY, 8, 8);
      ctx.strokeRect(stickerX + 12, stickerY, 8, 8);

      // ── Corner screws (like real port) ──
      ctx.fillStyle = "rgba(148, 163, 184, 0.3)";
      const sm = 12;
      const screwPos = [
        [cx - portW / 2 + sm, cy - portH / 2 + sm],
        [cx + portW / 2 - sm, cy - portH / 2 + sm],
        [cx - portW / 2 + sm, cy + portH / 2 - sm],
        [cx + portW / 2 - sm, cy + portH / 2 - sm],
      ];
      for (const [sx, sy] of screwPos) {
        ctx.beginPath();
        ctx.arc(sx, sy, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Fill percentage result ──
      if (labelP > 0) {
        ctx.save();
        ctx.globalAlpha = labelP * vis;
        const lY = cy + portH / 2 + 50;

        // Glow
        ctx.shadowColor = bin.color;
        ctx.shadowBlur = 25;
        ctx.fillStyle = bin.color;
        ctx.font = `bold ${Math.min(w * 0.11, 52)}px 'JetBrains Mono', 'SF Mono', monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${bin.fill}%`, cx, lY);
        ctx.shadowBlur = 0;

        // Sublabel
        ctx.fillStyle = "rgba(148, 163, 184, 0.5)";
        ctx.font = `500 ${Math.min(w * 0.03, 12)}px system-ui, sans-serif`;
        ctx.fillText("Füllstand erkannt", cx, lY + 30);

        ctx.restore();
      }

      ctx.restore();
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [drawHeatmap]);

  return (
    <div className={`relative ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }} />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_60%_at_50%_42%,rgba(245,158,11,0.05),transparent)]" />
    </div>
  );
}
