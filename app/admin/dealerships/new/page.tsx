import { createDealership } from "./action";

export default function NewDealershipPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">
        Añadir Concesionario
      </h1>

      <form
        action={createDealership}
        className="space-y-8 bg-neutral-900 p-8 rounded-lg border border-neutral-800 max-w-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-medium">Nombre</label>
            <input
              name="name"
              className="bg-neutral-800 p-2 rounded"
              placeholder="Timeless Motors Madrid"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium">Ciudad</label>
            <input
              name="city"
              className="bg-neutral-800 p-2 rounded"
              placeholder="Madrid"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium">Región</label>
            <input
              name="region"
              className="bg-neutral-800 p-2 rounded"
              placeholder="Comunidad de Madrid"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium">País</label>
            <input
              name="country"
              className="bg-neutral-800 p-2 rounded"
              placeholder="España"
              required
            />
          </div>
        </div>

        {/* Coordinates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-medium">Latitud</label>
            <input
              name="latitude"
              type="number"
              step="any"
              className="bg-neutral-800 p-2 rounded"
              placeholder="40.4168"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium">Longitud</label>
            <input
              name="longitude"
              type="number"
              step="any"
              className="bg-neutral-800 p-2 rounded"
              placeholder="-3.7038"
              required
            />
          </div>
        </div>

        {/* Helper note */}
        <div className="rounded border border-neutral-800 bg-neutral-950 p-4 text-sm text-neutral-400">
          Las coordenadas se utilizan para posicionar el concesionario
          en el mapa interactivo de búsqueda.
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded transition text-white"
        >
          Guardar concesionario
        </button>
      </form>
    </div>
  );
}
