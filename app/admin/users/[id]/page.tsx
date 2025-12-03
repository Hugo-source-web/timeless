"use server";

import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { updateRole, toggleDisabled, deleteUser } from "../page";

export default async function UserDetail(props: {
  params: Promise<{ id: string }>;
}) {
  const { id: idParam } = await props.params;
  const id = Number(idParam);

  // Protect invalid URLs
  if (Number.isNaN(id)) redirect("/admin/users");

  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id
    ? Number(session.user.id)
    : null;

  /* ──────────────────────────────────────────────
     Fetch user with reservations
  ────────────────────────────────────────────── */

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      reservedVehicles: {
        include: {
          dealership: true,
        },
      },
    },
  });

  if (!user) redirect("/admin/users");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">
        Usuario #{user.id}
      </h1>

      {/* BACK BUTTON */}
      <Link
        href="/admin/users"
        className="inline-block mb-6 text-neutral-400 hover:text-white text-sm"
      >
        ← Volver al listado
      </Link>

      {/* USER CARD */}
      <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg space-y-4 mb-10">
        <p>
          <strong>Nombre:</strong> {user.name || "(Sin nombre)"}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Rol:</strong> {user.role}
        </p>
        <p>
          <strong>Estado:</strong>{" "}
          {user.disabled ? (
            <span className="text-yellow-400">Inactivo</span>
          ) : (
            <span className="text-green-400">Activo</span>
          )}
        </p>
        <p>
          <strong>Fecha de registro:</strong>{" "}
          {user.createdAt.toLocaleDateString()}
        </p>

        <p>
          <strong>Reservas realizadas:</strong>{" "}
          {user.reservedVehicles.length}
        </p>

        {/* Role change */}
        <form action={updateRole} className="flex gap-3 items-center pt-3">
          <input type="hidden" name="id" value={user.id} />

          <select
            name="role"
            defaultValue={user.role}
            className="bg-neutral-800 p-2 rounded text-sm"
          >
            <option value="CUSTOMER">CUSTOMER</option>
            <option value="EMPLOYEE">EMPLOYEE</option>
            <option value="ADMIN">ADMIN</option>
          </select>

          <button
            type="submit"
            className="px-4 py-2 bg-neutral-700 rounded hover:bg-neutral-600 text-sm"
          >
            Cambiar rol
          </button>
        </form>

        {/* Toggle Active/Inactive */}
        <form action={toggleDisabled} className="pt-2">
          <input type="hidden" name="id" value={user.id} />
          <input
            type="hidden"
            name="current"
            value={String(user.disabled)}
          />

          <button
            type="submit"
            className={`px-4 py-2 rounded text-sm ${
              user.disabled
                ? "bg-green-700 hover:bg-green-600"
                : "bg-yellow-700 hover:bg-yellow-600"
            }`}
          >
            {user.disabled ? "Activar cuenta" : "Desactivar cuenta"}
          </button>
        </form>

        {/* Delete (only if not yourself) */}
        {user.id !== currentUserId && (
          <form action={deleteUser} className="pt-2">
            <input type="hidden" name="id" value={user.id} />

            <button
              type="submit"
              className="px-4 py-2 bg-red-800 hover:bg-red-700 rounded text-sm"
            >
              Eliminar usuario
            </button>
          </form>
        )}
      </div>

      {/* RESERVED VEHICLES */}
      <h2 className="text-2xl font-semibold mb-4">
        Vehículos reservados
      </h2>

      {user.reservedVehicles.length === 0 && (
        <p className="text-neutral-500 text-sm">
          Este usuario no ha reservado ningún vehículo.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {user.reservedVehicles.map((v) => (
          <Link
            key={v.id}
            href={`/admin/vehicles/${v.id}`}
            className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 hover:bg-neutral-800 transition"
          >
            <p className="text-lg font-semibold">
              {v.brand} {v.model}
            </p>
            <p className="text-neutral-400 text-sm">{v.variant}</p>
            <p className="text-neutral-500 text-xs mt-1">
              Concesionario: {v.dealership?.name}
            </p>
            <p className="text-neutral-500 text-xs">
              Año: {v.year}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
