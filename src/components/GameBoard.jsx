import { useEffect, useRef, useState } from "react";
import UnitsLayer from "./UnitsLayer";
import BaseWithHp from "./BaseWithHp";
import SideHpBar from "./SideHpBar";
import LaneBackground from "./LaneBackground";

const BOARD_HEIGHT = 560;
const BOARD_PADDING = 26;
const UNIT_SIZE = 32;
const BASE_MARGIN = 16;
const ATTACK_DAMAGE = 25;
const MOVE_SPEED = 53;

// --- Smanjeni HP za jedinice ---
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
}) {
  const [topHp, setTopHp] = useState(100);
  const [bottomHp, setBottomHp] = useState(100);
  const [baseHit, setBaseHit] = useState(null); // {side: "top"|"bottom", y: number}
  const [baseHitAnim, setBaseHitAnim] = useState(null);
  const intervalRef = useRef();
  const laneRef = useRef(null);
  const [laneWidth, setLaneWidth] = useState(320);

  useEffect(() => {
    function updateWidth() {
      if (laneRef.current) setLaneWidth(laneRef.current.offsetWidth);
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (units.length === 0) return;

    intervalRef.current = setInterval(() => {
      let updatedUnits = [...units];
      let step = MOVE_SPEED * 0.05;

      // Reset all fighting flags
      updatedUnits.forEach((u) => (u.fighting = false));

      // === Collision for all units (not just same side) ===
      // Sort units by y (top to bottom)
      updatedUnits.sort((a, b) => a.y - b.y);

      // Move units with collision
      for (let i = 0; i < updatedUnits.length; i++) {
        const u = updatedUnits[i];

        // Find the next unit ahead in the moving direction (same lane)
        let blocked = false;

        // For bottom side, can't move if another unit is in front within collision distance
        if (u.side === "bottom") {
          for (let j = 0; j < updatedUnits.length; j++) {
            if (i === j) continue;
            const other = updatedUnits[j];
            if (
              other.y < u.y && // is ahead
              Math.abs(u.y - other.y) < UNIT_SIZE // within collision distance
            ) {
              blocked = true;
              break;
            }
          }
          if (!blocked && u.y > BASE_MARGIN) {
            updatedUnits[i].y = Math.max(BASE_MARGIN, u.y - step);
          }
        }
        // For top side, can't move if another unit is in front within collision distance
        if (u.side === "top") {
          for (let j = 0; j < updatedUnits.length; j++) {
            if (i === j) continue;
            const other = updatedUnits[j];
            if (
              other.y > u.y && // is ahead (down)
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
          const u1 = updatedUnits[i],
            u2 = updatedUnits[j];
          if (u1.side !== u2.side && Math.abs(u1.y - u2.y) < UNIT_SIZE) {
            fightingPairs.push([i, j]);
            updatedUnits[i].fighting = true;
            updatedUnits[j].fighting = true;
          }
        }
      }
      // --- Fight bar traje još duplo krace: ---
      // ATTACK_DAMAGE * 0.2 (umesto 0.1)
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
            if (nhp === 0) onGameOver("🎉 Pobeda IGRAČA!");
            return nhp;
          });
        } else {
          setBottomHp((hp) => {
            const nhp = Math.max(0, hp - 20);
            if (nhp === 0) onGameOver("❌ Poražen si!");
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

  return (
    <div
      className="relative w-full max-w-md mx-auto flex flex-col items-stretch z-10"
      style={{
        minHeight: 340,
        height: BOARD_HEIGHT + 2 * (BASE_MARGIN + BOARD_PADDING),
        padding: 0,
      }}
    >
      <div
        ref={laneRef}
        className="relative flex-1 overflow-visible"
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
            top: 0,
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
            bottom: 0,
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
          `}
        </style>
      </div>
    </div>
  );
}

// --- Dramatic explosion/impact on base hit ---
function BaseExplosion({ side, laneWidth, type }) {
  // Izaberi boju prema strani i tipu unita
  const color =
    side === "top"
      ? (type === "tank" ? "#e0f2fe" : "#f472b6")
      : (type === "tank" ? "#a5b4fc" : "#3b82f6");
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
            fillOpacity="0.27"
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
            fillOpacity="0.42"
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
            fillOpacity="0.6"
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
          animation: explosion-grow-fade 0.48s cubic-bezier(.6,1.7,.4,1.01) 1;
        }
        @keyframes explosion-grow-fade {
          0% { opacity: 1; transform: scale(0.2);}
          50% { opacity: 0.85; transform: scale(1.08);}
          80% { opacity: 0.7; }
          100% { opacity: 0; transform: scale(1.8);}
        }
        `}
      </style>
    </div>
  );
}