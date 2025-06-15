import { useState, useEffect } from "react";
import UnitHpBar from "./UnitHpBar";

const UNIT_SIZES = {
  infantry: 56,
  archer: 56,
  tank: 56,
};
const UNIT_MAX_HP = {
  infantry: 50,
  archer: 40,
  tank: 100,
};
const SHAPES = {
  infantry: (color) => (
    <svg width="56" height="56">
      <circle cx="28" cy="28" r="22" fill={color} stroke="#fff" strokeWidth="3" />
    </svg>
  ),
  archer: (color) => (
    <svg width="56" height="56">
      <polygon points="28,8 48,48 8,48" fill={color} stroke="#fff" strokeWidth="3" />
    </svg>
  ),
  tank: (color) => (
    <svg width="56" height="56">
      <rect x="10" y="10" width="36" height="36" rx="8" fill={color} stroke="#fff" strokeWidth="3" />
    </svg>
  ),
};
const COLORS = {
  bottom: "#3b82f6",
  top: "#f472b6",
};

export default function Unit({
  side,
  hp,
  type,
  y,
  spawnTime,
  laneWidth = 320,
  fighting,
  baseHit = false,
  unitsBaseHp,
}) {
  const UNIT_WIDTH = UNIT_SIZES[type] || 56;
  const left = (laneWidth - UNIT_WIDTH) / 2;
  const color = COLORS[side] || "#3b82f6";
  let maxHp = unitsBaseHp?.[type] || UNIT_MAX_HP[type] || 100;

  // Pop up animacija na spawn
  const [popAnim, setPopAnim] = useState(true);
  useEffect(() => {
    setPopAnim(true);
    const t = setTimeout(() => setPopAnim(false), 200);
    return () => clearTimeout(t);
  }, [spawnTime]);

  // Baza udarac (bump + nestajanje)
  const [baseAnim, setBaseAnim] = useState(false);
  useEffect(() => {
    if (baseHit) {
      setBaseAnim(true);
      const t = setTimeout(() => setBaseAnim(false), 600);
      return () => clearTimeout(t);
    }
  }, [baseHit]);

  return (
    <div
      style={{
        left,
        top: y,
        position: "absolute",
        zIndex: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: UNIT_WIDTH,
        transition: "top 0.1s linear, left 0.13s cubic-bezier(.6,1.8,.3,1)",
        pointerEvents: "none",
        opacity: baseAnim ? 0 : 1,
        filter: baseAnim
          ? "brightness(2.8) blur(2.3px) saturate(2.3)"
          : fighting
          ? "drop-shadow(0 0 38px #00f0ffcc) brightness(1.48) saturate(1.27)"
          : "none",
        transform: baseAnim
          ? "scale(2.2) rotate(-22deg) translateY(-120px)"
          : "",
      }}
      className={
        (popAnim ? "animate-unit-pop " : "") +
        (fighting ? "animate-futuristic-fight " : "") +
        (baseAnim ? "animate-unit-base-hit-future " : "")
      }
    >
      {/* MODERN CYBER VERTICAL HP BAR ON THE SIDE */}
      <UnitHpBar hp={hp} maxHp={maxHp} side={side} />

      {/* Big modern shape */}
      <div className="relative z-10">{SHAPES[type]?.(color)}</div>

      {baseAnim && (
        <>
          <span className="absolute left-1/2 top-1/2 z-50 pointer-events-none" style={{
            width: 180, height: 180, transform: "translate(-50%,-50%)"
          }}>
            <svg width={180} height={180}>
              {/* Shockwave ring */}
              <circle
                cx={90}
                cy={90}
                r={46}
                stroke="#38f9ff"
                strokeWidth="7"
                fill="none"
                className="unit-impact-shockwave"
                style={{ filter: "blur(0.5px)" }}
              />
              {/* Glow */}
              <circle
                cx={90}
                cy={90}
                r={34}
                fill="#00f0ff"
                fillOpacity="0.17"
                className="unit-impact-flash-future"
                style={{
                  filter: `blur(28px) drop-shadow(0 0 80px #00f0ff)`,
                }}
              />
              {/* Neon starburst */}
              {Array.from({ length: 16 }).map((_, i) => (
                <line
                  key={i}
                  x1={90}
                  y1={90}
                  x2={90 + 74 * Math.cos((i * Math.PI * 2) / 16)}
                  y2={90 + 74 * Math.sin((i * Math.PI * 2) / 16)}
                  stroke="#f0faff"
                  strokeWidth="5"
                  className="unit-impact-star-future"
                  style={{
                    opacity: 0.9
                  }}
                />
              ))}
            </svg>
          </span>
          {/* Futuristic grid flash */}
          <span className="absolute left-1/2 top-1/2 z-40 pointer-events-none" style={{
            width: 108, height: 108, transform: "translate(-50%,-50%)"
          }}>
            <svg width={108} height={108}>
              <rect x={6} y={6} width={96} height={96} rx={22}
                stroke="#7df9ff"
                strokeWidth={6}
                fill="none"
                className="unit-impact-grid-future"
                style={{ opacity: 0.75, filter: "blur(1.2px)" }}
              />
            </svg>
          </span>
        </>
      )}
      <style>
        {`
          @keyframes unit-pop {
            0% { transform: scale(0.6) translateY(40px);}
            80% { transform: scale(1.13) translateY(-6px);}
            100% { transform: scale(1) translateY(0);}
          }
          .animate-unit-pop { animation: unit-pop 0.19s cubic-bezier(.3,1.6,.5,1) 1; }

          @keyframes futuristic-fight {
            0%   { transform: scale(1) rotate(0deg); filter: brightness(1.11) drop-shadow(0 0 30px #00f0ffcc) saturate(1.11);}
            15%  { transform: scale(1.13,0.92) rotate(-13deg);}
            32%  { transform: scale(0.98,1.15) rotate(10deg);}
            48%  { transform: scale(1.16,0.92) rotate(-11deg);}
            67%  { transform: scale(0.97,1.14) rotate(14deg);}
            85%  { transform: scale(1.08,1.01) rotate(-11deg);}
            100% { transform: scale(1) rotate(0deg); filter: brightness(1.11) drop-shadow(0 0 30px #00f0ffcc) saturate(1.11);}
          }
          .animate-futuristic-fight {
            animation: futuristic-fight 0.37s cubic-bezier(.45,1.7,.33,1.1) infinite;
            box-shadow: 0 0 0 0 #00f0ff33,0 0 36px #7df9ff44;
            background: transparent;
          }

          @keyframes unit-base-hit-future {
            0% {
              opacity: 1;
              filter: brightness(2.6) blur(1.8px) saturate(2.7);
              transform: scale(1) rotate(-2deg) translateY(0);
            }
            13% {
              opacity: 1;
              filter: brightness(3.0) blur(1.5px) saturate(2.2);
              transform: scale(1.32) rotate(-19deg) translateY(-12px);
            }
            38% {
              opacity: 0.95;
              filter: brightness(2.7) blur(3px) saturate(1.8);
              transform: scale(2.3) rotate(-29deg) translateY(-70px);
            }
            56% {
              opacity: 0.6;
              filter: brightness(2.2) blur(10px) saturate(3.6);
              transform: scale(2.9) rotate(-38deg) translateY(-140px);
            }
            100% {
              opacity: 0;
              filter: brightness(2.7) blur(34px) saturate(4.2);
              transform: scale(3.8) rotate(-57deg) translateY(-220px);
            }
          }
          .animate-unit-base-hit-future {
            animation: unit-base-hit-future 0.69s cubic-bezier(.4,1.6,.6,1.08) 1;
          }

          .unit-impact-shockwave {
            animation: shockwave-circle 0.51s cubic-bezier(.57,2,.25,1.1) 1;
          }
          @keyframes shockwave-circle {
            0% { opacity: 0.7; stroke-width: 11; r: 12; }
            30% { opacity: 1; stroke-width: 7; r: 54; }
            60% { opacity: 0.7; stroke-width: 6.5; r: 70; }
            100% { opacity: 0; stroke-width: 2.5; r: 88; }
          }
          .unit-impact-flash-future {
            animation: impact-flash-future 0.55s cubic-bezier(.34,1.18,.7,1.02) 1;
          }
          @keyframes impact-flash-future {
            0% { opacity: 1; }
            60% { opacity: 0.85; }
            85% { opacity: 0.44; }
            100% { opacity: 0; }
          }
          .unit-impact-star-future {
            animation: impact-starburst-future 0.47s cubic-bezier(.71,2,.5,1.1) 1;
          }
          @keyframes impact-starburst-future {
            0% { stroke-width: 5; opacity: 0.9; }
            24% { stroke-width: 8.2; opacity: 1; }
            85% { stroke-width: 1.5; opacity: 0.17; }
            100% { stroke-width: 0.4; opacity: 0; }
          }
          .unit-impact-grid-future {
            animation: impact-grid-future 0.53s cubic-bezier(.5,1.7,.33,1.03) 1;
          }
          @keyframes impact-grid-future {
            0% { opacity: 0.75; stroke-width: 6; }
            25% { opacity: 1; stroke-width: 3.2; }
            60% { opacity: 0.48; stroke-width: 2.1; }
            100% { opacity: 0; stroke-width: 0.8; }
          }
        `}
      </style>
    </div>
  );
}