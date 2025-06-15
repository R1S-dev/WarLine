import { Shield, Crosshair, Truck, CircleDollarSign } from "lucide-react";

// Izabrane prave ikone iz https://lucide.dev/icons (Truck umesto ArmoredVehicle)
const UNIT_ICONS = {
  infantry: <Shield size={28} strokeWidth={2.2} className="text-blue-400" />,
  archer: <Crosshair size={28} strokeWidth={2.2} className="text-emerald-400" />,
  tank: <Truck size={28} strokeWidth={2.2} className="text-gray-500" />,
};

const units = [
  { cost: 30, type: "infantry", hp: 100 },
  { cost: 50, type: "archer", hp: 80 },
  { cost: 100, type: "tank", hp: 200 },
];

export default function ControlPanel({ gold, onSpawn }) {
  return (
    <div className="flex justify-between px-1 py-2 w-full max-w-md bg-[#222532] rounded-xl shadow border border-[#212637] mt-2 gap-2 z-10">
      {units.map((unit) => (
        <button
          key={unit.type}
          onClick={() => gold >= unit.cost && onSpawn(unit)}
          disabled={gold < unit.cost}
          className={`
            flex-1 flex flex-col items-center px-1.5 py-2 rounded-lg outline-none border
            active:scale-95 transition-all duration-150
            ${gold >= unit.cost
              ? "bg-[#262b39] hover:bg-[#27304b] border-blue-400"
              : "bg-gray-800 text-gray-300 border-gray-600 opacity-60 cursor-not-allowed"}
            focus:ring-2 focus:ring-blue-200/60
          `}
          style={{ minWidth: 0 }}
        >
          {/* Ikonica jedinice */}
          <span className="mb-2">{UNIT_ICONS[unit.type]}</span>
          {/* Cena: coin ikonica + broj */}
          <span className="flex items-center gap-1">
            <CircleDollarSign size={17} strokeWidth={2.2} className="text-yellow-400" />
            <span className="font-bold text-yellow-300 text-base">{unit.cost}</span>
          </span>
        </button>
      ))}
    </div>
  );
}