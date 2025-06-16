export default function LaneBackground() {
  return (
    <>
      <div
        className="absolute inset-0 w-full h-full z-0 rounded-[22px] lane-bg-futur"
        style={{
          borderRadius: 22,
          border: "2.5px solid #28334a",
          boxShadow: "0 0 60px 5px #00f2ff44, 0 0 0 2.5px #23263a",
          overflow: "hidden",
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
            "linear-gradient(180deg,#60fdffcc 0%,#0ff2 50%,#23263a 100%)",
          filter: "blur(1.8px)",
          transform: "translateX(-50%)",
          top: "3%",
          borderRadius: 8,
          opacity: 0.5,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      {/* Svetleće ivice lane (gore i dole) */}
      <div
        className="absolute left-0 right-0"
        style={{
          height: 9,
          top: 0,
          background:
            "linear-gradient(90deg,#7afcff44 0%,rgba(0,0,0,0.00) 33%,rgba(0,0,0,0.00) 67%,#e879f944 100%)",
          borderRadius: "12px 12px 0 0",
          filter: "blur(2.5px)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      <div
        className="absolute left-0 right-0"
        style={{
          height: 9,
          bottom: 0,
          background:
            "linear-gradient(90deg,#7afcff44 0%,rgba(0,0,0,0.00) 33%,rgba(0,0,0,0.00) 67%,#e879f944 100%)",
          borderRadius: "0 0 12px 12px",
          filter: "blur(2.5px)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      <style>
        {`
          .lane-bg-futur {
            background: linear-gradient(120deg, #182132 0%, #20405c 25%, #1c9eb5 54%, #22374e 75%, #131b28 100%);
            animation: lane-futur-bg-move 22s cubic-bezier(.6,0,.4,1) infinite alternate;
            opacity: 0.97;
          }
          .glow-pulse {
            animation: glow-pulse 1.8s cubic-bezier(.7,.3,.3,1.1) infinite;
          }
          @keyframes glow-pulse {
            0%,100% { box-shadow: 0 0 20px 7px #00f2ff33; }
            50% { box-shadow: 0 0 50px 22px #00f2ff99;}
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