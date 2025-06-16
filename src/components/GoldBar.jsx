import { Coins } from "lucide-react";

export default function GoldBar({ amount, side, goldAnim = false, style = {} }) {
  // Ikonica i stil kao u main menu, prilagođeno za phone & lane
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1 rounded-xl shadow main-btn futur-btn-bg-main futur-btn-border ${
        side === "bottom" ? "goldbar-player" : "goldbar-enemy"
      }`}
      style={{
        minWidth: 54,
        position: "absolute",
        left: 14,
        ...(side === "top"
          ? { top: 30 }
          : { bottom: 32 }),
        zIndex: 40,
        ...style,
        boxShadow: side === "bottom"
          ? "0 0 14px 1px #38bdf822"
          : "0 0 14px 1px #e879f922",
        border: side === "bottom"
          ? "2px solid #38bdf8aa"
          : "2px solid #e879f9cc",
        background: "none"
      }}
    >
      <Coins
        className={`icon-anim mr-1`}
        size={21}
        strokeWidth={2.2}
        style={{
          color: side === "bottom" ? "#a0e8fa" : "#e879f9",
          filter: side === "bottom"
            ? "drop-shadow(0 0 5px #67e8f9a0)"
            : "drop-shadow(0 0 7px #e879f999)"
        }}
      />
      <span className={`font-bold text-lg tracking-wide ${
        side === "bottom" ? "text-cyan-100" : "text-pink-100"
      } transition-transform duration-150 ${
        goldAnim && side === "bottom" ? "animate-gold-bounce" : ""
      }`}>
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
          .main-btn {
            background: none !important;
            border-radius: 1.1rem;
            font-size: 1.08rem;
            box-shadow: none;
            border-width: 2.2px;
            border-style: solid;
            font-weight: 700;
            letter-spacing: 0.04em;
            user-select: none;
            outline: none;
          }
          .futur-btn-bg-main {
            background: linear-gradient(120deg, #182132 0%, #20405c 25%, #1c9eb5 54%, #22374e 75%, #131b28 100%);
            background-size: 220% 220%;
            animation: btn-gradient-move-main 13s cubic-bezier(.4,0,.4,1) infinite;
          }
          .futur-btn-border {
            border-color: #254963;
            box-shadow: 0 0 0 1px #13304744;
          }
          @keyframes btn-gradient-move-main {
            0% {background-position: 0% 60%;}
            50% {background-position: 100% 40%;}
            100% {background-position: 0% 60%;}
          }
          .icon-anim {
            animation: icon-futur-anim 5.7s infinite cubic-bezier(.37,.17,.45,.86);
            will-change: filter, transform;
          }
          @keyframes icon-futur-anim {
            0% { filter: brightness(1) drop-shadow(0 0 0px #00ffe2); transform: translateY(0);}
            60% { filter: brightness(1.12) drop-shadow(0 0 4px #00ffe2); transform: translateY(-1.5px);}
            100% { filter: brightness(1) drop-shadow(0 0 0px #00ffe2); transform: translateY(0);}
          }
          @media (max-width: 640px) {
            .main-btn {
              font-size: 1.01rem;
              padding: 0.74rem 0.28rem;
              border-radius: 0.79rem;
            }
          }
        `}
      </style>
    </div>
  );
}