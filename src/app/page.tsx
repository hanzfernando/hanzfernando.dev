"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Gamepad2 } from "lucide-react";

const SelectionPage = () => {
  const [hovered, setHovered] = useState<"portfolio" | "game" | null>(null);
  const router = useRouter();

  return (
    <main className="relative max-h-screen text-[#e8e4dc] overflow-hidden">

      {/* Top accent rule */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#c8b98b]/40 to-transparent" />

      <div className="relative mx-auto max-w-4xl min-h-screen flex flex-col px-6 py-14 sm:px-10 sm:py-20">

        {/* ── IDENTITY ── */}
        <header className="mb-14">
          <div className="flex items-center gap-4 mb-5">
            <picture className="h-28 bg-[#1e1e18] overflow-hidden">
              <img
                src="/profile/hanz-1.jpg"
                alt="Hanz Fernando"
                className="w-full h-full object-cover"
              />
            </picture>
            <div>
              <h1 className="text-4xl sm:text-4xl font-bold text-[#e8e4dc] leading-tight tracking-tight">
                Hanz Fernando
              </h1>
               <p className="text-sm tracking-wide text-[#6a6458] uppercase">
                Full Stack Developer
              </p>
            </div>
          </div>

         

          <div className="h-px bg-[#1e1e18] mb-6" />

          <p className="max-w-md text-[15px] leading-relaxed text-[#5a5448]">
            Choose how you&lsquo;d like to explore my work.
          </p>
        </header>

        {/* ── CARDS ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 items-start">

          {/* Quick View */}
          <button
            type="button"
            onClick={() => router.push("/portfolio")}
            onMouseEnter={() => setHovered("portfolio")}
            onMouseLeave={() => setHovered(null)}
            className=" cursor-pointer group relative text-left rounded-2xl border border-[#2a2820] bg-[#111209] p-8 overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-[#c8b98b]/50 hover:bg-[#0f1a0f] hover:shadow-[0_16px_48px_rgba(200,185,139,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8b98b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0f12]"
          >
            {/* subtle grid texture on hover */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-500"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(200,185,139,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,185,139,1) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
                opacity: hovered === "portfolio" ? 0.04 : 0.015,
              }}
            />

            <div className="relative z-10 flex flex-col gap-3">
              <span className="text-[10px] uppercase tracking-[0.28em] text-[#5a5448]">
                explore
              </span>

              <h2
                className={`text-[clamp(40px,6vw,72px)] font-mono font-extrabold leading-none text-[#c8b98b] transition-transform duration-300 ${hovered === "portfolio" ? "translate-x-1.5" : "translate-x-0"}`}
                style={{ textShadow: "0 0 60px rgba(200,185,139,0.12)" }}
              >
                Quick
                <br />
                View
              </h2>

              <p className="text-sm text-[#4a4840] tracking-wide">
                Work, skills &amp; projects
              </p>

              <span
                className={`mt-4 inline-flex items-center gap-1.5 text-2xl font-bold text-[#c8b98b] transition-all duration-300 ${hovered === "portfolio" ? "translate-x-2 opacity-100" : "translate-x-0 opacity-25"}`}
              >
                <ArrowRight size={22} />
              </span>
            </div>
          </button>

          {/* Interactive View */}
          <button
            type="button"
            onClick={() => router.push("/game")}
            onMouseEnter={() => setHovered("game")}
            onMouseLeave={() => setHovered(null)}
            className="group cursor-pointer relative text-left rounded-2xl border border-[#1a2235] bg-[#0c0e18] p-8 overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-[#5b82c4]/50 hover:bg-[#0d0d1a] hover:shadow-[0_16px_48px_rgba(91,130,196,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5b82c4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0f12]"
          >
            {/* pixel grid texture */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-500"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(91,130,196,1) 1px, transparent 1px), linear-gradient(90deg, rgba(91,130,196,1) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
                opacity: hovered === "game" ? 0.07 : 0.03,
              }}
            />

            <div className="relative pixel-font z-10 flex flex-col gap-3 font-mono">
              <span className="text-[10px] uppercase tracking-[0.28em] text-[#3a4d6a]">
                play now
              </span>

              <h2
                className={`text-[clamp(40px,6vw,72px)] font-base leading-none text-[#a0c8ff] transition-transform duration-300 ${hovered === "game" ? "translate-x-1.5" : "translate-x-0"}`}
                style={{ textShadow: "0 0 60px rgba(91,130,196,0.15)" }}
              >
                Play
                <br />
                Game
              </h2>

              <p className="text-sm text-[#3a4560] tracking-wide">
                Jump in &amp; have fun
              </p>

              <span
                className={`mt-4 inline-flex items-center gap-1.5 text-2xl font-bold text-[#a0c8ff] transition-all duration-300 ${hovered === "game" ? "translate-x-2 opacity-100" : "translate-x-0 opacity-25"}`}
              >
                <Gamepad2 size={22} className={`transition-transform duration-300 ${hovered === "game" ? "-rotate-6" : "rotate-0"}`} />
              </span>
            </div>
          </button>

        </section>

        {/* ── FOOTER ── */}
        <footer className="mt-12 pt-5 border-t border-[#1a1a14] flex items-center justify-between text-[11px] text-[#3a3830] tracking-widest uppercase">
          <span>hanzfernando.dev</span>
          <span>© 2025</span>
        </footer>

      </div>
    </main>
  );
};

export default SelectionPage;