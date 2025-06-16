import React, { useRef, useEffect } from "react";
import { UserCircle2, Search, Bot, LogIn, Settings, BarChart2, Trophy } from "lucide-react";

// --- Enhanced, more visible starfield with more "shooting stars" (rockets/lines) and staggered animation ---
function StarfieldBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    let animationId;
    const ctx = canvasRef.current.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;
    let stars = [];
    let shootingStars = [];
    let extraStreaks = [];

    const STAR_COUNT = Math.max(100, Math.floor((width + height) / 4));
    const SHOOTING_STAR_CHANCE = 0.022;
    const EXTRA_STREAKS_COUNT = 12;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        const speed = 0.04 + Math.random() * 0.13;
        const angle = Math.random() * Math.PI * 2;
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: 0.44 + Math.random() * 1.1,
          dx: Math.cos(angle) * speed,
          dy: Math.sin(angle) * speed,
          a: 0.16 + Math.random() * 0.22,
          color: Math.random() < 0.98
            ? "#a0e8fa"
            : `hsl(${187 + Math.random() * 25},100%,${86 + Math.random() * 5}%)`,
          twinkle: Math.random() * Math.PI * 2,
        });
      }
      // Extra streaks
      extraStreaks = [];
      for (let i = 0; i < EXTRA_STREAKS_COUNT; i++) {
        const delay = Math.random() * 19000;
        const startX = Math.random() * width * 0.85;
        const startY = Math.random() * height * 0.75;
        extraStreaks.push({
          x: startX,
          y: startY,
          vx: 2.1 + Math.random() * 2.2,
          vy: 1.1 + Math.random() * 1.7,
          len: 60 + Math.random() * 60,
          opacity: 0.13 + Math.random() * 0.09,
          duration: 3200 + Math.random() * 2300,
          delay,
          progress: 0,
          active: false,
        });
      }
    }
    resize();
    window.addEventListener("resize", resize);

    function spawnShootingStar() {
      shootingStars.push({
        x: Math.random() * width * 0.7 + width * 0.15,
        y: Math.random() * height * 0.5 + height * 0.08,
        len: 65 + Math.random() * 36,
        speed: 4.6 + Math.random() * 2.2,
        angle: Math.PI / 3 + (Math.random() - 0.5) * 0.13,
        alpha: 1
      });
    }

    let lastFrame = Date.now();

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Stars (twinkle, a bit more visible)
      for (let star of stars) {
        let tw = 0.8 + 0.22 * Math.abs(Math.sin(Date.now() * 0.0012 + star.twinkle));
        ctx.globalAlpha = star.a * tw;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r * tw, 0, 2 * Math.PI, false);
        ctx.fillStyle = star.color;
        ctx.shadowColor = star.color;
        ctx.shadowBlur = 5;
        ctx.fill();
        star.x += star.dx;
        star.y += star.dy;
        if (star.x < -10) star.x = width + 5;
        if (star.x > width + 10) star.x = -5;
        if (star.y < -10) star.y = height + 5;
        if (star.y > height + 10) star.y = -5;
      }
      ctx.shadowBlur = 0;

      // Main shooting stars (random, diagonal)
      if (Math.random() < SHOOTING_STAR_CHANCE && shootingStars.length < 6) spawnShootingStar();
      for (let s = shootingStars.length - 1; s >= 0; s--) {
        let star = shootingStars[s];
        ctx.save();
        ctx.globalAlpha = 0.16 * star.alpha;
        ctx.strokeStyle = "#bbf3ff";
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(
          star.x - Math.cos(star.angle) * star.len,
          star.y - Math.sin(star.angle) * star.len
        );
        ctx.stroke();
        ctx.restore();
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;
        star.alpha -= 0.014 + Math.random() * 0.010;
        if (star.alpha < 0.01 || star.x > width + 200 || star.y > height + 200) shootingStars.splice(s, 1);
      }

      // Extra "rocket" streaks (move in straight lines, regenerate after finish)
      let now = Date.now();
      let dt = Math.min(50, now - lastFrame);
      lastFrame = now;
      for (let line of extraStreaks) {
        if (!line.active) {
          line.delay -= dt;
          if (line.delay <= 0) {
            line.delay = 0;
            line.active = true;
            line.progress = 0;
          } else continue;
        }
        line.progress += dt;
        let t = line.progress / line.duration;
        if (t > 1) {
          // Reset to random position
          line.x = Math.random() * width * 0.95;
          line.y = Math.random() * height * 0.85;
          line.vx = 1.8 + Math.random() * 3.5;
          line.vy = 0.8 + Math.random() * 2.3;
          line.len = 55 + Math.random() * 60;
          line.opacity = 0.13 + Math.random() * 0.14;
          line.duration = 2600 + Math.random() * 2800;
          line.delay = Math.random() * 19000;
          line.progress = 0;
          line.active = false;
          continue;
        }
        ctx.save();
        const ease = t < 0.85 ? t : 0.85 + (t - 0.85) * 0.15;
        ctx.globalAlpha = line.opacity * (1 - t * 0.8);
        ctx.strokeStyle = "#e7f8ff";
        ctx.lineWidth = 1.2 + Math.sin(now * 0.0013 + line.x) * 0.15;
        ctx.beginPath();
        const startX = line.x + ease * line.vx * line.duration * 0.055;
        const startY = line.y + ease * line.vy * line.duration * 0.055;
        ctx.moveTo(startX, startY);
        ctx.lineTo(
          startX - line.len,
          startY - line.len * 0.28
        );
        ctx.stroke();
        ctx.restore();
      }

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{
        position: 'fixed',
        top: 0, left: 0,
        zIndex: 0,
        background: "radial-gradient(ellipse at 50% 60%, #151d2a 0%, #070d17 100%)"
      }}
    />
  );
}

