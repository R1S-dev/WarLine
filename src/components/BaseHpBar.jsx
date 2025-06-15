export default function BaseHpBar({ hp }) {
  return (
    <div className="w-full bg-red-900 h-3 rounded-full overflow-hidden shadow-inner">
      <div
        className="h-full bg-red-500 transition-all duration-500"
        style={{ width: `${hp}%` }}
      ></div>
    </div>
  );
}