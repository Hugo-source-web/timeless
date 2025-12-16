export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import AcquireClient from "./AcquireClient";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function AcquireVehiclePage({ params }: PageProps) {
  const { slug } = await params;

  if (!slug) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Ruta inválida (slug no recibido)
      </div>
    );
  }

  const vehicle = await prisma.vehicle.findUnique({
    where: { slug },
    include: {
      dealership: true,
      media: {
        where: { isHero: true },
        take: 1,
      },
    },
  });

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Vehículo no encontrado
      </div>
    );
  }

  return <AcquireClient vehicle={vehicle} />;
}