// --- Futuristic Button Component for Menu, animated background only ---
function ButtonMenu({ onClick, icon, text, colorClass, borderClass, disabled, textClass, animDelay }) {
  return (
    <button
      type="button"
      className={[
        "main-btn flex-row",
        colorClass ? colorClass : "",
        borderClass ? borderClass : "",
        disabled ? "opacity-65 pointer-events-none" : "",
      ].join(" ")}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      tabIndex={0}
      style={animDelay ? { '--btn-anim-delay': `${animDelay}ms` } : {}}
    >
      <span className="btn-bg-anim" aria-hidden="true"></span>
      <span className={`btn-inner-anim ${textClass || ""}`}>{icon}{text}</span>
    </button>
  );
}

const user = {
  username: "warrior01",
  level: 7,
  avatar: null,
};

export default function MenuScreen({ onStartVsAI, onSearchOpponent }) {
  return (
    <div className="fixed inset-0 min-h-screen w-full flex flex-col items-center justify-between overflow-x-hidden z-10">
      <StarfieldBackground />
      <main className="flex flex-col items-center justify-between w-full grow mx-auto px-2 max-w-[440px] min-h-screen pt-7 pb-5">
        {/* WarLine Title - center, loading/space/futuristic animation */}
        <div className="flex flex-col items-center mt-[7vh] mb-0">
          <div className="warline-animated-loader">
            <span className="warline-futuristic-text">WarLine</span>
            <span className="warline-loader-glow" />
          </div>
          <span className="text-xs sm:text-sm text-cyan-100/70 tracking-wide mt-1 subtitle-fade-in select-none">
            <span className="font-mono bg-cyan-800/10 px-2 py-0.5 rounded">Real-Time Sci-Fi RTS</span>
          </span>
        </div>
        {/* Korisnički profil + Buttons */}
        <div className="w-full flex flex-col items-center justify-center">
          <div className="flex items-center gap-4 w-full bg-[#181e2bcc] border border-cyan-200/10 rounded-2xl px-4 py-3 mb-8 shadow-md mx-auto transition-all duration-300 profile-fade-in backdrop-blur-md">
            <div className="relative shrink-0">
              {user.avatar ? (
                <img src={user.avatar} alt="avatar" className="w-12 h-12 rounded-full border-2 border-cyan-300 shadow-md" />
              ) : (
                <UserCircle2 className="w-12 h-12 text-cyan-300" />
              )}
              <span className="absolute bottom-0 right-0 bg-cyan-300 text-[#1a2535] text-xs font-bold px-1.5 py-0.5 rounded-full shadow-sm">Lv {user.level}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-base text-cyan-100 truncate">{user.username}</div>
              <div className="text-xs text-cyan-200/60 font-mono truncate">ID: #0001</div>
            </div>
            <div className="flex items-center gap-1">
              <button className="icon-btn" title="Podešavanja" tabIndex={0}>
                <Settings className="w-5 h-5 text-cyan-300 hover:text-cyan-400 transition-colors" />
              </button>
              <button className="icon-btn" title="Odjavi se" tabIndex={0}>
                <LogIn className="w-5 h-5 text-indigo-300 hover:text-indigo-400 transition-colors" />
              </button>
            </div>
          </div>
          {/* Main buttons */}
          <div className="flex flex-col gap-3 w-full px-3 menu-fade-in relative mt-3">
            <ButtonMenu
              onClick={onSearchOpponent}
              icon={<Search className="w-6 h-6 mr-2 icon-anim" />}
              text="Pronađi protivnika"
              colorClass="futur-btn-bg-main"
              borderClass="futur-btn-border-strong"
              textClass="text-[#eafcff] font-bold"
              animDelay={0}
            />
            <ButtonMenu
              onClick={onStartVsAI}
              icon={<Bot className="w-6 h-6 mr-2 icon-anim" />}
              text="Igraj protiv AI"
              colorClass="futur-btn-bg-main"
              borderClass="futur-btn-border"
              textClass="text-[#e1e7f7] font-bold"
              animDelay={900}
            />
            <ButtonMenu
              icon={<BarChart2 className="w-6 h-6 mr-2 icon-anim" />}
              text="Statistika"
              colorClass="futur-btn-bg-main"
              borderClass="futur-btn-border"
              textClass="text-[#e7f5f9] font-bold"
              animDelay={600}
            />
            <ButtonMenu
              icon={<Trophy className="w-6 h-6 mr-2 icon-anim" />}
              text="Leaderboard"
              colorClass="futur-btn-bg-main"
              borderClass="futur-btn-border"
              textClass="text-cyan-100 font-bold"
              animDelay={1500}
            />
          </div>
        </div>
        {/* Footer */}
        <footer className="w-full flex items-center justify-center pt-2 z-20">
          <span className="text-cyan-200/60 font-mono tracking-widest text-xs select-none">
            v0.1 | Multiplayer & profil uskoro
          </span>
        </footer>
      </main>
      <style>
        {`
          .max-w-[440px] { max-width: 440px; }
          .main-btn {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 0.85rem;
            padding: 1.24rem 1.1rem;
            width: 100%;
            min-height: 3.99rem;
            border-radius: 1.25rem;
            font-size: 1.18rem;
            font-weight: 700;
            letter-spacing: 0.052em;
            box-shadow: 0 2px 14px 0 #38bdf84a;
            transition:
              box-shadow 0.16s,
              background 0.17s,
              color 0.16s,
              filter 0.12s,
              transform 0.13s;
            outline: none;
            user-select: none;
            position: relative;
            z-index: 1;
            overflow: hidden;
            border-width: 2.2px;
            border-style: solid;
            background-clip: padding-box;
            cursor: pointer;
            margin-left: 0.1rem;
            margin-right: 0.1rem;
          }
          .main-btn:active {
            filter: brightness(1.03) saturate(1.04);
            box-shadow: 0 0 0 0 transparent, 0 0 4px #67e8f950;
            transform: scale(0.985);
          }
          .main-btn:focus-visible {
            box-shadow: 0 0 0 2px #38bdf825;
          }
          .main-btn[disabled] {
            filter: grayscale(0.5) opacity(0.56);
            cursor: not-allowed;
            pointer-events: none;
            background-image: none !important;
          }
          /* ---- OPTIMIZED ANIMATED BUTTON BG: svetle boje sad tamnije, bolji kontrast za text ---- */
          .futur-btn-bg-main .btn-bg-anim {
            background: linear-gradient(
              120deg,
              #182132 0%,
              #20405c 25%,
              #1c9eb5 54%,
              #22374e 75%,
              #131b28 100%
            );
            background-size: 220% 220%;
          }
          .futur-btn-border-strong {
            border-color: #b0e6ff;
            box-shadow: 0 0 0 2px #13cbe6a8, 0 0 13px #b0e6ff33;
            animation: border-shine 2.8s linear infinite;
          }
          @keyframes border-shine {
            0% { border-color: #b0e6ff; box-shadow: 0 0 0 2px #13cbe6a8, 0 0 13px #b0e6ff33; }
            50% { border-color: #43cbe9; box-shadow: 0 0 0 2.5px #82fcff44, 0 0 14px #b0e6ff77; }
            100% { border-color: #b0e6ff; box-shadow: 0 0 0 2px #13cbe6a8, 0 0 13px #b0e6ff33; }
          }
          .futur-btn-border {
            border-color: #254963;
            box-shadow: 0 0 0 1px #13304744;
          }
          .btn-bg-anim {
            position: absolute;
            inset: 0;
            border-radius: inherit;
            z-index: 0;
            pointer-events: none;
            opacity: 1;
            will-change: background-position;
            animation: btn-gradient-move-main 13s cubic-bezier(.4,0,.4,1) infinite;
            animation-delay: var(--btn-anim-delay, 0ms);
          }
          @keyframes btn-gradient-move-main {
            0% {background-position: 0% 60%;}
            50% {background-position: 100% 40%;}
            100% {background-position: 0% 60%;}
          }
          .main-btn:not([disabled]) .btn-inner-anim {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            width: 100%;
            height: 100%;
            position: relative;
            z-index: 1;
          }
          .icon-anim {
            animation: icon-futur-anim 5.7s infinite cubic-bezier(.37,.17,.45,.86);
            will-change: filter, transform;
          }
          @keyframes icon-futur-anim {
            0% { filter: brightness(1) drop-shadow(0 0 0px #00ffe2); transform: translateY(0);}
            60% { filter: brightness(1.12) drop-shadow(0 0 4px #00ffe2); transform: translateY(-1.5px);}
            100% { filter: brightness(1) drop-shadow(0 0 0px #00ffe2); transform: translateY(0);}
          }
          .warline-animated-loader {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
          }
          .warline-futuristic-text {
            font-size: clamp(2.56rem, 13.2vw, 3.61rem);
            font-family: 'Orbitron', 'Montserrat', Arial, sans-serif;
            font-weight: 900;
            letter-spacing: 0.19em;
            color: #b8eaff;
            background: linear-gradient(90deg, #e3faff 15%, #00eaff 65%, #4786fc 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            filter: blur(0.6px) drop-shadow(0 0 5px #67e8f9a0);
            text-shadow: 0 0 7px #b8eaff22, 0 0 16px #00eaff09;
            transition: filter 0.16s, text-shadow 0.16s;
            animation: warline-loader-glow 2.1s cubic-bezier(.45,.43,.63,1.36) infinite alternate;
            position: relative;
            z-index: 2;
            top: 10px;
          }
          .warline-loader-glow {
            position: absolute;
            left: 50%;
            top: 67%;
            transform: translate(-50%,-50%);
            width: 68%;
            height: 1.08em;
            border-radius: 50%;
            background: radial-gradient(ellipse at center, #2ecfff66 0%, #0a101a00 88%);
            filter: blur(10px);
            opacity: 0.55;
            z-index: 1;
            pointer-events: none;
            animation: warline-loader-glow-scan 1.1s linear infinite alternate;
          }
          @keyframes warline-loader-glow-scan {
            0% { opacity: 0.34; }
            100% { opacity: 0.67; }
          }
          @keyframes warline-loader-glow {
            0% { filter: blur(1.2px) drop-shadow(0 0 3px #67e8f9a0) brightness(1.03);}
            75% { filter: blur(0.2px) drop-shadow(0 0 14px #81e9ff) brightness(1.13);}
            100% { filter: blur(1.2px) drop-shadow(0 0 3px #67e8f9a0) brightness(1.03);}
          }
          @media (max-width: 640px) {
            .main-btn {
              font-size: 1.13rem;
              padding: 1.04rem 0.28rem;
              min-height: 3.18rem;
              border-radius: 0.97rem;
              margin-left: 0.08rem;
              margin-right: 0.08rem;
            }
            .icon-btn {
              padding: 0.18rem;
            }
            .warline-futuristic-text {
              font-size: clamp(2.7rem, 17vw, 3.7rem);
              top: 7px;
            }
            .max-w-[440px] {
              max-width: 100vw !important;
            }
            .px-3 {
              padding-left: 0.7rem !important;
              padding-right: 0.7rem !important;
            }
          }
          .fade-in-all {
            animation: fade-in-all 1.05s cubic-bezier(.26,1.05,.43,1) both;
          }
          @keyframes fade-in-all {
            0% { opacity: 0; transform: scale(1.01) translateY(36px);}
            40% { opacity: 0.74; transform: scale(1.005) translateY(8px);}
            100% { opacity: 1; transform: scale(1) translateY(0);}
          }
          .profile-fade-in {
            animation: profile-fade-in 1.01s 0.19s cubic-bezier(.22,1.2,.36,1) both;
          }
          @keyframes profile-fade-in {
            0% { opacity: 0; transform: scale(0.97) translateY(14px);}
            100% { opacity: 1; transform: scale(1) translateY(0);}
          }
          .menu-fade-in {
            animation: menu-fade-in 1.01s 0.34s cubic-bezier(.22,1.3,.36,1) both;
          }
          @keyframes menu-fade-in {
            0% { opacity: 0; transform: translateY(16px) scale(0.98);}
            100% {opacity: 1; transform: translateY(0) scale(1);}
          }
          .subtitle-fade-in {
            animation: subtitle-fade-in 1.02s 0.61s cubic-bezier(.22,1,.36,1) both;
          }
          @keyframes subtitle-fade-in {
            0% { opacity: 0; transform: translateY(8px) scale(0.98);}
            100% { opacity: 1; transform: translateY(0) scale(1);}
          }
        `}
      </style>
    </div>
  );
}