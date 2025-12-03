import prisma from "@/lib/prisma";
import Link from "next/link";
import { AvailabilityStatus } from "@prisma/client";

// Shape of searchParams as Next actually passes it
type SearchParams = Record<string, string | string[] | undefined>;

function normalizeParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }
  return undefined;
}

export default async function VehiclesPage(props: { searchParams?: Promise<SearchParams> }) {
  const searchParams  = (await props.searchParams) ?? {};

  // ── Read & normalize filters ────────────────────────────────
  const rawBrand = normalizeParam(searchParams["brand"]);
  const rawDealer = normalizeParam(searchParams["dealershipId"]);
  const rawAvailability = normalizeParam(searchParams["availability"]);

  const brandFilter = rawBrand || undefined;

  const dealershipFilter =
    rawDealer && !isNaN(Number(rawDealer)) ? Number(rawDealer) : undefined;

  const availabilityFilter: AvailabilityStatus | undefined =
    rawAvailability &&
    (rawAvailability === "AVAILABLE" ||
      rawAvailability === "RESERVED" ||
      rawAvailability === "SOLD")
      ? (rawAvailability as AvailabilityStatus)
      : undefined;

  // ── Fetch data ─────────────────────────────────────────────
  const [vehicles, dealerships] = await Promise.all([
    prisma.vehicle.findMany({
      where: {
        brand: brandFilter
          ? { contains: brandFilter, mode: "insensitive" }
          : undefined,
        dealershipId: dealershipFilter,
        availability: availabilityFilter,
      },
      orderBy: { createdAt: "desc" },
      include: {
        dealership: true,
        reservedByUser: true,
      },
    }),
    prisma.dealership.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  // ── UI ─────────────────────────────────────────────────────
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Inventario</h1>

      {/* Filter bar */}
      <form className="flex flex-wrap gap-4 mb-6" method="GET">
        <input
          name="brand"
          placeholder="Marca"
          defaultValue={brandFilter ?? ""}
          className="bg-neutral-800 p-2 rounded text-sm"
        />

        <select
          name="dealershipId"
          defaultValue={dealershipFilter ?? ""}
          className="bg-neutral-800 p-2 rounded text-sm"
        >
          <option value="">Concesionario</option>
          {dealerships.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} — {d.city}
            </option>
          ))}
        </select>

        <select
          name="availability"
          defaultValue={availabilityFilter ?? ""}
          className="bg-neutral-800 p-2 rounded text-sm"
        >
          <option value="">Estado</option>
          <option value="AVAILABLE">Disponible</option>
          <option value="RESERVED">Reservado</option>
          <option value="SOLD">Vendido</option>
        </select>

        <button
          type="submit"
          className="px-4 py-2 bg-neutral-700 rounded text-sm hover:bg-neutral-600 transition"
        >
          Filtrar
        </button>

        <Link
          href="/admin/vehicles"
          className="px-4 py-2 bg-neutral-800 rounded text-sm hover:bg-neutral-700 transition"
        >
          Limpiar
        </Link>
      </form>

      {/* Add vehicle button */}
      <div className="flex justify-end mb-6">
        <Link
          href="/admin/vehicles/new"
          className="px-4 py-2 bg-neutral-800 rounded-md hover:bg-neutral-700 transition"
        >
          Añadir vehículo
        </Link>
      </div>

      {/* Vehicle cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {vehicles.map((v) => (
          <div
            key={v.id}
            className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden"
          >
            {/* Thumbnail */}
            <div className="w-full h-48 bg-neutral-800">
              {v.thumbnailUrl ? (
                <img
                  src={v.thumbnailUrl}
                  alt={`${v.brand} ${v.model}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-600 text-sm">
                  Sin imagen
                </div>
              )}
            </div>

            {/* Card content */}
            <div className="p-5 flex flex-col gap-2">
              <p className="text-lg font-semibold">
                {v.brand} {v.model}
                {v.variant ? ` ${v.variant}` : ""} ({v.year})
              </p>

              {/* Availability badge */}
              <span
                className={`text-xs px-2 py-1 rounded font-medium w-fit ${
                  v.availability === "AVAILABLE"
                    ? "bg-green-700/20 text-green-400"
                    : v.availability === "RESERVED"
                    ? "bg-yellow-700/20 text-yellow-400"
                    : "bg-red-700/20 text-red-400"
                }`}
              >
                {v.availability === "AVAILABLE"
                  ? "Disponible"
                  : v.availability === "RESERVED"
                  ? "Reservado"
                  : "Vendido"}
              </span>

              {/* Price */}
              <p className="text-neutral-300 mt-1 text-sm">
                {new Intl.NumberFormat("es-ES", {
                  style: "currency",
                  currency: v.currency ?? "EUR",
                }).format(v.price)}
              </p>

              {/* Dealership */}
              <p className="text-neutral-500 text-xs">
                {v.dealership?.name ?? "—"}
              </p>

              {/* Reservation info */}
              {v.availability === "RESERVED" && v.reservedByUser && (
                <p className="text-xs text-yellow-400 mt-1">
                  Reservado por: {v.reservedByUser.name ?? v.reservedByUser.email}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-4">
                <Link
                  href={`/admin/vehicles/${v.id}`}
                  className="px-3 py-1 bg-neutral-800 rounded hover:bg-neutral-700 transition text-sm"
                >
                  Editar
                </Link>

                <form
                  action={`/api/admin/vehicles/${v.id}/delete`}
                  method="POST"
                >
                  <button
                    type="submit"
                    className="px-3 py-1 bg-red-800 rounded hover:bg-red-700 transition text-sm"
                  >
                    Eliminar
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>

      {vehicles.length === 0 && (
        <p className="text-neutral-500 mt-10 text-sm">
          No hay vehículos que coincidan con los filtros.
        </p>
      )}
    </div>
  );
}
