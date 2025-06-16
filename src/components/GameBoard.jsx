import { useEffect, useRef, useState } from "react";
import UnitsLayer from "./UnitsLayer";
import BaseWithHp from "./BaseWithHp";
import SideHpBar from "./SideHpBar";
import LaneBackground from "./LaneBackground";
import GoldBar from "./GoldBar";

const BOARD_PADDING = 18;
const UNIT_SIZE = 32;
const BASE_MARGIN = 34;

const BOARD_HEIGHT_RATIO = 0.61;

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
  const [laneWidth, setLaneWidth] = useState(360);
  const [timer, setTimer] = useState(0);
  const [boardHeight, setBoardHeight] = useState(440);

  // Responsive lane width & height (fullscreen board)
  useEffect(() => {
    function updateDimensions() {
      const vh = window.innerHeight;
      const usable = vh - 55 - 45 - 84 - 2 * BOARD_PADDING;
      const height = Math.max(300, usable);
      setBoardHeight(height);
      if (laneRef.current) setLaneWidth(laneRef.current.offsetWidth);
    }
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (units.length === 0) return;

    intervalRef.current = setInterval(() => {
      let updatedUnits = [...units];
      let step = 53 * 0.05 * 1.1; // 10% brže kretanje!
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
              Math.abs(other.y - u.y) < UNIT_SIZE
            ) {
              blocked = true;
              break;
            }
          }
          if (
            !blocked &&
            u.y < boardHeight - UNIT_SIZE - BASE_MARGIN
          ) {
            updatedUnits[i].y = Math.min(
              boardHeight - UNIT_SIZE - BASE_MARGIN,
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
          updatedUnits[i].hp -= 25 * 0.2;
          updatedUnits[j].hp -= 25 * 0.2;
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
          u.y >= boardHeight - UNIT_SIZE - BASE_MARGIN
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
  }, [units, onGameOver, onUnitRemove, onUnitsUpdate, boardHeight]);

  return (
    <div
      className="relative flex flex-col items-stretch z-10 futuristic-board-outer"
      style={{
        flex: 1,
        minHeight: 0,
        height: "100%",
        width: "100%",
        maxWidth: 600,
        margin: "0 auto",
        padding: 0,
        paddingTop: 55,
        paddingBottom: 0,
        boxSizing: "border-box",
        position: "relative",
        background: "none",
      }}
    >
      {/* Futuristički background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-0 board-bg-futur-anim"
      />

      {/* WarLine tekst levo gore */}
      <span
        className="absolute top-3 left-5 z-50"
        style={{
          fontFamily: "'Orbitron','Montserrat',Arial,sans-serif",
          fontWeight: 900,
          letterSpacing: "0.16em",
          color: "#00fff0",
          fontSize: "24.15px",
          textShadow: "0 2px 16px #00fff087, 0 1px 1px #222",
          userSelect: "none",
        }}
      >
        WarLine
      </span>

      {/* Tajmer desno gore */}
      <span
        className="absolute top-3 right-5 z-50"
        style={{
          fontFamily: "'Orbitron','Montserrat',Arial,sans-serif",
          color: "#b8eaff",
          fontSize: "16.8px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textShadow: "0 0 7px #02eaff66, 0 0 8px #012e3a33",
          userSelect: "none",
        }}
      >
        {Math.floor(timer/60)}:{(timer%60).toString().padStart(2, '0')}
      </span>

      {/* GOLD barovi: ENEMY LEVO GORE, PLAYER SKROZ DOLE LEVO */}
      <div className="absolute z-40" style={{top: 45, left: 8}}>
        <GoldBar amount={enemyGold} side="top" goldAnim={enemyGoldAnim} />
      </div>
      <div className="absolute z-40" style={{bottom: -15, left: 8}}>
        <GoldBar amount={playerGold} side="bottom" goldAnim={playerGoldAnim} />
      </div>

      <div
        ref={laneRef}
        className="relative flex-1 overflow-visible lane-anim-bg-futur"
        style={{
          height: boardHeight,
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
        {/* Baze - povećane, modernizovane */}
        <div
          className={`absolute left-1/2 z-20 transition-transform duration-200 ${
            baseHit?.side === "top" ? "scale-[1.13] animate-base-hit" : ""
          }`}
          style={{
            top: 18,
            transform: "translate(-50%,-36%)",
            pointerEvents: "none",
            filter: baseHit?.side === "top" ? "drop-shadow(0 0 44px #00fff088)" : undefined,
          }}
        >
          <BaseWithHp side="top" hp={topHp} size="lg" />
        </div>
        <div
          className={`absolute left-1/2 z-20 transition-transform duration-200 ${
            baseHit?.side === "bottom" ? "scale-[1.13] animate-base-hit" : ""
          }`}
          style={{
            bottom: 18,
            transform: "translate(-50%,36%)",
            pointerEvents: "none",
            filter: baseHit?.side === "bottom" ? "drop-shadow(0 0 44px #00fff088)" : undefined,
          }}
        >
          <BaseWithHp side="bottom" hp={bottomHp} size="lg" />
        </div>

        {/* HP barovi - veći i moderniji */}
        <SideHpBar hp={topHp} side="top" big />
        <SideHpBar hp={bottomHp} side="bottom" big />

        {/* Jedinice */}
        <UnitsLayer
          units={units}
          laneWidth={laneWidth}
          baseHit={baseHit}
          unitsBaseHp={UNITS_BASE_HP}
        />
        <style>
          {`
          .board-bg-futur-anim {
            position: absolute;
            inset: 0;
            z-index: 0;
            pointer-events: none;
            background:
              linear-gradient(135deg, #101629 40%, #0a1c35 100%),
              radial-gradient(ellipse at 60% 10%, #44e6f51e 0%, #0a1c3500 70%),
              radial-gradient(ellipse at 50% 100%, #3f63f61c 0%, #0a1c3500 65%),
              repeating-linear-gradient(120deg, #0ff2 0px, #00eaff09 1.5px, #0000 2.5px, #0000 16px);
            animation: space-breath 10s cubic-bezier(.6,0,.4,1) infinite alternate;
          }
          @keyframes space-breath {
            0% { filter: brightness(1) blur(0.5px); background-position: 0% 60%, 0 0, 0 0, 0 0;}
            60% { filter: brightness(1.04) blur(1px); background-position: 12% 54%, 0 8px, 0 -8px, 0 1px;}
            100% { filter: brightness(1.01) blur(0.6px); background-position: 0% 60%, 0 0, 0 0, 0 0;}
          }
          .lane-anim-bg-futur::before {
            content: "";
            position: absolute;
            inset: 0;
            z-index: 0;
            background: linear-gradient(120deg, #151a28 0%, #235985 35%, #1c9eb5 54%, #22374e 75%, #131b28 100%);
            opacity: 0.98;
            pointer-events: none;
            border-radius: 1.56rem;
            box-shadow: 0 4px 60px #1b8edc53, 0 2px 8px #081a2c;
            animation: lane-futur-bg-move 18s cubic-bezier(.6,0,.4,1) infinite alternate;
          }
          @media (max-width: 650px) {
            .lane-anim-bg-futur::before {
              border-radius: 0.89rem;
              box-shadow: 0 2px 26px #1377c822, 0 1px 2px #0a1a2c;
            }
          }
          @keyframes lane-futur-bg-move {
            0% { background-position: 0% 60%; }
            100% { background-position: 100% 40%; }
          }
          .futuristic-board-outer {
            box-shadow: 0 14px 70px #00eaff33, 0 2px 8px #001e33;
            border-radius: 2.35rem;
            background: none;
          }
          @keyframes base-hit {
            0% { filter: brightness(1.3) drop-shadow(0 0 54px #fff9);}
            40% { filter: brightness(2.1) drop-shadow(0 0 84px #ffeede); }
            100% { filter: brightness(1.0) drop-shadow(0 0 0px #fff0);}
          }
          .animate-base-hit {
            animation: base-hit 0.36s cubic-bezier(.6,2,.2,1.1) 1;
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
        top: side === "top" ? 32 : undefined,
        bottom: side === "bottom" ? 32 : undefined,
        transform: "translate(-50%,0)",
      }}
    >
      <span className="absolute left-1/2 top-1/2 z-40"
        style={{
          width: 98,
          height: 98,
          transform: "translate(-50%,-50%)",
          pointerEvents: "none",
        }}
      >
        <svg width={98} height={98}>
          <circle
            cx={49}
            cy={49}
            r={38}
            fill={color}
            fillOpacity="0.22"
            className="explosion-anim"
            style={{
              filter: `blur(15px) drop-shadow(0 0 38px ${color})`,
            }}
          />
          <circle
            cx={49}
            cy={49}
            r={20}
            fill="white"
            fillOpacity="0.37"
            className="explosion-anim"
            style={{
              filter: "blur(4px)",
            }}
          />
        </svg>
      </span>
      <span className="absolute left-1/2 top-1/2"
        style={{
          width: 54,
          height: 54,
          transform: "translate(-50%,-50%)",
          pointerEvents: "none",
        }}
      >
        <svg width={54} height={54}>
          <circle
            cx={27}
            cy={27}
            r={21}
            fill={color}
            fillOpacity="0.54"
            className="explosion-anim"
            style={{
              filter: "blur(6px)",
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
          0% { opacity: 1; transform: scale(0.17);}
          50% { opacity: 0.83; transform: scale(1.12);}
          80% { opacity: 0.6; }
          100% { opacity: 0; transform: scale(1.7);}
        }
        `}
      </style>
    </div>
  );
}