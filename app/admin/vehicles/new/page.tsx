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

        {/* Thumbnail */}
        <div className="flex flex-col gap-2">
          <label className="font-medium">Miniatura (opcional)</label>
          <input
            name="thumbnail"
            type="file"
            accept="image/*"
            className="bg-neutral-800 p-2 rounded"
          />
          <p className="text-xs text-neutral-500">
            Si no se selecciona, se usará la primera imagen como miniatura.
          </p>
        </div>

        {/* Images */}
        <div className="flex flex-col gap-2">
          <label className="font-medium">Imágenes</label>
          <input
            name="images"
            type="file"
            accept="image/*"
            multiple
            className="bg-neutral-800 p-2 rounded"
            required
          />
          <p className="text-xs text-neutral-500">
            Selecciona varias imágenes para la galería del vehículo.
          </p>
        </div>

        {/* Video */}
        <div className="flex flex-col gap-2">
          <label className="font-medium">Video (opcional)</label>
          <input
            name="video"
            type="file"
            accept="video/*"
            className="bg-neutral-800 p-2 rounded"
          />
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
