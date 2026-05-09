"use client";

export default function CyberBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">

      {/* TOP LEFT GREEN GLOW */}
      <div className="absolute w-[600px] h-[600px] bg-green-500/10 blur-3xl rounded-full top-[-200px] left-[-200px] animate-pulse"></div>

      {/* BOTTOM RIGHT BLUE GLOW */}
      <div className="absolute w-[500px] h-[500px] bg-blue-500/10 blur-3xl rounded-full bottom-[-150px] right-[-150px] animate-pulse"></div>

      {/* CYBER GRID */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(#00ff99 1px, transparent 1px), linear-gradient(90deg, #00ff99 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}