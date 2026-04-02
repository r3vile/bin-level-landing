export default function AutoStoreGrid({ className = "" }: { className?: string }) {
  const cols = 4;
  const rows = 4;

  const isoX = (col: number, row: number) =>
    200 + (col - row) * 22;
  const isoY = (col: number, row: number) =>
    80 + (col + row) * 14;

  const binStates: Record<string, "amber" | "green"> = {
    "0,1": "amber", "1,3": "amber", "2,0": "amber", "3,2": "amber",
    "0,0": "green", "0,2": "green", "0,3": "green",
    "1,0": "green", "1,1": "green", "1,2": "green",
    "2,1": "green", "2,2": "green", "2,3": "green",
    "3,0": "green", "3,1": "green", "3,3": "green",
  };

  const bins = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = isoX(c, r);
      const y = isoY(c, r);
      const state = binStates[`${r},${c}`] || "green";
      const isAmber = state === "amber";
      const glowId = isAmber ? `glow-amber-${r}-${c}` : undefined;

      bins.push(
        <g key={`${r}-${c}`} className={isAmber ? "animate-pulse-glow" : ""}>
          {/* Glow filter for amber bins */}
          {isAmber && (
            <defs>
              <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          )}
          <g filter={isAmber ? `url(#${glowId})` : undefined}>
            {/* Top face */}
            <polygon
              points={`${x},${y - 12} ${x + 20},${y - 4} ${x},${y + 4} ${x - 20},${y - 4}`}
              fill={isAmber ? "url(#grad-amber-top)" : "url(#grad-green-top)"}
            />
            {/* Left face */}
            <polygon
              points={`${x - 20},${y - 4} ${x},${y + 4} ${x},${y + 22} ${x - 20},${y + 14}`}
              fill={isAmber ? "url(#grad-amber-left)" : "url(#grad-green-left)"}
            />
            {/* Right face */}
            <polygon
              points={`${x},${y + 4} ${x + 20},${y - 4} ${x + 20},${y + 14} ${x},${y + 22}`}
              fill={isAmber ? "url(#grad-amber-right)" : "url(#grad-green-right)"}
            />
          </g>
        </g>
      );
    }
  }

  return (
    <svg
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Amber gradients */}
        <linearGradient id="grad-amber-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <linearGradient id="grad-amber-left" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id="grad-amber-right" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#D97706" stopOpacity="0.6" />
        </linearGradient>
        {/* Green gradients */}
        <linearGradient id="grad-green-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
        <linearGradient id="grad-green-left" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="grad-green-right" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0.5" />
        </linearGradient>
        {/* Background glow */}
        <radialGradient id="bg-glow" cx="50%" cy="40%" r="40%">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background glow */}
      <rect width="400" height="300" fill="url(#bg-glow)" />

      {/* Grid lines */}
      <g opacity="0.06">
        {Array.from({ length: 5 }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1={100} y1={60 + i * 28} x2={300} y2={60 + i * 28}
            stroke="#94A3B8" strokeWidth="0.5" strokeDasharray="4 6"
          />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={140 + i * 40} y1={40} x2={140 + i * 40} y2={200}
            stroke="#94A3B8" strokeWidth="0.5" strokeDasharray="4 6"
          />
        ))}
      </g>

      {/* Bins */}
      {bins}

      {/* Robot 1 */}
      <g opacity="0.9">
        <rect x={isoX(1, 0) - 8} y={isoY(1, 0) - 28} width="16" height="10" rx="3" fill="#475569" />
        <rect x={isoX(1, 0) - 4} y={isoY(1, 0) - 32} width="8" height="5" rx="2" fill="#64748B" />
        <circle cx={isoX(1, 0)} cy={isoY(1, 0) - 23} r="2.5" fill="#F59E0B" opacity="0.9" />
      </g>

      {/* Robot 2 */}
      <g opacity="0.9">
        <rect x={isoX(3, 1) - 8} y={isoY(3, 1) - 28} width="16" height="10" rx="3" fill="#475569" />
        <rect x={isoX(3, 1) - 4} y={isoY(3, 1) - 32} width="8" height="5" rx="2" fill="#64748B" />
        <circle cx={isoX(3, 1)} cy={isoY(3, 1) - 23} r="2.5" fill="#10B981" opacity="0.9" />
      </g>

      {/* Sensor beam */}
      <g className="animate-pulse-glow">
        <line
          x1={isoX(0, 1)} y1={isoY(0, 1) - 45}
          x2={isoX(0, 1)} y2={isoY(0, 1) - 14}
          stroke="url(#grad-amber-top)" strokeWidth="1.5" strokeDasharray="3 3"
        />
        <circle cx={isoX(0, 1)} cy={isoY(0, 1) - 47} r="5" fill="#F59E0B" opacity="0.15" />
        <circle cx={isoX(0, 1)} cy={isoY(0, 1) - 47} r="3" fill="#F59E0B" opacity="0.6" />
      </g>

      {/* Legend */}
      <g transform="translate(70, 228)">
        <rect width="10" height="10" rx="2" fill="url(#grad-amber-top)" />
        <text x="16" y="9" fill="#94A3B8" fontSize="10" opacity="0.7" style={{ fontFamily: "system-ui, sans-serif" }}>
          Fast leer — Platz frei
        </text>
      </g>
      <g transform="translate(70, 248)">
        <rect width="10" height="10" rx="2" fill="url(#grad-green-top)" />
        <text x="16" y="9" fill="#94A3B8" fontSize="10" opacity="0.7" style={{ fontFamily: "system-ui, sans-serif" }}>
          Gut gefüllt
        </text>
      </g>
    </svg>
  );
}
