"use client";

import { useState } from "react";
import HeroImageSwitcher from "@/components/HeroImageSwitcher";
import ContactFormSubmit from "@/components/ContactFormSubmit";

export default function ContactClientWrapper({
  vehicle,
  allVehicles,
  brands,
}: {
  vehicle: {
    brand: string;
    model: string;
    thumbnailUrl: string | null;
  };
  allVehicles: { brand: string; model: string; thumbnailUrl: string | null }[];
  brands: string[];
}) {
  const [selectedBrand, setSelectedBrand] = useState(vehicle.brand);
  const [selectedModel, setSelectedModel] = useState(vehicle.model);

  return (
    <>
      <HeroImageSwitcher
        defaultImage={vehicle.thumbnailUrl ?? "/placeholder.jpg"}
        allVehicles={allVehicles}
        initialBrand={vehicle.brand}
        initialModel={vehicle.model}
        brands={brands}
        onBrandChange={setSelectedBrand}
        onModelChange={setSelectedModel}
      />

      <div className="w-full flex flex-col items-center mt-14 text-white">
        <ContactFormSubmit 
          brand={selectedBrand}
          model={selectedModel}
        />

        <p className="mt-4 text-white/40 text-sm">
          Los campos marcados con * son obligatorios
        </p>
      </div>
    </>
  );
}
