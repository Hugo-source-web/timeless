"use client";

import { useState } from "react";
import { timelessFont } from "@/app/fonts/timeless";

export default function Footer() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  return (
    <footer
      className="relative w-full bg-[#0d0d0d] text-gray-300 pt-12 px-6 overflow-hidden group"
    >
      {/* --- REGION ROW --- */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-12">
        <div className="flex items-center gap-3">
          🇪🇸 <span>España / Español</span>
        </div>
        <button className="text-sm underline hover:text-white">Cambiar</button>
      </div>

      {/* --- TOP GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mb-12">
        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-2 text-white">Ubicación y contacto</h3>
          <p className="text-sm mb-3">¿Preguntas?</p>
          <button className="px-6 py-2 bg-white text-black rounded hover:bg-gray-200 text-sm">
            Ponte en contacto
          </button>
        </div>

        {/* Social */}
        <div>
          <h3 className="font-semibold mb-2 text-white">Redes Sociales</h3>
          <p className="text-sm mb-3 w-56">
            Ponte en contacto con nosotros a través de las redes sociales.
          </p>
          <div className="flex gap-3">
            {["F", "I", "P", "Y", "X", "L"].map((letter) => (
              <div
                key={letter}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center cursor-pointer"
              >
                <span className="text-white text-sm">{letter}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Company */}
        <div className="grid grid-cols-1 text-sm gap-2">
          <p className="font-semibold text-white">Empresa</p>
          <button className="hover:text-white text-left">Timeless Motors</button>
          <button className="hover:text-white text-left">Compliance</button>
          <button className="hover:text-white text-left">Empleo</button>
          <button className="hover:text-white text-left">Sostenibilidad</button>
          <button className="hover:text-white text-left">Newsroom</button>
        </div>
      </div>

      {/* --- LEGAL --- */}
      <div className="text-[11px] leading-relaxed text-gray-400 border-t border-white/10 pt-6">
        © 2025 Timeless Motors. All rights reserved.  
        <br />Aviso Legal · Cookies · Privacidad · Accesibilidad · EU Data Act
      </div>

      {/* --- REFLECTIVE BOTTOM AREA --- */}
        <div
        className="relative w-full h-[350px] flex items-end justify-center pb-4 mt-15"
        onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            });
        }}
        >
        {/* Hidden base text */}
            <div
                className={`
                ${timelessFont.className}
                absolute bottom-0 left-1/2 -translate-x-1/2
                text-[9rem] font-bold tracking-[0.5em]
                text-[#0d0d0d] select-none
                `}
            >
                TIMELESS
            </div>

        {/* Reflective spotlight layer */}
            <div
                className={`
                ${timelessFont.className}
                absolute bottom-0 left-1/2 -translate-x-1/2
                text-[9rem] font-bold tracking-[0.5em]
                pointer-events-none select-none
                text-transparent bg-clip-text
                bg-gradient-to-r from-white/40 to-white/10
                mix-blend-screen
                transition-opacity duration-300
                opacity-0 group-hover:opacity-100
                `}
                style={{
                maskImage: `radial-gradient(500px at ${mousePos.x}px ${mousePos.y}px, white 0%, transparent 75%)`,
                WebkitMaskImage: `radial-gradient(500px at ${mousePos.x}px ${mousePos.y}px, white 0%, transparent 75%)`,
                }}
            >
                TIMELESS
            </div>
        </div>
    </footer>
  );
}
