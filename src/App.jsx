import { useState, useEffect, useRef } from "react";
import GameBoard from "./components/GameBoard";
import ControlPanel from "./components/ControlPanel";
import GameOverScreen from "./components/GameOverScreen";

// Custom hook za zlato sa animacijom, sada sporije i pauzira kad je winner
function useGold(start = 100, stopped = false) {
  const [gold, setGold] = useState(start);
  const [anim, setAnim] = useState(false);

  useEffect(() => {
    if (stopped) return;
    // Sad je 2 po sekundi (svakih 500ms)
    const interval = setInterval(() => {
      setGold(g => {
        setAnim(true);
        return g + 1;
      });
      setTimeout(() => setAnim(false), 180);
    }, 500);
    return () => clearInterval(interval);
  }, [stopped]);

  return [gold, setGold, anim];
}

const ENEMY_UNITS = [
  { name: "Pešadinac", cost: 30, type: "infantry", hp: 100 },
  { name: "Strelac", cost: 50, type: "archer", hp: 80 },
  { name: "Tenk", cost: 100, type: "tank", hp: 200 },
];

function getRandomUnit(aiGold) {
  const affordable = ENEMY_UNITS.filter(u => u.cost <= aiGold);
  if (affordable.length === 0) return null;
  return affordable[Math.floor(Math.random() * affordable.length)];
}

export default function App() {
  const [units, setUnits] = useState([]);
  const [winner, setWinner] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  // Gold se broji SAMO dok nema winner-a!
  const [gold, setGold, goldAnim] = useGold(100, !!winner);
  const [aiGold, setAiGold] = useState(100);
  const aiGoldRef = useRef(aiGold);

  // --- Cooldown za spawn ---
  const [spawnCooldown, setSpawnCooldown] = useState(false);

  useEffect(() => { aiGoldRef.current = aiGold; }, [aiGold]);

  const handleSpawn = (unit) => {
    if (winner || gold < unit.cost || spawnCooldown) return;
    setUnits(prev => [
      ...prev,
      {
        ...unit,
        side: "bottom",
        id: Math.random().toString(36).slice(2),
        hp: unit.hp,
        y: 560,
        spawnTime: Date.now(),
      },
    ]);
    setGold(prev => prev - unit.cost);
    setSpawnCooldown(true);
    setTimeout(() => setSpawnCooldown(false), 500); // 0.5s cooldown
  };

  // AI gold i spawn (takođe usporen na 2/sec)
  useEffect(() => {
    if (winner) return;
    let currentGold = aiGoldRef.current;
    const aiInterval = setInterval(() => {
      currentGold += 1;
      const aiUnit = getRandomUnit(currentGold);
      if (aiUnit) {
        currentGold -= aiUnit.cost;
        setUnits(prevUnits => [
          ...prevUnits,
          {
            ...aiUnit,
            side: "top",
            id: Math.random().toString(36).slice(2),
            hp: aiUnit.hp,
            y: 0,
            spawnTime: Date.now(),
          },
        ]);
      }
      setAiGold(currentGold);
    }, 500); // 2/sec
    return () => clearInterval(aiInterval);
  }, [winner]);

  const handleGameOver = (message) => {
    if (message === "🎉 Pobeda IGRAČA!") setWinner("player");
    else if (message === "❌ Poražen si!") setWinner("enemy");
    else setWinner(message);
  };

  const handleUnitRemove = (unitId) => setUnits(prev => prev.filter(u => u.id !== unitId));
  const handleUnitsUpdate = (newUnits) => setUnits(newUnits);

  const resetGame = () => {
    setUnits([]);
    setGold(100);
    setAiGold(100);
    aiGoldRef.current = 100;
    setWinner(null);
    setResetKey(prev => prev + 1);
    setSpawnCooldown(false);
  };

  return (
    <div className="min-h-dvh w-full bg-gradient-to-b from-[#181c23] via-[#232837] to-[#32394a] text-white flex flex-col items-center gap-4 py-2 px-1 sm:gap-8 sm:py-8 sm:px-2 relative overflow-x-hidden">
      {/* BOARD */}
      <div className="relative w-full max-w-md">
        <GameBoard
          key={resetKey}
          units={units}
          onGameOver={handleGameOver}
          onUnitRemove={handleUnitRemove}
          onUnitsUpdate={handleUnitsUpdate}
          playerGold={gold}
          enemyGold={aiGold}
          playerGoldAnim={goldAnim}
        />
        {winner && (
          <GameOverScreen
            winner={winner}
            onRestart={resetGame}
          />
        )}
      </div>
      {/* Controls */}
      {!winner && (
        <div className="w-full max-w-md mx-auto">
          <ControlPanel gold={gold} onSpawn={handleSpawn} spawnCooldown={spawnCooldown} />
        </div>
      )}
    </div>
  );
}