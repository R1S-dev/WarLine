export default function SideHpBar({ hp, side }) {
  // Modern/futuristic horizontal cyber HP bar, uz glow i lepše boje
  return (
    <div
      className="absolute z-30"
      style={{
        top: side === "top" ? 26 : undefined,
        bottom: side === "bottom" ? 26 : undefined,
        right: 16,
      }}
    >
      <div
        className="relative w-28 h-3.5 rounded-full overflow-hidden"
        style={{
          background: "linear-gradient(90deg, #1b233d 0%, #303a5a 100%)",
          border: "2px solid #1ee9ff33",
          boxShadow: "0 1px 12px #0ff2, 0 0px 1px #fff7",
        }}
      >
        <div
          className={`h-full transition-all duration-500 ease-out`}
          style={{
            background: side === "top"
              ? "linear-gradient(90deg,#f472b6 0%, #9f44ff 100%)"
              : "linear-gradient(90deg,#38bdf8 0%, #0efeff 100%)",
            width: `${Math.max(0, Math.min(100, hp))}%`,
            minWidth: 6,
            boxShadow: "0 0 12px 1px #00fff2cc",
            borderRadius: "0.75rem",
            filter: hp < 30 ? "brightness(1.07) saturate(1.08) blur(0.1px)" : undefined,
            opacity: hp < 15 ? 0.68 : 1,
            transition: "width 0.5s cubic-bezier(.78,1.6,.45,1), filter 0.2s"
          }}
        />
        <span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-extrabold tracking-wide"
          style={{
            color: "#eafcff",
            textShadow: "0 1.5px 6px #1ee9ffcc,0 1px 0px #182132,0 0 4px #fff8",
            letterSpacing: 0.5
          }}
        >
          {Math.max(0, Math.floor(hp))}%
        </span>
      </div>
    </div>
  );
}