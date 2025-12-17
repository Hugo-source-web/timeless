import { createDealership } from "./action";

export default function NewDealershipPage() {
  return (
    <form
      action={createDealership}
      className="max-w-xl space-y-6 bg-neutral-900 p-6 rounded-lg border border-neutral-800"
    >
      <h1 className="text-xl font-semibold">Nuevo concesionario</h1>

      <input name="name" placeholder="Nombre" required className="input" />
      <input name="city" placeholder="Ciudad" required className="input" />
      <input name="region" placeholder="Región" className="input" />
      <input name="country" placeholder="País" required className="input" />
      <input
        name="latitude"
        type="number"
        step="any"
        placeholder="Latitud"
        required
        className="input"
      />
      <input
        name="longitude"
        type="number"
        step="any"
        placeholder="Longitud"
        required
        className="input"
      />

      <button className="px-4 py-2 bg-neutral-700 rounded hover:bg-neutral-600">
        Guardar
      </button>
    </form>
  );
}
