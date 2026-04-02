export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
        <rect width="28" height="28" rx="7" fill="url(#logo-grad)" />
        <rect x="6" y="10" width="16" height="2.5" rx="1.25" fill="#0B1221" />
        <rect x="6" y="14.5" width="16" height="2.5" rx="1.25" fill="#0B1221" opacity="0.5" />
        <rect x="6" y="19" width="16" height="2.5" rx="1.25" fill="#0B1221" opacity="0.25" />
      </svg>
      <span className="text-lg font-bold text-white tracking-tight">
        Bin Level
      </span>
    </div>
  );
}
