import React from "react";

export default function ElegantGlowSpinner({
  size = "lg",
  text = "Processing request...",
  className = "",
}) {
  const sizeClasses =
    {
      sm: "w-12 h-12",
      md: "w-16 h-16",
      lg: "w-24 h-24",
      xl: "w-32 h-32",
    }[size] || "w-24 h-24";

  return (
    <div
      className={`flex flex-col items-center justify-center gap-6 ${className}`}
    >
      {/* Container holding the multidimensional orbital glow effects */}
      <div
        className={`relative flex items-center justify-center ${sizeClasses}`}
      >
        {/* 1. Deep Ambient Pulsing Glow Underlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/25 via-purple-500/10 to-pink-500/20 blur-xl animate-pulse" />

        {/* 2. Outer Rotating Orbital Particle Glow Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500/30 border-b-purple-500/10 border-l-pink-500/20 animate-[spin_4s_linear_infinite]" />

        {/* 3. Mid-layer Counter-rotating Solid Gradient Ring */}
        <div className="absolute inset-1 rounded-full border-2 border-transparent border-t-indigo-400 border-r-purple-500 animate-[spin_1.5s_linear_infinite]" />

        {/* 4. Fine innermost reverse speed-orbit with tracking dots */}
        <div className="absolute inset-3 rounded-full border border-dotted border-pink-400/40 animate-[spin_3s_linear_infinite_reverse]" />

        {/* 5. Pulsating core particle & satellite dots */}
        <div className="absolute inset-6 rounded-full bg-slate-950/80 border border-indigo-500/30 flex items-center justify-center shadow-[inset_0_0_12px_rgba(99,102,241,0.3)]">
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 animate-ping absolute opacity-75" />
          <div className="w-2 h-2 rounded-full bg-indigo-400 relative z-10 shadow-[0_0_8px_#818cf8]" />
        </div>

        {/* 6. Orbital Satellite dots (Faux Particles) */}
        <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_6px_#818cf8]" />
        <div className="absolute bottom-1 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-ping" />
      </div>

      {/* Futuristic Label Subtitle */}
      {text && (
        <span className="text-gray-300 font-medium tracking-wide text-sm sm:text-base animate-pulse">
          {text}
        </span>
      )}
    </div>
  );
}
