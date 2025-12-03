"use client";

import { useState, useEffect } from "react";

export default function BrandModelSelector({
  brands,
  allVehicles,
  initialBrand,
  initialModel,
  onBrandChange,
  onModelChange,
}: {
  brands: string[];
  allVehicles: { brand: string; model: string; thumbnailUrl: string | null }[];
  initialBrand: string;
  initialModel: string;
  onBrandChange: (v: string) => void;
  onModelChange: (v: string) => void;
}) {

  const [brand, setBrand] = useState(initialBrand);
  const [model, setModel] = useState(initialModel);

  const models = allVehicles
    .filter((v) => v.brand === brand)
    .map((v) => v.model);

  // Auto-reset model if it doesn’t exist under the new brand
    useEffect(() => {
    if (!models.includes(model)) {
        const firstModel = models[0];    // ← pick first valid model
        setModel(firstModel);            // ← update local state
        onModelChange(firstModel);       // ← notify parent (HeroImageSwitcher)
    }
    }, [brand]);


  return (
    <div className="w-full max-w-3xl flex flex-col md:flex-row gap-6 text-white">
      {/* BRAND */}
      <div className="w-full">
        <label className="block text-sm mb-1 text-white">Marca *</label>
        <select
          value={brand}
          onChange={(e) => {setBrand(e.target.value);  onBrandChange(e.target.value);}}
          className="w-full border border-white/20 bg-[#181818] px-4 py-3 rounded-md text-white"
        >
          {brands.map((b) => (
            <option key={b} value={b} className="bg-[#181818] text-white">
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* MODEL */}
      <div className="w-full">
        <label className="block text-sm mb-1 text-white">Modelo *</label>
        <select
          value={model}
          onChange={(e) => {setModel(e.target.value); onModelChange(e.target.value);}}
          className="w-full border border-white/20 bg-[#181818] px-4 py-3 rounded-md text-white"
        >
          {models.map((m) => (
            <option key={m} value={m} className="bg-[#181818] text-white">
              {m}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
