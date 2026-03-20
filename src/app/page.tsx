"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SelectionPage = () => {
  const [hovered, setHovered] = useState<"portfolio" | "game" | null>(null);
  const router = useRouter();

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-[#0a0a0a]">

      {/* Left — Portfolio */}
      <div
        className={`relative flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-500 ease-in-out
          ${hovered === "portfolio" ? "flex-[1.15] bg-[#0f1a0f]" : "flex-1 bg-[#0a0a0a]"}`}
        onClick={() => router.push("/portfolio")}
        onMouseEnter={() => setHovered("portfolio")}
        onMouseLeave={() => setHovered(null)}
      >
        {/* Grid texture */}
        <div
          className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            opacity: hovered === "portfolio" ? 0.05 : 0.02,
          }}
        />

        <div className="relative z-10 flex flex-col gap-3 px-10">
          <span className="text-[11px] tracking-[0.3em] uppercase text-neutral-600">
            explore
          </span>
          <h1
            className={`text-[clamp(48px,7vw,96px)] font-extrabold leading-none text-[#c8f5a0] transition-transform duration-300
              ${hovered === "portfolio" ? "translate-x-2" : "translate-x-0"}`}
            style={{ textShadow: "0 0 60px rgba(120,220,60,0.15)" }}
          >
            Quick
            <br />
            Portfolio
          </h1>
          <p className="text-sm text-neutral-600 tracking-wide">
            Work, skills &amp; projects
          </p>
          <span
            className={`mt-6 text-3xl font-bold text-[#c8f5a0] transition-all duration-300
              ${hovered === "portfolio" ? "translate-x-2 opacity-100" : "translate-x-0 opacity-30"}`}
          >
            →
          </span>
        </div>
      </div>

      {/* Center Divider */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full flex flex-col items-center z-10 pointer-events-none">
        <div className="flex-1 w-px bg-gradient-to-b from-transparent via-neutral-800 to-transparent" />
        <div className="w-2 h-2 rounded-full bg-neutral-800 shrink-0" />
        <div className="flex-1 w-px bg-gradient-to-b from-transparent via-neutral-800 to-transparent" />
      </div>

      {/* Right — Game */}
      <div
        className={`relative flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-500 ease-in-out
          ${hovered === "game" ? "flex-[1.15] bg-[#0d0d1a]" : "flex-1 bg-[#0a0a0a]"}`}
        onClick={() => router.push("/game")}
        onMouseEnter={() => setHovered("game")}
        onMouseLeave={() => setHovered(null)}
      >
        {/* Grid texture */}
        <div
          className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            opacity: hovered === "game" ? 0.05 : 0.02,
          }}
        />

        <div className="relative z-10 flex flex-col gap-3 px-10">
          <span className="text-[11px] tracking-[0.3em] uppercase text-neutral-600">
            play now
          </span>
          <h1
            className={`text-[clamp(48px,7vw,96px)] font-extrabold leading-none text-[#a0c8ff] transition-transform duration-300
              ${hovered === "game" ? "translate-x-2" : "translate-x-0"}`}
            style={{ textShadow: "0 0 60px rgba(60,120,255,0.15)" }}
          >
            Play
            <br />
            Game
          </h1>
          <p className="text-sm text-neutral-600 tracking-wide">
            Jump in &amp; have fun
          </p>
          <span
            className={`mt-6 text-3xl font-bold text-[#a0c8ff] transition-all duration-300
              ${hovered === "game" ? "translate-x-2 opacity-100" : "translate-x-0 opacity-30"}`}
          >
            →
          </span>
        </div>
      </div>
    </div>
  );
};

export default SelectionPage;