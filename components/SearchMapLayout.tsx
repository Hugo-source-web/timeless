"use client";

import { useState } from "react";
import DealershipMap, { Dealership } from "./DealershipMap";

export default function SearchMapLayout() {
  const [selectedDealer, setSelectedDealer] = useState<Dealership | null>(null);
  const mapDocked = !!selectedDealer;

  return (
    <div className="relative h-[calc(100vh-4rem)] overflow-hidden">
      {/* MAP CONTAINER (animates between full-screen and docked left) */}

      {/* RIGHT OVERLAY – only when a dealer is selected */}


      {/* MOBILE overlay (bottom sheet style) */}
      {selectedDealer && (
        <div
          className={`
            md:hidden
            absolute bottom-0 left-0 right-0
            max-h-[50%]
            bg-black/80 backdrop-blur-xl border-t border-white/10
            text-white
            rounded-t-2xl
            transition-transform duration-500 ease-in-out
            ${mapDocked ? "translate-y-0" : "translate-y-full"}
          `}
        >
          <div className="px-4 py-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">{selectedDealer.name}</h2>
              <p className="text-xs text-white/60">{selectedDealer.city}, Spain</p>
            </div>
            <button
              onClick={() => setSelectedDealer(null)}
              className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs"
            >
              Close
            </button>
          </div>

          <div className="px-4 pb-4 text-xs text-white/60">
            Mobile view – car list goes here later.
          </div>
        </div>
      )}
    </div>
  );
}
