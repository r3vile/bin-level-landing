export default function BinComparison({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Left Bin: Only 15% filled */}
      <g>
        {/* Bin outline */}
        <rect x="40" y="40" width="200" height="200" rx="8" stroke="#334155" strokeWidth="2" fill="#1E293B" />

        {/* Wasted space (amber stripes) */}
        <defs>
          <pattern id="diag-stripes" patternUnits="userSpaceOnUse" width="8" height="8">
            <path d="M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4" stroke="#F59E0B" strokeWidth="1" opacity="0.3" />
          </pattern>
        </defs>
        <rect x="44" y="44" width="192" height="163" rx="4" fill="url(#diag-stripes)" />

        {/* Fill level (15%) */}
        <rect x="44" y="207" width="192" height="29" rx="4" fill="#F59E0B" opacity="0.4" />
        {/* Product shape */}
        <rect x="80" y="212" width="50" height="18" rx="3" fill="#F59E0B" opacity="0.7" />

        {/* WMS Status badge */}
        <rect x="80" y="10" width="120" height="24" rx="12" fill="#10B981" opacity="0.15" />
        <text x="140" y="27" textAnchor="middle" fill="#10B981" fontSize="11" fontWeight="600" fontFamily="var(--font-jakarta)">
          WMS Status: Voll ✓
        </text>

        {/* Actual fill label */}
        <text x="140" y="262" textAnchor="middle" fill="#F59E0B" fontSize="14" fontWeight="700" fontFamily="var(--font-mono)">
          Realer Füllstand: 15%
        </text>
      </g>

      {/* Arrow */}
      <g>
        <line x1="270" y1="140" x2="320" y2="140" stroke="#F59E0B" strokeWidth="2" />
        <polygon points="320,134 335,140 320,146" fill="#F59E0B" />
        <text x="302" y="128" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="var(--font-jakarta)">
          Nach
        </text>
        <text x="302" y="118" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="var(--font-jakarta)">
          Bin Level
        </text>
      </g>

      {/* Right Bin: 85% filled */}
      <g>
        {/* Bin outline */}
        <rect x="360" y="40" width="200" height="200" rx="8" stroke="#334155" strokeWidth="2" fill="#1E293B" />

        {/* Small empty space at top */}
        <rect x="364" y="44" width="192" height="29" rx="4" fill="url(#diag-stripes)" opacity="0.3" />

        {/* Fill level (85%) */}
        <rect x="364" y="73" width="192" height="163" rx="4" fill="#10B981" opacity="0.2" />
        {/* Product shapes */}
        <rect x="380" y="80" width="60" height="30" rx="3" fill="#10B981" opacity="0.4" />
        <rect x="450" y="80" width="45" height="30" rx="3" fill="#10B981" opacity="0.4" />
        <rect x="380" y="118" width="50" height="25" rx="3" fill="#10B981" opacity="0.4" />
        <rect x="440" y="118" width="55" height="25" rx="3" fill="#10B981" opacity="0.4" />
        <rect x="380" y="150" width="70" height="30" rx="3" fill="#10B981" opacity="0.4" />
        <rect x="460" y="150" width="35" height="30" rx="3" fill="#10B981" opacity="0.4" />
        <rect x="380" y="188" width="45" height="40" rx="3" fill="#10B981" opacity="0.4" />
        <rect x="435" y="188" width="60" height="40" rx="3" fill="#10B981" opacity="0.4" />

        {/* Status badge */}
        <rect x="385" y="10" width="150" height="24" rx="12" fill="#10B981" opacity="0.15" />
        <text x="460" y="27" textAnchor="middle" fill="#10B981" fontSize="11" fontWeight="600" fontFamily="var(--font-jakarta)">
          Nach Bin Level: 85%
        </text>

        {/* Fill label */}
        <text x="460" y="262" textAnchor="middle" fill="#10B981" fontSize="14" fontWeight="700" fontFamily="var(--font-mono)">
          Optimierter Füllstand: 85%
        </text>
      </g>
    </svg>
  );
}
