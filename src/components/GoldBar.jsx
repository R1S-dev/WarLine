import { Coins, Gem } from "lucide-react";

export default function GoldBar({ amount, side, goldAnim = false }) {
  // side: "bottom" (player) ili "top" (enemy)
  // Coins za tebe, Gem za protivnika, cyber boje
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1 rounded-xl shadow
        ${side === "bottom" ? "bg-gradient-to-r from-blue-900/80 to-blue-600/50" : "bg-gradient-to-r from-fuchsia-900/80 to-pink-700/50"}
      `}
      style={{
        minWidth: 54,
        border: side === "bottom"
          ? "2px solid #38bdf8aa"
          : "2px solid #e879f9cc",
        boxShadow: side === "bottom"
          ? "0 0 14px 1px #38bdf822"
          : "0 0 14px 1px #e879f922",
      }}
    >
      {side === "bottom" ? (
        <Coins className="text-blue-300 drop-shadow" size={21} />
      ) : (
        <Gem className="text-fuchsia-300 drop-shadow" size={21} />
      )}
      <span className={`font-bold text-lg tracking-wide ${side === "bottom" ? "text-cyan-100" : "text-pink-100"} transition-transform duration-150 ${goldAnim && side === "bottom" ? "animate-gold-bounce" : ""}`}>
        {amount}
      </span>
      <style>
        {`
          @keyframes gold-bounce {
            0% { transform: scale(1);}
            40% { transform: scale(1.20);}
            100% { transform: scale(1);}
          }
          .animate-gold-bounce {
            animation: gold-bounce 0.23s cubic-bezier(.7,1.5,.5,1.1) 1;
          }
        `}
      </style>
    </div>
  );
}