"use client";

import { useRouter } from "next/navigation";

export default function VehicleActions({
  slug,
  availability,
}: {
  slug: string;
  availability: "AVAILABLE" | "RESERVED" | "SOLD";
}) {
  const router = useRouter();

  if (availability === "RESERVED") {
    return (
      <div className="flex justify-center mt-10">
        <button
          disabled
          className="
            w-full max-w-xl
            px-10 py-5
            rounded-md
            bg-gray-200
            text-gray-600
            text-lg font-semibold
            cursor-not-allowed
          "
        >
          Este vehículo ha sido reservado
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-6 justify-center mt-10">
      <button
        onClick={() => router.push(`/vehiculos/${slug}/contacto`)}
        className="px-10 py-4 rounded-md border border-white text-lg hover:bg-white hover:text-black transition"
      >
        Solicitar prueba
      </button>

      <button
        onClick={() => router.push(`/vehiculos/${slug}/adquirir`)}
        className="px-10 py-4 rounded-md bg-white text-black text-lg font-semibold hover:bg-gray-200 transition"
      >
        Adquirir vehículo
      </button>

      <button
        onClick={() => router.push(`/contacto`)}
        className="px-10 py-4 rounded-md border border-gray-400 text-lg hover:bg-white/10 transition"
      >
        Contactar
      </button>
    </div>
  );
}
