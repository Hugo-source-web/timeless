import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function DealershipsAdminPage() {
  const dealerships = await prisma.dealership.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Concesionarios</h1>
        <Link
          href="/admin/dealerships/new"
          className="px-4 py-2 bg-neutral-700 rounded hover:bg-neutral-600"
        >
          Añadir concesionario
        </Link>
      </div>

      <div className="border border-neutral-800 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-900 text-neutral-400">
            <tr>
              <th className="text-left p-3">Nombre</th>
              <th className="text-left p-3">Ciudad</th>
              <th className="text-left p-3">País</th>
              <th className="text-right p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {dealerships.map((d) => (
              <tr key={d.id} className="border-t border-neutral-800">
                <td className="p-3">{d.name}</td>
                <td className="p-3">{d.city}</td>
                <td className="p-3">{d.country}</td>
                <td className="p-3 text-right space-x-3">
                  <Link
                    href={`/admin/dealerships/${d.id}/edit`}
                    className="text-blue-400 hover:underline"
                  >
                    Editar
                  </Link>
                  <Link
                    href={`/admin/dealerships/${d.id}/delete`}
                    className="text-red-400 hover:underline"
                  >
                    Eliminar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
