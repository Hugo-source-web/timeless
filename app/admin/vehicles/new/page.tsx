import prisma from "@/lib/prisma";
import { createVehicle } from "./action";

export default async function NewVehiclePage() {
  const dealerships = await prisma.dealership.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">Añadir Vehículo</h1>

      <form
        action={createVehicle}
        className="space-y-8 bg-neutral-900 p-8 rounded-lg border border-neutral-800"
      >
        {/* Dealership */}
        <div className="flex flex-col gap-2">
          <label className="font-medium">Concesionario</label>
          <select
            name="dealershipId"
            className="bg-neutral-800 p-2 rounded"
            required
          >
            <option value="">Selecciona...</option>
            {dealerships.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} — {d.city}
              </option>
            ))}
          </select>
        </div>

        {/* Basics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-medium">Marca</label>
            <input
              name="brand"
              className="bg-neutral-800 p-2 rounded"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium">Modelo</label>
            <input
              name="model"
              className="bg-neutral-800 p-2 rounded"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium">Variante</label>
            <input
              name="variant"
              className="bg-neutral-800 p-2 rounded"
              placeholder="Turbo S, Performance, etc."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium">Año</label>
            <input
              name="year"
              type="number"
              className="bg-neutral-800 p-2 rounded"
              required
            />
          </div>
        </div>

        {/* Price */}
        <div className="flex flex-col gap-2">
          <label className="font-medium">Precio (€)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            className="bg-neutral-800 p-2 rounded"
            required
          />
        </div>

        {/* Media notice */}
        <div className="rounded border border-neutral-800 bg-neutral-950 p-4 text-sm text-neutral-400">
          La carga de imágenes y vídeos no está disponible actualmente desde la
          interfaz de administración.  
          Los recursos multimedia se añaden manualmente al proyecto.  
          Como mejora futura, se prevé integrar almacenamiento externo
          (Vercel Blob o Cloudflare R2) para permitir subidas directas en
          entornos serverless.
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded transition text-white"
        >
          Guardar vehículo
        </button>
      </form>
    </div>
  );
}
