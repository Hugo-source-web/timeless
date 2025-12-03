"use client";

import { useState, useMemo, useEffect } from "react";
import BrandModelSelector from "./BrandModelSelector";

export default function HeroImageSwitcher({
  defaultImage,
  allVehicles,
  initialBrand,
  initialModel,
  brands,
  onBrandChange,
  onModelChange,
}: {
  defaultImage: string;
  allVehicles: { brand: string; model: string; thumbnailUrl: string | null }[];
  initialBrand: string;
  initialModel: string;
  brands: string[];
  onBrandChange: (v: string) => void;
  onModelChange: (v: string) => void;
}) {
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [selectedModel, setSelectedModel] = useState(initialModel);

  // --- EXPOSE CHANGES TO PARENT PAGE ---
  useEffect(() => {
    onBrandChange(selectedBrand);
  }, [selectedBrand]);

  useEffect(() => {
    onModelChange(selectedModel);
  }, [selectedModel]);

  const selectedVehicle = useMemo(() => {
    return (
      allVehicles.find(
        (v) =>
          v.brand === selectedBrand &&
          v.model === selectedModel
      ) || null
    );
  }, [selectedBrand, selectedModel, allVehicles]);

  const image = selectedVehicle?.thumbnailUrl ?? defaultImage;

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative w-full h-[80vh] overflow-hidden">
        <img
          src={image}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

        <div className="absolute bottom-10 left-10 text-left">
          <h2 className="text-4xl md:text-5xl text-white drop-shadow-2xl">
            Póngase en contacto con nosotros
          </h2>
        </div>
      </section>

      {/* BRAND + MODEL */}
      <section className="w-full flex flex-col items-center mt-20 px-6 text-white">
        <div className="w-full max-w-3xl text-center mb-10">
          <h1 className="text-4xl md:text-5xl">
            ¿En qué modelo está usted interesado?
          </h1>
        </div>

        <BrandModelSelector
          brands={brands}
          allVehicles={allVehicles}
          initialBrand={initialBrand}
          initialModel={initialModel}
          onBrandChange={setSelectedBrand}
          onModelChange={setSelectedModel}
        />
      </section>
    </>
  );
}
