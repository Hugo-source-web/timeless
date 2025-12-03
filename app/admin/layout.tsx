import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Protect admin routes
 /* if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }*/

  return (
    <div className="flex h-screen w-full bg-neutral-950 text-white">
      {/* Sidebar */}
      <aside className="w-[240px] bg-neutral-900 border-r border-neutral-800 p-6 fixed left-0 top-0 bottom-0">
        <h2 className="text-xl font-semibold mb-8 tracking-tight">Timeless Admin</h2>

        <nav className="flex flex-col gap-4 text-neutral-400">
          <a href="/admin/dashboard" className="hover:text-white transition-colors">
            Resumen
          </a>
          <a href="/admin/vehicles" className="hover:text-white transition-colors">
            Inventario
          </a>
          <a
            href="/admin/vehicles/new"
            className="hover:text-white transition-colors"
          >
            Añadir vehículo
          </a>
          <a href="/admin/users" className="hover:text-white transition-colors">
            Usuarios
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-[240px] flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
