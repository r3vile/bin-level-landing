export default function BinComparison({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="bin-fill-amber" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="bin-fill-green" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="arrow-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        {/* Stripe pattern */}
        <pattern id="diag-stripes" patternUnits="userSpaceOnUse" width="8" height="8">
          <path d="M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4" stroke="#F59E0B" strokeWidth="0.8" opacity="0.2" />
        </pattern>
        {/* Glow filters */}
        <filter id="glow-amber-bin" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-green-bin" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Left Bin: Only 15% filled */}
      <g>
        {/* Outer glow */}
        <rect x="38" y="38" width="204" height="204" rx="12" fill="#F59E0B" opacity="0.03" filter="url(#glow-amber-bin)" />
        {/* Bin outline */}
        <rect x="40" y="40" width="200" height="200" rx="12" stroke="#334155" strokeWidth="1.5" fill="#1E293B" />

        {/* Wasted space */}
        <rect x="44" y="44" width="192" height="163" rx="8" fill="url(#diag-stripes)" />

        {/* Fill level (15%) */}
        <rect x="44" y="207" width="192" height="29" rx="6" fill="url(#bin-fill-amber)" />
        <rect x="76" y="213" width="54" height="17" rx="4" fill="#F59E0B" opacity="0.5" />
        <rect x="138" y="216" width="32" height="14" rx="3" fill="#F59E0B" opacity="0.35" />

        {/* WMS Status badge */}
        <rect x="75" y="10" width="130" height="26" rx="13" fill="#10B981" opacity="0.1" />
        <circle cx="95" cy="23" r="3" fill="#10B981" opacity="0.6" />
        <text x="145" y="28" textAnchor="middle" fill="#10B981" fontSize="11" fontWeight="600" style={{ fontFamily: "system-ui, sans-serif" }}>
          WMS: Voll ✓
        </text>

        {/* Actual fill label */}
        <text x="140" y="264" textAnchor="middle" fill="#F59E0B" fontSize="13" fontWeight="700" opacity="0.9" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          Realer Füllstand: 15%
        </text>
      </g>

      {/* Arrow */}
      <g>
        <line x1="268" y1="140" x2="326" y2="140" stroke="url(#arrow-grad)" strokeWidth="1.5" />
        <polygon points="326,135 338,140 326,145" fill="#F59E0B" opacity="0.9" />
        <text x="303" y="124" textAnchor="middle" fill="#94A3B8" fontSize="9" opacity="0.6" style={{ fontFamily: "system-ui, sans-serif" }}>
          Mit Bin Level
        </text>
      </g>

      {/* Right Bin: 85% filled */}
      <g>
        {/* Outer glow */}
        <rect x="358" y="38" width="204" height="204" rx="12" fill="#10B981" opacity="0.03" filter="url(#glow-green-bin)" />
        {/* Bin outline */}
        <rect x="360" y="40" width="200" height="200" rx="12" stroke="#334155" strokeWidth="1.5" fill="#1E293B" />

        {/* Small empty space */}
        <rect x="364" y="44" width="192" height="24" rx="6" fill="url(#diag-stripes)" opacity="0.2" />

        {/* Fill level (85%) */}
        <rect x="364" y="68" width="192" height="168" rx="6" fill="url(#bin-fill-green)" />
        {/* Product shapes — varied for realism */}
        <rect x="376" y="76" width="58" height="28" rx="4" fill="#10B981" opacity="0.3" />
        <rect x="442" y="76" width="42" height="28" rx="4" fill="#10B981" opacity="0.25" />
        <rect x="492" y="76" width="28" height="28" rx="4" fill="#10B981" opacity="0.2" />
        <rect x="376" y="112" width="48" height="24" rx="4" fill="#10B981" opacity="0.25" />
        <rect x="432" y="112" width="56" height="24" rx="4" fill="#10B981" opacity="0.3" />
        <rect x="496" y="112" width="24" height="24" rx="4" fill="#10B981" opacity="0.2" />
        <rect x="376" y="144" width="68" height="30" rx="4" fill="#10B981" opacity="0.25" />
        <rect x="452" y="144" width="38" height="30" rx="4" fill="#10B981" opacity="0.3" />
        <rect x="376" y="182" width="44" height="42" rx="4" fill="#10B981" opacity="0.3" />
        <rect x="428" y="182" width="60" height="42" rx="4" fill="#10B981" opacity="0.25" />
        <rect x="496" y="182" width="24" height="42" rx="4" fill="#10B981" opacity="0.2" />

        {/* Status badge */}
        <rect x="385" y="10" width="150" height="26" rx="13" fill="#10B981" opacity="0.1" />
        <circle cx="405" cy="23" r="3" fill="#10B981" opacity="0.6" />
        <text x="465" y="28" textAnchor="middle" fill="#10B981" fontSize="11" fontWeight="600" style={{ fontFamily: "system-ui, sans-serif" }}>
          Optimiert: 85%
        </text>

        {/* Fill label */}
        <text x="460" y="264" textAnchor="middle" fill="#10B981" fontSize="13" fontWeight="700" opacity="0.9" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          Nach Bin Level: 85%
        </text>
      </g>
    </svg>
  );
}
