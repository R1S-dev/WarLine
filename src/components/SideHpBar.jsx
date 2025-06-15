export default function SideHpBar({ hp, side }) {
  return (
    <div
      className="absolute z-30"
      style={{
        top: side === "top" ? 18 : undefined,
        bottom: side === "bottom" ? 18 : undefined,
        right: 22,
      }}
    >
      <div
        className="relative w-24 h-3.5 rounded-full overflow-hidden bg-[#23263a] border border-[#e5e7eb]"
        style={{
          boxShadow: "0 1px 6px #0001, 0 0px 1px #fff5",
        }}
      >
        <div
          className={`h-full transition-all duration-500 ease-out ${
            side === "top"
              ? "bg-gradient-to-r from-pink-400 to-pink-200"
              : "bg-gradient-to-r from-blue-400 to-blue-200"
          }`}
          style={{
            width: `${Math.max(0, Math.min(100, hp))}%`,
            minWidth: 6,
            boxShadow: "0 0 6px 1px #fff2",
            borderRadius:
              "0.5rem 0.5rem 0.5rem 0.5rem / 1rem 1rem 1rem 1rem",
          }}
        />
        <span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-semibold text-gray-800/70 select-none"
          style={{ letterSpacing: 0.2 }}
        >
          {Math.max(0, Math.floor(hp))}%
        </span>
      </div>
    </div>
  );
}