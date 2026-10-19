import { LogoutIcon } from "./LogoutIcon";

type LogoutButtonProps = {
  onLogout: () => void;
  showLabel?: boolean;
  label?: string;
  className?: string;
};

export default function LogoutButton({
  onLogout,
  showLabel = true,
  label = "Sign Out",
  className = "",
}: LogoutButtonProps) {
  return (
    <button
      type="button"
      onClick={onLogout}
      aria-label="Log out"
      className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 active:bg-rose-500/15 transition-all duration-200 cursor-pointer ${className}`}
    >
      {/* Animated icon with subtle exit nudge on hover */}
      <LogoutIcon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-rose-400 group-hover:translate-x-0.5 transition-all duration-200" />

      {/* Label */}
      {showLabel && (
        <span className="font-semibold tracking-wide transition-colors">
          {label}
        </span>
      )}

      {/* Optional Tooltip for Icon-only Mode */}
      {!showLabel && (
        <span className="pointer-events-none absolute left-full ml-2.5 px-2 py-1 rounded-md bg-slate-900 border border-slate-700/80 text-[11px] font-medium text-slate-200 shadow-xl opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap z-50">
          {label}
        </span>
      )}
    </button>
  );
}
