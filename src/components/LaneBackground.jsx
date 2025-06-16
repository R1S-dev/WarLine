export default function LaneBackground() {
  return (
    <>
      {/* Glavna tabla sa tamnijim, modernim, staklenim efektom i borderom */}
      <div
        className="absolute inset-0 w-full h-full z-0 rounded-[22px] lane-bg-futur"
        style={{
          borderRadius: 22,
          border: "2.8px solid #23263a",
          boxShadow: "0 0 70px 5px #0ff2ff33, 0 0 0 2.5px #101422",
          overflow: "hidden",
          background: "rgba(22,26,36,0.98)", // stakleni efekat
          backdropFilter: "blur(1.5px)",
          pointerEvents: "none",
        }}
      />
      {/* Centralna svetlosna linija */}
      <div
        className="absolute left-1/2 glow-pulse"
        style={{
          width: 4,
          height: "94%",
          background:
            "linear-gradient(180deg,#50e5ffcc 0%,#0ff2 55%,#23263a 100%)",
          filter: "blur(2.2px)",
          transform: "translateX(-50%)",
          top: "3%",
          borderRadius: 10,
          opacity: 0.57,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      {/* Svetleće ivice lane (gore i dole) */}
      <div
        className="absolute left-0 right-0"
        style={{
          height: 11,
          top: 0,
          background:
            "linear-gradient(90deg,#53e5ff55 0%,rgba(0,0,0,0.00) 30%,rgba(0,0,0,0.00) 70%,#e879f933 100%)",
          borderRadius: "14px 14px 0 0",
          filter: "blur(3.2px)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      <div
        className="absolute left-0 right-0"
        style={{
          height: 11,
          bottom: 0,
          background:
            "linear-gradient(90deg,#53e5ff55 0%,rgba(0,0,0,0.00) 30%,rgba(0,0,0,0.00) 70%,#e879f933 100%)",
          borderRadius: "0 0 14px 14px",
          filter: "blur(3.2px)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      <style>
        {`
          .lane-bg-futur {
            background: linear-gradient(120deg, #141c26 0%, #1a2334 25%, #195c74 54%, #1e4865 75%, #111823 100%);
            animation: lane-futur-bg-move 22s cubic-bezier(.6,0,.4,1) infinite alternate;
            opacity: 0.98;
          }
          .glow-pulse {
            animation: glow-pulse 2.2s cubic-bezier(.7,.3,.3,1.1) infinite;
          }
          @keyframes glow-pulse {
            0%,100% { box-shadow: 0 0 20px 7px #59eaff33; }
            55% { box-shadow: 0 0 54px 18px #2cf2ff99;}
          }
          @keyframes lane-futur-bg-move {
            0% { background-position: 0% 60%; }
            100% { background-position: 100% 40%; }
          }
        `}
      </style>
    </>
  );
}