import React from "react";

// Modern/futuristic vertical HP bar for units, left for player, right for enemy
export default function UnitHpBar({ hp, maxHp, side }) {
  // Calculate percentage for fill
  const percent = Math.max(0, Math.min(100, maxHp ? (hp / maxHp) * 100 : 100));
  // Choose color and glow based on current HP
  let gradient, glow;
  if (percent > 60) {
    gradient = "linear-gradient(0deg, #3bffef 0%, #39c0ff 80%, #5a6bff 100%)";
    glow = "0 0 10px #39c0ffbb, 0 0 3px #3bffef";
  } else if (percent > 30) {
    gradient = "linear-gradient(0deg, #fff34e 0%, #ffc947 70%, #ff8e42 100%)";
    glow = "0 0 12px #ffc947bb, 0 0 3px #fff34e";
  } else {
    gradient = "linear-gradient(0deg, #ff5757 0%, #ff2d55 80%, #ffeb3b 100%)";
    glow = "0 0 15px #ff5757bb, 0 0 3px #ff2d55";
  }

  // Height of the bar for visual design
  const BAR_HEIGHT = 56;
  const BAR_WIDTH = 9;

  // Which side to render: left for player (bottom), right for enemy (top)
  const alignStyle =
    side === "bottom"
      ? { left: -16, right: "auto" }
      : { right: -16, left: "auto" };

  return (
    <div
      className="absolute flex items-end"
      style={{
        ...alignStyle,
        top: 0,
        height: BAR_HEIGHT,
        width: BAR_WIDTH,
        zIndex: 10,
      }}
    >
      <div
        className="relative"
        style={{
          width: BAR_WIDTH,
          height: BAR_HEIGHT,
          borderRadius: 5,
          background: "rgba(13,22,32,0.92)",
          border: "2px solid #23293b",
          boxShadow: "0 2px 8px #001a",
        }}
      >
        {/* HP bar fill */}
        <div
          className="absolute left-0 bottom-0 w-full transition-all"
          style={{
            height: `${percent}%`,
            borderRadius: 5,
            background: gradient,
            boxShadow: glow,
            transition: "height 0.23s cubic-bezier(.6,1.7,.3,1.1)",
          }}
        />
        {/* Futuristic border accent */}
        <svg
          className="absolute left-0 top-0 pointer-events-none"
          width={BAR_WIDTH}
          height={BAR_HEIGHT}
          style={{
            filter: "drop-shadow(0 0 3px #39c0ff99)",
          }}
        >
          <rect
            x="1"
            y="1"
            width={BAR_WIDTH - 2}
            height={BAR_HEIGHT - 2}
            rx="3"
            fill="none"
            stroke="#39c0ff"
            strokeWidth="1.2"
            opacity={0.18}
          />
        </svg>
        {/* End pixel/cap for cyber look */}
        {percent > 0 && (
          <div
            className="absolute left-0 w-full"
            style={{
              bottom: `calc(${percent}% - 4px)`,
              height: 7,
              background:
                percent > 30
                  ? "linear-gradient(90deg, #39c0ff 0%, #f8fafc 90%)"
                  : "#ff5757",
              borderRadius: 3.5,
              filter:
                percent > 30
                  ? "drop-shadow(0 0 7px #39c0ffcc)"
                  : "drop-shadow(0 0 7px #ff5757cc)",
              transition: "bottom 0.21s cubic-bezier(.7,1.7,.3,1.07)",
            }}
          />
        )}
      </div>
    </div>
  );
}