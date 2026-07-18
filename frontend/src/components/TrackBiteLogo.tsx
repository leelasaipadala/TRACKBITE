export default function TrackBiteLogo({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`text-emerald-500 dark:text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.35)] ${className}`}
    >
      {/* Circular target outline representing nutrition bounds */}
      <circle cx="50" cy="46" r="28" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.4" />
      <circle cx="50" cy="46" r="28" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
      
      {/* Curved swoop line illustrating tracking trends */}
      <path 
        d="M 22 52 Q 50 52 78 28" 
        stroke="currentColor" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        fill="none"
      />

      {/* Fork Handle Base */}
      <path 
        d="M 50 64 L 50 86 M 44 86 L 56 86" 
        stroke="currentColor" 
        strokeWidth="5" 
        strokeLinecap="round" 
        fill="none"
      />
      
      {/* Fork Prongs designed as nutrition bar charts */}
      {/* Prong/Bar 1 */}
      <rect x="36" y="34" width="5" height="24" rx="2.5" fill="currentColor" />
      {/* Prong/Bar 2 */}
      <rect x="45" y="26" width="5" height="32" rx="2.5" fill="currentColor" />
      {/* Prong/Bar 3 */}
      <rect x="54" y="20" width="5" height="38" rx="2.5" fill="currentColor" />
      {/* Prong/Bar 4 */}
      <rect x="63" y="14" width="5" height="44" rx="2.5" fill="currentColor" />
    </svg>
  );
}
