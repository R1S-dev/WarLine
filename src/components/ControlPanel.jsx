import { Shield, Crosshair, Truck, CircleDollarSign } from "lucide-react";

// Ikone
const UNIT_ICONS = {
  infantry: <Shield size={28} strokeWidth={2.2} className="text-blue-400 icon-anim" />,
  archer: <Crosshair size={28} strokeWidth={2.2} className="text-emerald-400 icon-anim" />,
  tank: <Truck size={28} strokeWidth={2.2} className="text-gray-500 icon-anim" />,
};

const units = [
  { cost: 30, type: "infantry", hp: 100 },
  { cost: 50, type: "archer", hp: 80 },
  { cost: 100, type: "tank", hp: 200 },
];

export default function ControlPanel({ gold, onSpawn }) {
  return (
    <div className="flex justify-between px-1 py-2 w-full max-w-md bg-[#181A1F] rounded-xl shadow border border-[#191d23] mt-2 gap-2 z-10">
      {units.map((unit, idx) => (
        <button
          key={unit.type}
          onClick={() => gold >= unit.cost && onSpawn(unit)}
          disabled={gold < unit.cost}
          className={[
            "main-btn",
            "futur-btn-bg-main",
            "futur-btn-border",
            "flex-1 flex flex-col items-center justify-center px-1.5 py-2 rounded-xl outline-none border",
            "transition-all duration-150 font-bold relative overflow-hidden",
            "unit-send-btn",
            gold >= unit.cost
              ? "hover:scale-105"
              : "opacity-60 cursor-not-allowed pointer-events-none",
          ].join(" ")}
          style={{
            fontFamily: "'Orbitron','Montserrat',Arial,sans-serif",
            minWidth: 0,
            fontSize: 17,
            zIndex: 1,
          }}
        >
          {/* Animated BG like menu */}
          <span className="btn-bg-anim" aria-hidden="true"></span>
          <span className="btn-inner-anim flex flex-col items-center z-10">
            {/* Ikonica jedinice */}
            <span className="mb-1">{UNIT_ICONS[unit.type]}</span>
            {/* Cena: coin ikonica + broj */}
            <span className="flex items-center gap-1">
              <CircleDollarSign size={17} strokeWidth={2.2} className="text-yellow-400 icon-anim" />
              <span className="font-bold text-yellow-300 text-base">{unit.cost}</span>
            </span>
          </span>
        </button>
      ))}
      <style>{`
        /* Futuristic animated button bg (as in main menu) */
        .main-btn {
          border-radius: 1.15rem;
          font-size: 1.05rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          position: relative;
          z-index: 1;
          overflow: hidden;
          border-width: 2.2px;
          border-style: solid;
          background-clip: padding-box;
          cursor: pointer;
          outline: none;
          user-select: none;
        }
        .main-btn:active {
          filter: brightness(1.03) saturate(1.04);
          box-shadow: 0 0 0 0 transparent, 0 0 4px #67e8f950;
          transform: scale(0.985);
        }
        .main-btn:focus-visible {
          box-shadow: 0 0 0 2px #38bdf825;
        }
        .main-btn[disabled] {
          filter: grayscale(0.5) opacity(0.56);
          cursor: not-allowed;
          pointer-events: none;
          background-image: none !important;
        }
        .futur-btn-bg-main .btn-bg-anim {
          background: linear-gradient(
            120deg,
            #171C25 0%,
            #1c2739 25%,
            #117a8d 54%,
            #1a2638 75%,
            #12151d 100%
          );
          background-size: 220% 220%;
        }
        .futur-btn-border {
          border-color: #233141;
          box-shadow: 0 0 0 1px #131e3044;
        }
        .btn-bg-anim {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          z-index: 0;
          pointer-events: none;
          opacity: 1;
          will-change: background-position;
          animation: btn-gradient-move-main 13s cubic-bezier(.4,0,.4,1) infinite;
          animation-delay: var(--btn-anim-delay, 0ms);
        }
        @keyframes btn-gradient-move-main {
          0% {background-position: 0% 60%;}
          50% {background-position: 100% 40%;}
          100% {background-position: 0% 60%;}
        }
        .btn-inner-anim {
          position: relative;
          z-index: 1;
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
        .unit-send-btn:not([disabled]):hover .btn-bg-anim {
          filter: brightness(1.11) blur(0.5px);
        }
        /* Responsive font */
        @media (max-width: 640px) {
          .main-btn {
            font-size: 1.01rem;
            padding: 0.74rem 0.28rem;
            border-radius: 0.79rem;
          }
        }
      `}</style>
    </div>
  );
}