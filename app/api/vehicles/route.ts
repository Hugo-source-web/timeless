import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const category = searchParams.get("category")?.toLowerCase();
  const recent = searchParams.get("recent");

  let where: any = {};

  const CATEGORY_FILTERS: Record<string, any> = {
    sports: { bodyType: "Coupe" },
    suv: { bodyType: "SUV" },
    ev: { fuelType: "ELECTRIC" },
  };

  if (category) {
    const filter = CATEGORY_FILTERS[category];
    if (!filter) {
      return NextResponse.json([]); 
    }
    where = filter;
  }

  const vehicles = await prisma.vehicle.findMany({
    where,
    orderBy: recent ? { createdAt: "desc" } : undefined,
    take: recent ? 12 : 20,
    include: { media: true },
  });

  const dealerId = searchParams.get("dealerId");
  
  if (dealerId) {
    const vehicles = await prisma.vehicle.findMany({
      where: { dealershipId: Number(dealerId) },
      include: { media: true },
    });
    return NextResponse.json(vehicles);
  }

  return NextResponse.json(vehicles);
}
