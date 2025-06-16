import { useEffect, useRef, useState } from "react";
import UnitsLayer from "./UnitsLayer";
import BaseWithHp from "./BaseWithHp";
import SideHpBar from "./SideHpBar";
import LaneBackground from "./LaneBackground";
import GoldBar from "./GoldBar";
import { Sparkles } from "lucide-react";

const BOARD_HEIGHT = 560;
const BOARD_PADDING = 26;
const UNIT_SIZE = 32;
const BASE_MARGIN = 26; // povećano zbog paddinga na fonu/gore
const ATTACK_DAMAGE = 25;
const MOVE_SPEED = 53;

const UNITS_BASE_HP = {
  infantry: 50,
  archer: 40,
  tank: 100,
};

export default function GameBoard({
  units,
  onGameOver,
  onUnitRemove,
  onUnitsUpdate,
  playerGold = 0,
  enemyGold = 0,
  playerGoldAnim = false,
  enemyGoldAnim = false,
}) {
  const [topHp, setTopHp] = useState(100);
  const [bottomHp, setBottomHp] = useState(100);
  const [baseHit, setBaseHit] = useState(null);
  const [baseHitAnim, setBaseHitAnim] = useState(null);
  const intervalRef = useRef();
  const laneRef = useRef(null);
  const [laneWidth, setLaneWidth] = useState(320);

  // Responsive lane width
  useEffect(() => {
    function updateWidth() {
      if (laneRef.current) setLaneWidth(laneRef.current.offsetWidth);
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Units movement, collision and fighting logic
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (units.length === 0) return;

    intervalRef.current = setInterval(() => {
      let updatedUnits = [...units];
      let step = MOVE_SPEED * 0.05;
      updatedUnits.forEach((u) => (u.fighting = false));
      updatedUnits.sort((a, b) => a.y - b.y);

      for (let i = 0; i < updatedUnits.length; i++) {
        const u = updatedUnits[i];
        let blocked = false;

        if (u.side === "bottom") {
          for (let j = 0; j < updatedUnits.length; j++) {
            if (i === j) continue;
            const other = updatedUnits[j];
            if (
              other.y < u.y &&
              Math.abs(u.y - other.y) < UNIT_SIZE
            ) {
              blocked = true;
              break;
            }
          }
          if (!blocked && u.y > BASE_MARGIN) {
            updatedUnits[i].y = Math.max(BASE_MARGIN, u.y - step);
          }
        }
        if (u.side === "top") {
          for (let j = 0; j < updatedUnits.length; j++) {
            if (i === j) continue;
            const other = updatedUnits[j];
            if (
              other.y > u.y &&
              Math.abs(u.y - other.y) < UNIT_SIZE
            ) {
              blocked = true;
              break;
            }
          }
          if (
            !blocked &&
            u.y < BOARD_HEIGHT - UNIT_SIZE - BASE_MARGIN
          ) {
            updatedUnits[i].y = Math.min(
              BOARD_HEIGHT - UNIT_SIZE - BASE_MARGIN,
              u.y + step
            );
          }
        }
      }

      // Fight logic: mark as fighting if in range
      let fightingPairs = [];
      let idsToRemove = new Set();
      for (let i = 0; i < updatedUnits.length; i++) {
        for (let j = i + 1; j < updatedUnits.length; j++) {
          const u1 = updatedUnits[i], u2 = updatedUnits[j];
          if (u1.side !== u2.side && Math.abs(u1.y - u2.y) < UNIT_SIZE) {
            fightingPairs.push([i, j]);
            updatedUnits[i].fighting = true;
            updatedUnits[j].fighting = true;
          }
        }
      }
      if (fightingPairs.length > 0) {
        fightingPairs.forEach(([i, j]) => {
          updatedUnits[i].hp -= ATTACK_DAMAGE * 0.2;
          updatedUnits[j].hp -= ATTACK_DAMAGE * 0.2;
          if (updatedUnits[i].hp <= 0) idsToRemove.add(updatedUnits[i].id);
          if (updatedUnits[j].hp <= 0) idsToRemove.add(updatedUnits[j].id);
        });
      }
      if (idsToRemove.size > 0) {
        updatedUnits = updatedUnits.filter((u) => !idsToRemove.has(u.id));
      }

      // Base hit + instant removal + dramatic animation
      let baseHitEvent = null;
      let baseHitUnitId = null;
      updatedUnits.forEach((u) => {
        if (u.side === "bottom" && u.y <= BASE_MARGIN) {
          baseHitEvent = { side: "top", y: u.y, type: u.type };
          baseHitUnitId = u.id;
        }
        if (
          u.side === "top" &&
          u.y >= BOARD_HEIGHT - UNIT_SIZE - BASE_MARGIN
        ) {
          baseHitEvent = { side: "bottom", y: u.y, type: u.type };
          baseHitUnitId = u.id;
        }
      });
      if (baseHitEvent && baseHitUnitId) {
        setBaseHit(baseHitEvent);
        setBaseHitAnim({ ...baseHitEvent, id: baseHitUnitId });
        setTimeout(() => setBaseHit(null), 380);
        setTimeout(() => setBaseHitAnim(null), 500);

        // Skini bazi 20 healtha odmah
        if (baseHitEvent.side === "top") {
          setTopHp((hp) => {
            const nhp = Math.max(0, hp - 20);
            if (nhp === 0) onGameOver("player");
            return nhp;
          });
        } else {
          setBottomHp((hp) => {
            const nhp = Math.max(0, hp - 20);
            if (nhp === 0) onGameOver("enemy");
            return nhp;
          });
        }
        // Skloni unit odmah
        onUnitRemove(baseHitUnitId);
        updatedUnits = updatedUnits.filter((u) => u.id !== baseHitUnitId);
      }

      onUnitsUpdate(updatedUnits);
    }, 50);

    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line
  }, [units, onGameOver, onUnitRemove, onUnitsUpdate]);

  // --- mobile offset: pomeri celu tablu malo dole da gornja baza ne puca u vrh ---
  // i dodaće se padding gore za logo i vizuelni razmak
  return (
    <div
      className="relative w-full max-w-md mx-auto flex flex-col items-stretch z-10"
      style={{
        minHeight: 340,
        height: BOARD_HEIGHT + 2 * (BASE_MARGIN + BOARD_PADDING),
        padding: 0,
        paddingTop: 54, // za logo i razmak na fonu
      }}
    >
      {/* Futuristic background (kao u main menu) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse at 50% 60%, #151d2a 0%, #070d17 100%)",
        }}
      />

      {/* Mali WarLine logo gore desno */}
      <div
        className="absolute top-3 right-6 z-50 flex items-center gap-1 px-2 py-1 rounded-full warline-logo-mini"
        style={{
          background: "rgba(10,24,60,0.85)",
          boxShadow: "0 2px 12px #00eaff33",
          border: "1.7px solid #24eaff33",
          fontFamily: "'Orbitron','Montserrat',Arial,sans-serif",
          fontWeight: 900,
          letterSpacing: "0.12em",
          color: "#b8eaff",
          fontSize: 17,
          textShadow: "0 0 6px #22eaff44, 0 0 8px #012e3a44",
          userSelect: "none"
        }}
      >
        <Sparkles className="w-5 h-5 text-cyan-300 drop-shadow" style={{marginRight:4,marginTop:-2}} />
        <span>WarLine</span>
      </div>

      {/* GOLD barovi */}
      <GoldBar amount={enemyGold} side="top" goldAnim={enemyGoldAnim} style={{ top: 30 }} />
      <GoldBar amount={playerGold} side="bottom" goldAnim={playerGoldAnim} style={{ bottom: 32 }} />

      <div
        ref={laneRef}
        className="relative flex-1 overflow-visible lane-anim-bg-futur"
        style={{
          height: BOARD_HEIGHT,
          margin: "0 10px",
        }}
      >
        <LaneBackground />

        {/* Dramatic base explosion/impact */}
        {baseHitAnim && (
          <BaseExplosion
            side={baseHitAnim.side}
            laneWidth={laneWidth}
            type={baseHitAnim.type}
          />
        )}
        {/* Baze */}
        <div
          className={`absolute left-1/2 z-20 transition-transform duration-200 ${
            baseHit?.side === "top" ? "scale-[1.13] animate-base-hit" : ""
          }`}
          style={{
            top: 11, // pomereno dole zbog paddinga
            transform: "translate(-50%,-36%)",
            pointerEvents: "none",
            filter: baseHit?.side === "top" ? "drop-shadow(0 0 34px #fff8)" : undefined,
          }}
        >
          <BaseWithHp side="top" hp={topHp} />
        </div>
        <div
          className={`absolute left-1/2 z-20 transition-transform duration-200 ${
            baseHit?.side === "bottom" ? "scale-[1.13] animate-base-hit" : ""
          }`}
          style={{
            bottom: 11,
            transform: "translate(-50%,36%)",
            pointerEvents: "none",
            filter: baseHit?.side === "bottom" ? "drop-shadow(0 0 34px #fff8)" : undefined,
          }}
        >
          <BaseWithHp side="bottom" hp={bottomHp} />
        </div>
        {/* HP barovi */}
        <SideHpBar hp={topHp} side="top" />
        <SideHpBar hp={bottomHp} side="bottom" />
        {/* Jedinice */}
        <UnitsLayer
          units={units}
          laneWidth={laneWidth}
          baseHit={baseHit}
          unitsBaseHp={UNITS_BASE_HP}
        />
        <style>
          {`
          @keyframes base-hit {
            0% { filter: brightness(1.3) drop-shadow(0 0 34px #fff9);}
            40% { filter: brightness(1.9) drop-shadow(0 0 60px #ffeede); }
            100% { filter: brightness(1.0) drop-shadow(0 0 0px #fff0);}
          }
          .animate-base-hit {
            animation: base-hit 0.36s cubic-bezier(.6,2,.2,1.1) 1;
          }
          .lane-anim-bg-futur::before {
            content: "";
            position: absolute;
            inset: 0;
            z-index: 0;
            background: linear-gradient(120deg, #182132 0%, #20405c 25%, #1c9eb5 54%, #22374e 75%, #131b28 100%);
            opacity: 0.95;
            pointer-events: none;
            border-radius: 1.46rem;
            box-shadow: 0 4px 38px #1b8edc33, 0 2px 8px #081a2c;
            animation: lane-futur-bg-move 22s cubic-bezier(.6,0,.4,1) infinite alternate;
          }
          @media (max-width: 650px) {
            .lane-anim-bg-futur::before {
              border-radius: 0.79rem;
              box-shadow: 0 2px 16px #1377c822, 0 1px 2px #0a1a2c;
            }
          }
          @keyframes lane-futur-bg-move {
            0% { background-position: 0% 60%; }
            100% { background-position: 100% 40%; }
          }
          `}
        </style>
      </div>
    </div>
  );
}

// Dramatic explosion/impact on base hit
function BaseExplosion({ side, laneWidth, type }) {
  const color =
    side === "top"
      ? (type === "tank" ? "#aee7fc" : "#d18cf7")
      : (type === "tank" ? "#7eb7ff" : "#3bd1f7");
  return (
    <div
      className="pointer-events-none absolute left-1/2 z-50"
      style={{
        top: side === "top" ? 27 : undefined,
        bottom: side === "bottom" ? 27 : undefined,
        transform: "translate(-50%,0)",
      }}
    >
      <span className="absolute left-1/2 top-1/2 z-40"
        style={{
          width: 88,
          height: 88,
          transform: "translate(-50%,-50%)",
          pointerEvents: "none",
        }}
      >
        <svg width={88} height={88}>
          <circle
            cx={44}
            cy={44}
            r={34}
            fill={color}
            fillOpacity="0.22"
            className="explosion-anim"
            style={{
              filter: `blur(13px) drop-shadow(0 0 32px ${color})`,
            }}
          />
          <circle
            cx={44}
            cy={44}
            r={17}
            fill="white"
            fillOpacity="0.37"
            className="explosion-anim"
            style={{
              filter: "blur(3.5px)",
            }}
          />
        </svg>
      </span>
      <span className="absolute left-1/2 top-1/2"
        style={{
          width: 44,
          height: 44,
          transform: "translate(-50%,-50%)",
          pointerEvents: "none",
        }}
      >
        <svg width={44} height={44}>
          <circle
            cx={22}
            cy={22}
            r={16}
            fill={color}
            fillOpacity="0.54"
            className="explosion-anim"
            style={{
              filter: "blur(5px)",
            }}
          />
        </svg>
      </span>
      <style>
        {`
        .explosion-anim {
          animation: explosion-grow-fade 0.44s cubic-bezier(.6,1.7,.4,1.01) 1;
        }
        @keyframes explosion-grow-fade {
          0% { opacity: 1; transform: scale(0.15);}
          50% { opacity: 0.78; transform: scale(1.08);}
          80% { opacity: 0.6; }
          100% { opacity: 0; transform: scale(1.7);}
        }
        `}
      </style>
    </div>
  );
}