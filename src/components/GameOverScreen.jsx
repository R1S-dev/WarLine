export default function GameOverScreen({ winner, onRestart }) {
  // winner: "player", "enemy", ili custom string
  let title, color, emoji, desc, shadow, btnBg, btnHover, btnText;
  if (winner === "player") {
    title = "POBEDA!";
    color = "from-cyan-400 via-blue-500 to-blue-900";
    shadow = "shadow-[0_0_34px_10px_#06b6d4cc]";
    emoji = "🏆";
    desc = "Srušio si neprijateljsku bazu!";
    btnBg = "bg-cyan-300/95";
    btnHover = "hover:bg-cyan-400/90";
    btnText = "text-blue-900";
  } else if (winner === "enemy") {
    title = "PORAZ";
    color = "from-indigo-400 via-indigo-700 to-blue-900";
    shadow = "shadow-[0_0_34px_10px_#6366f1cc]";
    emoji = "💀";
    desc = "Tvoja baza je uništena.";
    btnBg = "bg-indigo-300/95";
    btnHover = "hover:bg-indigo-400/90";
    btnText = "text-blue-900";
  } else {
    title = "Game Over";
    color = "from-gray-400 to-gray-600";
    shadow = "shadow-2xl";
    emoji = "😶";
    desc = winner;
    btnBg = "bg-gray-200/95";
    btnHover = "hover:bg-gray-300/90";
    btnText = "text-gray-800";
  }
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#181c23cc] backdrop-blur-[2px]">
      <div className={`bg-gradient-to-br ${color} px-10 py-8 rounded-3xl border-2 border-white/20 flex flex-col items-center animate-fade-in ${shadow}`}>
        <span className="text-[66px] mb-2 animate-bounce">{emoji}</span>
        <h2 className="text-3xl font-black tracking-widest text-white drop-shadow mb-1 uppercase">
          {title}
        </h2>
        <p className="text-md text-white/90 mb-6">{desc}</p>
        <button
          className={`mt-2 px-8 py-3 rounded-xl font-bold text-lg shadow-lg border-2 border-white/40 ${btnBg} ${btnHover} ${btnText} transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700 active:scale-95`}
          style={{
            textShadow: "0 2px 12px #fff8",
            letterSpacing: "0.04em",
            fontWeight: 900,
          }}
          onClick={onRestart}
        >
          Nova partija
        </button>
      </div>
      <style>
        {`
          @keyframes fade-in { 0% { opacity: 0; transform: scale(0.96);} 100% {opacity: 1; transform: scale(1);} }
          .animate-fade-in { animation: fade-in 0.45s cubic-bezier(.22,1.2,.36,1) both; }
        `}
      </style>
    </div>
  );
}