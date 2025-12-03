import { prisma } from "@/lib/prisma";
import ContactClientWrapper from "@/components/ContactClientWrapper";
import { neue6 } from "@/app/fonts/neuePlak";

interface ContactPageProps {
  params: { slug: string };
}

export default async function VehicleContactPage({ params }: ContactPageProps) {
  const resolvedParams = await params;

  const vehicle = await prisma.vehicle.findUnique({
    where: { slug: resolvedParams.slug }
  });

  if (!vehicle) return <div className="text-white p-10">Vehículo no encontrado.</div>;

  const allVehicles = await prisma.vehicle.findMany({
    select: { brand: true, model: true, thumbnailUrl: true },
    orderBy: [{ brand: "asc" }, { model: "asc" }],
  });

  const brands: string[] = Array.from(
    new Set(allVehicles.map((v) => v.brand))
  );

  return (
    <main className="bg-[#0a0a0a] min-h-screen w-full pb-40 text-white">

      <ContactClientWrapper
        vehicle={vehicle}
        allVehicles={allVehicles}
        brands={brands}
      />

      {/* FORM */}
      <section className="max-w-5xl bg-[#0f0f0f] mx-auto p-10 rounded-xl mt-10 shadow-sm text-white">
        <h2 className={`${neue6.className} text-3xl mb-4`}>
          Nos gustaría saber más de usted.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <input id="firstName" className="border border-white/30 bg-transparent px-4 py-3 rounded-md text-white placeholder-white/40" placeholder="Nombre *" />
          <input id="lastName1" className="border border-white/30 bg-transparent px-4 py-3 rounded-md text-white placeholder-white/40" placeholder="Primer apellido *" />
          <input id="lastName2" className="border border-white/30 bg-transparent px-4 py-3 rounded-md text-white placeholder-white/40" placeholder="Segundo apellido" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <input id="email" className="border border-white/30 bg-transparent px-4 py-3 rounded-md text-white placeholder-white/40" placeholder="Dirección de email *" />
          <input id="phone" className="border border-white/30 bg-transparent px-4 py-3 rounded-md text-white placeholder-white/40" placeholder="Número de teléfono móvil *" />
        </div>
      </section>

    </main>
  );
}
