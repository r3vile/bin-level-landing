export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="28" height="28" rx="4" fill="#F59E0B" />
        <rect x="6" y="10" width="16" height="3" rx="1" fill="#0B1221" />
        <rect x="6" y="15" width="16" height="3" rx="1" fill="#0B1221" opacity="0.6" />
        <rect x="6" y="20" width="16" height="3" rx="1" fill="#0B1221" opacity="0.3" />
      </svg>
      <span className="text-xl font-bold text-white tracking-tight">
        Bin Level
      </span>
    </div>
  );
}
