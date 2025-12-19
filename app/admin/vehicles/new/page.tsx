import prisma from "@/lib/prisma";
import { createVehicle } from "./action";

export default async function NewVehiclePage() {
  const dealerships = await prisma.dealership.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">Añadir vehículo</h1>

      <form
        action={createVehicle}
        className="space-y-10 bg-neutral-900 p-8 rounded-lg border border-neutral-800"
      >

        <div className="flex flex-col gap-2">
          <label className="font-medium">Concesionario</label>
          <select
            name="dealershipId"
            required
            className="bg-neutral-800 p-2 rounded"
          >
            <option value="">Selecciona…</option>
            {dealerships.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} — {d.city}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="brand" required placeholder="Marca" className="bg-neutral-800 p-2 rounded" />
          <input name="model" required placeholder="Modelo" className="bg-neutral-800 p-2 rounded" />
          <input name="variant" placeholder="Variante" className="bg-neutral-800 p-2 rounded" />
          <input name="year" type="number" required placeholder="Año" className="bg-neutral-800 p-2 rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="price" type="number" step="0.01" required placeholder="Precio (€)" className="bg-neutral-800 p-2 rounded" />
          <input name="currency" defaultValue="EUR" disabled className="bg-neutral-700 p-2 rounded text-neutral-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input name="firstRegistration" type="number" placeholder="Primera matriculación" className="bg-neutral-800 p-2 rounded" />
          <input name="previousOwners" type="number" placeholder="Propietarios anteriores" className="bg-neutral-800 p-2 rounded" />
          <input name="itvValidUntil" type="date" className="bg-neutral-800 p-2 rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="vin" placeholder="VIN" className="bg-neutral-800 p-2 rounded" />
          <input name="stockNumber" placeholder="Nº de stock" className="bg-neutral-800 p-2 rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <select name="condition" className="bg-neutral-800 p-2 rounded">
            <option value="USED">Usado</option>
            <option value="NEW">Nuevo</option>
            <option value="DEMO">Demo</option>
          </select>

          <input name="mileageKm" type="number" placeholder="Kilometraje (km)" className="bg-neutral-800 p-2 rounded" />

          <select name="availability" className="bg-neutral-800 p-2 rounded">
            <option value="AVAILABLE">Disponible</option>
            <option value="RESERVED">Reservado</option>
            <option value="SOLD">Vendido</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input name="warrantyType" placeholder="Tipo de garantía" className="bg-neutral-800 p-2 rounded" />
          <input name="warrantyExpiry" type="date" className="bg-neutral-800 p-2 rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="heroTitle" placeholder="Hero title" className="bg-neutral-800 p-2 rounded" />
          <input name="heroSubtitle" placeholder="Hero subtitle" className="bg-neutral-800 p-2 rounded" />
        </div>

        <input name="heroVideoUrl" placeholder="Hero video URL" className="bg-neutral-800 p-2 rounded" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="heroTaglineTitle" placeholder="Tagline título" className="bg-neutral-800 p-2 rounded" />
          <textarea name="heroTaglineBody" rows={2} className="bg-neutral-800 p-2 rounded resize-none" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <input name="highlight_0_100_s" type="number" step="0.01" placeholder="0–100 (s)" className="bg-neutral-800 p-2 rounded" />
          <input name="highlight_power_hp" type="number" placeholder="Potencia HP" className="bg-neutral-800 p-2 rounded" />
          <input name="highlight_power_kw" type="number" placeholder="Potencia kW" className="bg-neutral-800 p-2 rounded" />
          <input name="highlight_top_speed" type="number" placeholder="Velocidad punta" className="bg-neutral-800 p-2 rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input name="engineConfiguration" placeholder="Configuración motor" className="bg-neutral-800 p-2 rounded" />
          <input name="engineArchitecture" placeholder="Arquitectura" className="bg-neutral-800 p-2 rounded" />
          <input name="engineDisplacementL" type="number" step="0.1" placeholder="Cilindrada (L)" className="bg-neutral-800 p-2 rounded" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <input name="enginePowerHp" type="number" placeholder="HP motor" className="bg-neutral-800 p-2 rounded" />
          <input name="engineTorqueNm" type="number" placeholder="Par Nm" className="bg-neutral-800 p-2 rounded" />
          <input name="engineMaxRpm" type="number" placeholder="RPM máx" className="bg-neutral-800 p-2 rounded" />
          <input name="transmissionType" placeholder="Transmisión" className="bg-neutral-800 p-2 rounded" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <input name="lengthMm" type="number" placeholder="Largo (mm)" className="bg-neutral-800 p-2 rounded" />
          <input name="widthMm" type="number" placeholder="Ancho (mm)" className="bg-neutral-800 p-2 rounded" />
          <input name="heightMm" type="number" placeholder="Alto (mm)" className="bg-neutral-800 p-2 rounded" />
          <input name="wheelbaseMm" type="number" placeholder="Batalla (mm)" className="bg-neutral-800 p-2 rounded" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <input name="batteryEnergyKwh" type="number" step="0.1" placeholder="Batería (kWh)" className="bg-neutral-800 p-2 rounded" />
          <input name="batteryPowerPeakKw" type="number" placeholder="Potencia pico (kW)" className="bg-neutral-800 p-2 rounded" />
          <input name="electricRangeWltpKm" type="number" placeholder="Autonomía WLTP (km)" className="bg-neutral-800 p-2 rounded" />
          <input name="batteryCooling" placeholder="Refrigeración batería" className="bg-neutral-800 p-2 rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input name="bodyType" placeholder="Carrocería" className="bg-neutral-800 p-2 rounded" />
          <input name="exteriorColor" placeholder="Color exterior" className="bg-neutral-800 p-2 rounded" />
          <input name="interiorColor" placeholder="Color interior" className="bg-neutral-800 p-2 rounded" />
        </div>

        <input name="upholstery" placeholder="Tapicería" className="bg-neutral-800 p-2 rounded" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <select name="fuelType" className="bg-neutral-800 p-2 rounded">
            <option value="">Combustible</option>
            <option value="PETROL">Gasolina</option>
            <option value="DIESEL">Diésel</option>
            <option value="HYBRID">Híbrido</option>
            <option value="ELECTRIC">Eléctrico</option>
            <option value="OTHER">Otro</option>
          </select>

          <select name="driveType" className="bg-neutral-800 p-2 rounded">
            <option value="">Tracción</option>
            <option value="FWD">FWD</option>
            <option value="RWD">RWD</option>
            <option value="AWD">AWD</option>
            <option value="FOUR_WD">4WD</option>
          </select>
        </div>

        <textarea name="optionsSummary" rows={3} placeholder="Equipamiento / opciones"
          className="bg-neutral-800 p-2 rounded resize-none" />

        <textarea name="description" rows={5} placeholder="Descripción completa"
          className="bg-neutral-800 p-2 rounded resize-none" />

        <div className="rounded border border-neutral-800 bg-neutral-950 p-4 text-sm text-neutral-400">
          La carga de imágenes y vídeos no está disponible actualmente desde la
          interfaz de administración.  
          Los recursos multimedia se añaden manualmente al proyecto.  
          Como mejora futura, se prevé integrar almacenamiento externo
          (Vercel Blob o Cloudflare R2) para permitir subidas directas en
          entornos serverless.
        </div> 

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