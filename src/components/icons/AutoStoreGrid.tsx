export default function AutoStoreGrid({ className = "" }: { className?: string }) {
  // Isometric bin: 3 visible faces (top, left, right)
  const binWidth = 40;
  const binHeight = 30;
  const gap = 2;
  const cols = 4;
  const rows = 4;

  // Isometric projection helpers
  const isoX = (col: number, row: number) =>
    200 + (col - row) * ((binWidth + gap) * 0.5);
  const isoY = (col: number, row: number) =>
    80 + (col + row) * ((binHeight + gap) * 0.35);

  // Which bins glow amber (nearly empty) vs green (filled)
  const binStates: Record<string, "amber" | "green"> = {
    "0,1": "amber",
    "1,3": "amber",
    "2,0": "amber",
    "3,2": "amber",
    "0,0": "green",
    "0,2": "green",
    "0,3": "green",
    "1,0": "green",
    "1,1": "green",
    "1,2": "green",
    "2,1": "green",
    "2,2": "green",
    "2,3": "green",
    "3,0": "green",
    "3,1": "green",
    "3,3": "green",
  };

  const bins = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = isoX(c, r);
      const y = isoY(c, r);
      const state = binStates[`${r},${c}`] || "green";
      const topColor = state === "amber" ? "#F59E0B" : "#10B981";
      const leftColor = state === "amber" ? "#D97706" : "#059669";
      const rightColor = state === "amber" ? "#B45309" : "#047857";
      const glowClass = state === "amber" ? "animate-pulse-glow" : "";

      bins.push(
        <g key={`${r}-${c}`} className={glowClass}>
          {/* Top face */}
          <polygon
            points={`${x},${y - 12} ${x + 20},${y - 4} ${x},${y + 4} ${x - 20},${y - 4}`}
            fill={topColor}
            opacity={0.9}
          />
          {/* Left face */}
          <polygon
            points={`${x - 20},${y - 4} ${x},${y + 4} ${x},${y + 22} ${x - 20},${y + 14}`}
            fill={leftColor}
            opacity={0.8}
          />
          {/* Right face */}
          <polygon
            points={`${x},${y + 4} ${x + 20},${y - 4} ${x + 20},${y + 14} ${x},${y + 22}`}
            fill={rightColor}
            opacity={0.7}
          />
        </g>
      );
    }
  }

  return (
    <svg
      viewBox="0 0 400 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Grid lines (background) */}
      <g opacity="0.1">
        {Array.from({ length: 5 }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1={100}
            y1={60 + i * 28}
            x2={300}
            y2={60 + i * 28}
            stroke="#94A3B8"
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={140 + i * 40}
            y1={40}
            x2={140 + i * 40}
            y2={200}
            stroke="#94A3B8"
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />
        ))}
      </g>

      {/* Bins */}
      {bins}

      {/* Robot 1 on top */}
      <g>
        <rect x={isoX(1, 0) - 8} y={isoY(1, 0) - 28} width="16" height="10" rx="2" fill="#334155" />
        <rect x={isoX(1, 0) - 4} y={isoY(1, 0) - 32} width="8" height="4" rx="1" fill="#475569" />
        <circle cx={isoX(1, 0)} cy={isoY(1, 0) - 23} r="2" fill="#F59E0B" />
      </g>

      {/* Robot 2 on top */}
      <g>
        <rect x={isoX(3, 1) - 8} y={isoY(3, 1) - 28} width="16" height="10" rx="2" fill="#334155" />
        <rect x={isoX(3, 1) - 4} y={isoY(3, 1) - 32} width="8" height="4" rx="1" fill="#475569" />
        <circle cx={isoX(3, 1)} cy={isoY(3, 1) - 23} r="2" fill="#10B981" />
      </g>

      {/* Sensor beam on amber bin */}
      <line
        x1={isoX(0, 1)}
        y1={isoY(0, 1) - 40}
        x2={isoX(0, 1)}
        y2={isoY(0, 1) - 14}
        stroke="#F59E0B"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        className="animate-pulse-glow"
      />
      <circle
        cx={isoX(0, 1)}
        cy={isoY(0, 1) - 42}
        r="4"
        fill="#F59E0B"
        opacity="0.8"
        className="animate-pulse-glow"
      />

      {/* Legend */}
      <g transform="translate(60, 240)">
        <rect width="12" height="12" rx="2" fill="#F59E0B" opacity="0.9" />
        <text x="18" y="10" fill="#94A3B8" fontSize="11" fontFamily="var(--font-jakarta)">
          Fast leer — Platz für Einlagerung
        </text>
      </g>
      <g transform="translate(60, 260)">
        <rect width="12" height="12" rx="2" fill="#10B981" opacity="0.9" />
        <text x="18" y="10" fill="#94A3B8" fontSize="11" fontFamily="var(--font-jakarta)">
          Gut gefüllt
        </text>
      </g>
    </svg>
  );
}
