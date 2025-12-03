"use server";

import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/* ──────────────────────────────────────────────
   SERVER ACTIONS
────────────────────────────────────────────── */

export async function updateRole(formData: FormData) {
  const id = Number(formData.get("id"));
  const newRole = formData.get("role") as UserRole;

  await prisma.user.update({
    where: { id },
    data: { role: newRole },
  });

  redirect("/admin/users");
}

export async function deleteUser(formData: FormData) {
  const id = Number(formData.get("id"));
  const session = await getServerSession(authOptions);

  if (!session) throw new Error("No session.");
  const currentUserId = Number(session.user.id);

  // Prevent self-deletion ⭐
  if (id === currentUserId) {
    throw new Error("No puedes eliminar tu propia cuenta.");
  }

  await prisma.user.delete({ where: { id } });
  redirect("/admin/users");
}

export async function toggleDisabled(formData: FormData) {
  const id = Number(formData.get("id"));
  const current = formData.get("current") === "true";

  await prisma.user.update({
    where: { id },
    data: { disabled: !current },
  });

  redirect("/admin/users");
}

/* ──────────────────────────────────────────────
   PAGE COMPONENT
────────────────────────────────────────────── */

export default async function UsersPage(props: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id
    ? Number(session.user.id)
    : null;

  const searchParams = (await props.searchParams) ?? {};

  /* ── Extract query params safely ───────────────────── */

  const getParam = (name: string): string | undefined => {
    const val = searchParams[name];
    if (Array.isArray(val)) return val[0];
    if (typeof val === "string" && val.trim() !== "") return val.trim();
    return undefined;
  };

  const q = getParam("q");

  const limit = Number(getParam("limit")) || 10;
  const page = Number(getParam("page")) || 1;
  const skip = (page - 1) * limit;

  const sortRaw = getParam("sort") || "createdAt-desc";
  const [sortField, sortDirection] = sortRaw.split("-");

  /* ── Fetch users ───────────────────────────────────── */

  const users = await prisma.user.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: {
      reservedVehicles: true,
    },
    orderBy: {
      [sortField]: sortDirection,
    },
    skip,
    take: limit,
  });

  /* ─────────────────────────────────────────────────── */

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Usuarios</h1>

      {/* SEARCH BAR */}
      <form method="GET" className="mb-6 flex gap-4 items-center">
        <input
          type="text"
          name="q"
          placeholder="Buscar por nombre o email..."
          defaultValue={q ?? ""}
          className="bg-neutral-800 p-2 rounded text-sm w-72"
        />

        <button className="px-4 py-2 bg-neutral-700 rounded hover:bg-neutral-600 transition">
          Buscar
        </button>

        <Link
          href="/admin/users"
          className="px-4 py-2 bg-neutral-900 rounded hover:bg-neutral-800 transition"
        >
          Limpiar
        </Link>
      </form>

      {/* SORTING OPTIONS */}
      <div className="mb-6 flex gap-3 text-sm">
        <Link
          href={`/admin/users?sort=createdAt-desc`}
          className="text-neutral-400 hover:text-white"
        >
          Más recientes
        </Link>
        <Link
          href={`/admin/users?sort=createdAt-asc`}
          className="text-neutral-400 hover:text-white"
        >
          Más antiguos
        </Link>
        <Link
          href={`/admin/users?sort=name-asc`}
          className="text-neutral-400 hover:text-white"
        >
          A-Z
        </Link>
        <Link
          href={`/admin/users?sort=name-desc`}
          className="text-neutral-400 hover:text-white"
        >
          Z-A
        </Link>
      </div>

      {/* USERS GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {users.map((u) => (
          <div
            key={u.id}
            className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 flex flex-col gap-3"
          >
            {/* Basic Info */}
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">
                {u.name ?? "(Sin nombre)"}
              </p>

              <span
                className={`text-xs px-2 py-1 rounded font-medium
                ${
                  u.role === "ADMIN"
                    ? "bg-red-700/20 text-red-400"
                    : u.role === "EMPLOYEE"
                    ? "bg-blue-700/20 text-blue-400"
                    : "bg-neutral-700/20 text-neutral-400"
                }`}
              >
                {u.role}
              </span>
            </div>

            {/* Email */}
            <p className="text-neutral-400 text-sm">{u.email}</p>

            {/* Status */}
            <span
              className={`text-xs px-2 py-1 rounded w-fit ${
                u.disabled
                  ? "bg-yellow-700/20 text-yellow-400"
                  : "bg-green-700/20 text-green-400"
              }`}
            >
              {u.disabled ? "INACTIVO" : "ACTIVO"}
            </span>

            {/* Reservation count */}
            <p className="text-neutral-500 text-xs">
              Reservas: {u.reservedVehicles.length}
            </p>

            {/* Registered */}
            <p className="text-neutral-600 text-xs">
              Registrado el: {u.createdAt.toLocaleDateString()}
            </p>

            {/* View Details */}
            <Link
              href={`/admin/users/${u.id}`}
              className="px-3 py-1 bg-neutral-800 rounded hover:bg-neutral-700 text-sm w-fit"
            >
              Ver detalles
            </Link>

            {/* Role Selector */}
            <form action={updateRole} className="flex gap-2 items-center mt-2">
              <input type="hidden" name="id" value={u.id} />

              <select
                name="role"
                defaultValue={u.role}
                className="bg-neutral-800 p-2 rounded text-sm"
              >
                <option value="CUSTOMER">CUSTOMER</option>
                <option value="EMPLOYEE">EMPLOYEE</option>
                <option value="ADMIN">ADMIN</option>
              </select>

              <button
                type="submit"
                className="px-3 py-1 bg-neutral-700 rounded hover:bg-neutral-600 text-sm"
              >
                Cambiar
              </button>
            </form>

            {/* Disable / Enable */}
            <form action={toggleDisabled} className="mt-2">
              <input type="hidden" name="id" value={u.id} />
              <input type="hidden" name="current" value={String(u.disabled)} />

              <button
                type="submit"
                className={`px-3 py-1 rounded text-sm ${
                  u.disabled
                    ? "bg-green-700 hover:bg-green-600"
                    : "bg-yellow-700 hover:bg-yellow-600"
                }`}
              >
                {u.disabled ? "Activar cuenta" : "Desactivar cuenta"}
              </button>
            </form>

            {/* Delete User (blocked for yourself) */}
            {u.id !== currentUserId && (
              <form action={deleteUser} className="mt-2">
                <input type="hidden" name="id" value={u.id} />
                <button
                  type="submit"
                  className="px-3 py-1 bg-red-800 rounded hover:bg-red-700 text-sm"
                >
                  Eliminar
                </button>
              </form>
            )}
          </div>
        ))}
      </div>

      {/* No results */}
      {users.length === 0 && (
        <p className="text-neutral-500 mt-10 text-sm">
          No se encontraron usuarios.
        </p>
      )}

      {/* Pagination */}
      <div className="flex gap-3 mt-10">
        {page > 1 && (
          <Link
            href={`/admin/users?page=${page - 1}&limit=${limit}`}
            className="px-4 py-2 bg-neutral-800 rounded hover:bg-neutral-700"
          >
            Página anterior
          </Link>
        )}

        <Link
          href={`/admin/users?page=${page + 1}&limit=${limit}`}
          className="px-4 py-2 bg-neutral-800 rounded hover:bg-neutral-700"
        >
          Siguiente página
        </Link>
      </div>
    </div>
  );
}
