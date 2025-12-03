"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AvailabilityStatus } from "@prisma/client";


// 🔥 The server action now lives INSIDE this file.
// This is the most stable way in Next.js 16.
export async function updateVehicle(formData: FormData) {

  const id = Number(formData.get("id"));

  const dealershipId = Number(formData.get("dealershipId"));
  const brand = formData.get("brand") as string;
  const model = formData.get("model") as string;
  const variant = formData.get("variant") as string | null;
  const year = Number(formData.get("year"));
  const price = Number(formData.get("price"));

  const availabilityRaw = formData.get("availability") as string | null;

  const availability =
    availabilityRaw &&
    ["AVAILABLE", "RESERVED", "SOLD"].includes(availabilityRaw)
        ? (availabilityRaw as AvailabilityStatus)
        : null;


  // Reserved fields (optional)
  const reservedByUserId =
    formData.get("reservedByUserId") &&
    Number(formData.get("reservedByUserId"));

  const reservedUntilRaw = formData.get("reservedUntil") as string | null;
  const reservedUntil = reservedUntilRaw
    ? new Date(reservedUntilRaw)
    : null;

  // 🔥 Basic update
  await prisma.vehicle.update({
    where: { id },
    data: {
      dealershipId,
      brand,
      model,
      variant,
      year,
      price,
      availability: availability ?? undefined,
      reservedByUserId: reservedByUserId || null,
      reservedUntil,
    },
  });

  redirect(`/admin/vehicles/${id}`);
}

export default async function EditVehicle(props: {
  params: Promise<{ id: string }>;
}) {
  // Await params (Next 16 requirement)
  const { id: idParam } = await props.params;
  const id = Number(idParam);

  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      media: true,
      reservedByUser: true,
      dealership: true,
    },
  });

  if (!vehicle) redirect("/admin/vehicles");

  const dealerships = await prisma.dealership.findMany();

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">
        Editar: {vehicle.brand} {vehicle.model}
      </h1>

      {/* 🔥 IMPORTANT: the server action is now passed directly */}
      <form action={updateVehicle} className="space-y-8 bg-neutral-900 p-8 rounded-lg border border-neutral-800">
        {/* Hidden ID */}
        <input type="hidden" name="id" value={id} />

        {/* Dealership */}
        <div>
          <label>Concesionario</label>
          <select
            name="dealershipId"
            defaultValue={vehicle.dealershipId}
            className="bg-neutral-800 p-2 rounded"
          >
            {dealerships.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Basic fields */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label>Marca</label>
            <input
              name="brand"
              defaultValue={vehicle.brand}
              className="bg-neutral-800 p-2 rounded"
            />
          </div>

          <div>
            <label>Modelo</label>
            <input
              name="model"
              defaultValue={vehicle.model}
              className="bg-neutral-800 p-2 rounded"
            />
          </div>

          <div>
            <label>Variante</label>
            <input
              name="variant"
              defaultValue={vehicle.variant || ""}
              className="bg-neutral-800 p-2 rounded"
            />
          </div>

          <div>
            <label>Año</label>
            <input
              type="number"
              name="year"
              defaultValue={vehicle.year}
              className="bg-neutral-800 p-2 rounded"
            />
          </div>
        </div>

        {/* Price */}
        <div>
          <label>Precio</label>
          <input
            type="number"
            step="0.01"
            name="price"
            defaultValue={vehicle.price}
            className="bg-neutral-800 p-2 rounded"
          />
        </div>

        {/* Availability */}
        <div>
          <label>Disponibilidad</label>
          <select
            name="availability"
            defaultValue={vehicle.availability}
            className="bg-neutral-800 p-2 rounded"
          >
            <option value="AVAILABLE">Disponible</option>
            <option value="RESERVED">Reservado</option>
            <option value="SOLD">Vendido</option>
          </select>
        </div>

        {/* Reservation details */}
        {vehicle.availability === "RESERVED" && (
          <div className="space-y-4">
            <div>
              <label>ID Usuario Reserva</label>
              <input
                name="reservedByUserId"
                defaultValue={vehicle.reservedByUserId || ""}
                className="bg-neutral-800 p-2 rounded"
              />
            </div>

            <div>
              <label>Reservado hasta:</label>
              <input
                type="date"
                name="reservedUntil"
                defaultValue={
                  vehicle.reservedUntil
                    ? vehicle.reservedUntil.toISOString().slice(0, 10)
                    : ""
                }
                className="bg-neutral-800 p-2 rounded"
              />
            </div>
          </div>
        )}

        <button className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded">
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
