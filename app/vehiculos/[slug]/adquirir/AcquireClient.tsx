"use client";

import { useState } from "react";
import { neue2, neue6 } from "@/public/fonts/neuePlak";

export default function AcquireClient({ vehicle }: any) {
  const [confirmed, setConfirmed] = useState(false);

  const reservationPercent = 0.05;
  const reservationAmount = Math.round(vehicle.price * reservationPercent);
  const remainingAmount = vehicle.price - reservationAmount;

  const heroImage = vehicle.media?.[0]?.url ?? "/placeholder.jpg";

  if (confirmed) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-xl text-center space-y-6">
          <h1 className={`${neue6.className} text-4xl`}>
            Solicitud registrada
          </h1>

          <p className="text-gray-600">
            Un asesor de {vehicle.dealership.name} se pondrá en contacto contigo
            para continuar el proceso de adquisición.
          </p>

          <p className="text-sm text-gray-400">
            Referencia: TM-{Math.floor(Math.random() * 1_000_000)}
          </p>

          <a
            href={`/vehiculos/${vehicle.slug}`}
            className="inline-block mt-6 px-8 py-3 border border-black rounded-md hover:bg-black hover:text-white transition"
          >
            Volver al vehículo
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className={`${neue2.className} text-5xl text-black md:text-6xl`}>
            Adquirir vehículo
          </h1>

          <p className="text-gray-600 text-lg">
            Reserva este vehículo mediante un pago inicial.
          </p>

          <p className="text-sm text-gray-400">
            * Proceso simulado. No se realizan pagos reales.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* ───── LEFT: Vehicle + Pricing ───── */}
          <div className="space-y-10 text-black">
            <img
              src={heroImage}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="rounded-lg w-full object-cover"
            />

            <div className="space-y-6">
              <div>
                <h2 className={`${neue6.className} text-3xl`}>
                  {vehicle.brand} {vehicle.model}
                </h2>

                <p className="text-gray-500 mt-1">
                  {vehicle.year} · {vehicle.dealership.name}
                </p>
              </div>

              <div className="border-t pt-6 space-y-3 text-lg">
                <div className="flex justify-between font-semibold">
                  <span>Precio total</span>
                  <span className="font-semibold">
                    {vehicle.price.toLocaleString("es-ES")} €
                  </span>
                </div>

                <div className="flex justify-between font-semibold">
                  <span>Reserva inicial (5%)</span>
                  <span>
                    {reservationAmount.toLocaleString("es-ES")} €
                  </span>
                </div>

                <div className="flex justify-between text-gray-500 text-base">
                  <span>Pendiente en concesionario</span>
                  <span>
                    {remainingAmount.toLocaleString("es-ES")} €
                  </span>
                </div>
              </div>
            </div>
          </div>


          <div className="border border-gray-200 rounded-lg p-10 space-y-10 text-black">
            <h3 className={`${neue6.className} text-3xl text-black`}>
              Datos del solicitante
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setConfirmed(true);
              }}
              className="grid grid-cols-1 gap-6 placeholder-black"
            >
              <input
                required
                placeholder="Nombre"
                className="border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:border-black"
              />

              <input
                required
                placeholder="Apellidos"
                className="border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:border-black"
              />

              <input
                required
                type="email"
                placeholder="Correo electrónico"
                className="border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:border-black"
              />

              <input
                placeholder="Teléfono"
                className="border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:border-black"
              />

              <label className="flex items-center gap-2 text-sm text-gray-500">
                <input type="checkbox" required />
                Entiendo que este proceso es una simulación
              </label>

              <button
                type="submit"
                className="mt-6 px-10 py-4 border border-black rounded-md hover:bg-black hover:text-white transition"
              >
                Confirmar reserva (simulación)
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
