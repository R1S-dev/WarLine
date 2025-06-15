import React from "react";

export default function BaseWithHp({ side }) {
  const color = side === "bottom" ? "#3b82f6" : "#f472b6";
  const bgGrad =
    side === "bottom"
      ? "bg-gradient-to-br from-blue-100 to-blue-300"
      : "bg-gradient-to-br from-pink-100 to-pink-300";
  const shadow =
    side === "bottom"
      ? "shadow-[0_2px_12px_1px_rgba(59,130,246,0.08)]"
      : "shadow-[0_2px_12px_1px_rgba(244,114,182,0.10)]";

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <div
        className={`relative w-14 h-14 rounded-full border-2 ${bgGrad} flex items-center justify-center ${shadow}`}
        style={{
          borderColor: color,
          margin: "0 auto",
          transition: "box-shadow 0.3s, border-color 0.3s",
        }}
      >
        {/* Subtle soft shadow ring */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: `0 0 0 7px ${color}10, 0 8px 24px 0px #23263a33`,
            zIndex: 1,
          }}
        />
        {/* Base core */}
        <div className="w-8 h-8 rounded-full bg-white/80 shadow-inner border border-white/20" />
      </div>
    </div>
  );
}