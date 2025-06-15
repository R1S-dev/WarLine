import Unit from "./Unit";

// baseHit: {side, y, type} ili null
export default function UnitsLayer({ units, laneWidth, baseHit, unitsBaseHp }) {
  return (
    <>
      {units.map((unit) => (
        <Unit
          key={unit.id}
          {...unit}
          laneWidth={laneWidth}
          fighting={!!unit.fighting}
          baseHit={baseHit && baseHit.side === unit.side && Math.abs(unit.y - baseHit.y) < 8}
          unitsBaseHp={unitsBaseHp}
        />
      ))}
    </>
  );
}