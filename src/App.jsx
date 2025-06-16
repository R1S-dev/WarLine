import { useState, useEffect, useRef } from "react";
import GameBoard from "./components/GameBoard";
import ControlPanel from "./components/ControlPanel";
import GameOverScreen from "./components/GameOverScreen";
import MenuScreen from "./components/MenuScreen";

// Custom hook za zlato sa animacijom, sada sporije i pauzira kad je winner
function useGold(start = 100, stopped = false) {
  const [gold, setGold] = useState(start);
  const [anim, setAnim] = useState(false);

  useEffect(() => {
    if (stopped) return;
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
  const [screen, setScreen] = useState("menu");
  const [units, setUnits] = useState([]);
  const [winner, setWinner] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  const [gold, setGold, goldAnim] = useGold(100, !!winner || screen === "menu");
  const [aiGold, setAiGold] = useState(100);
  const aiGoldRef = useRef(aiGold);
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
        y: 670,
        spawnTime: Date.now(),
      },
    ]);
    setGold(prev => prev - unit.cost);
    setSpawnCooldown(true);
    setTimeout(() => setSpawnCooldown(false), 500);
  };

  useEffect(() => {
    if (winner || screen !== "game") return;
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
    }, 500);
    return () => clearInterval(aiInterval);
  }, [winner, screen]);

  const handleGameOver = (message) => {
    if (message === "🎉 Pobeda IGRAČA!") setWinner("player");
    else if (message === "❌ Poražen si!") setWinner("enemy");
    else setWinner(message);
  };

  const handleUnitRemove = (unitId) => setUnits(prev => prev.filter(u => u.id !== unitId));
  const handleUnitsUpdate = (newUnits) => setUnits(newUnits);

  const startGame = () => {
    setUnits([]);
    setGold(100);
    setAiGold(100);
    aiGoldRef.current = 100;
    setWinner(null);
    setResetKey(prev => prev + 1);
    setSpawnCooldown(false);
    setScreen("game");
  };

  const handleSearchOpponent = () => {
    alert("Multiplayer dolazi uskoro! :)");
  };

  // --- FULLSCREEN LAYOUT ---
  if (screen === "menu") {
    return (
      <MenuScreen
        onStartVsAI={startGame}
        onSearchOpponent={handleSearchOpponent}
      />
    );
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        height: "100dvh",
        width: "100vw",
        maxWidth: "100vw",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(to bottom, #181c23 0%, #232837 45%, #32394a 100%)",
      }}
    >
      <div style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "stretch",
        alignItems: "stretch",
        position: "relative",
        overflow: "hidden",
        width: "100vw",
        maxWidth: "100vw",
      }}>
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
            onRestart={() => setScreen("menu")}
          />
        )}
      </div>
      {/* Dugmići na dnu, uvek prikazani, sticky! */}
      {!winner && (
        <div style={{
          width: "100vw",
          maxWidth: 600,
          margin: "0 auto",
          position: "sticky",
          bottom: 0,
          left: 0,
          zIndex: 99,
          background: "rgba(24,28,35,0.96)",
          boxShadow: "0 -2px 18px #00eaff18",
          padding: "8px 0 8px 0",
          minHeight: 64,
        }}>
          <ControlPanel gold={gold} onSpawn={handleSpawn} spawnCooldown={spawnCooldown} />
        </div>
      )}
    </div>
  );
}