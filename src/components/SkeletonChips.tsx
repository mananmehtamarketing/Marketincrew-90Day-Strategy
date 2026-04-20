export default function SkeletonChips() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2" style={{ color: "var(--color-muted)" }}>
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeLinecap="round" />
        </svg>
        <span className="text-sm">Personalizing questions for you...</span>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{ width: `${80 + Math.random() * 80}px`, height: "2.5rem" }}
          />
        ))}
      </div>
    </div>
  );
}
