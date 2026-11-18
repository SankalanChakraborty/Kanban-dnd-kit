export default function KanbanSpinner({
  size = "md",
  label = "Loading...",
  showLabel = false,
  className = "",
}) {
  const sizeMap = {
    sm: { container: "w-5 h-5", border: "border-2", dot: "w-1 h-1" },
    md: { container: "w-8 h-8", border: "border-2", dot: "w-1.5 h-1.5" },
    lg: { container: "w-12 h-12", border: "border-3", dot: "w-2 h-2" },
  }[size] || { container: "w-8 h-8", border: "border-2", dot: "w-1.5 h-1.5" };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`inline-flex items-center gap-3 ${className}`}
    >
      <div
        className={`relative flex items-center justify-center ${sizeMap.container}`}
      >
        {/* Ambient background glow */}
        <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-sm animate-pulse" />

        {/* Static muted track */}
        <div
          className={`absolute inset-0 rounded-full ${sizeMap.border} border-slate-800`}
        />

        {/* Rotating active indigo gradient ring */}
        <div
          className={`absolute inset-0 rounded-full ${sizeMap.border} border-transparent border-t-indigo-500 border-r-indigo-400 animate-spin`}
        />

        {/* Inner static glow dot */}
        <div
          className={`rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)] ${sizeMap.dot}`}
        />
      </div>

      {showLabel && (
        <span className="text-xs font-medium tracking-wide text-slate-400 animate-pulse">
          {label}
        </span>
      )}

      <span className="sr-only">{label}</span>
    </div>
  );
}
