import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const category = searchParams.get("category");
  const recent = searchParams.get("recent");

  let where: any = {};

  if (category === "sports") {
    where.bodyType = "Coupe";  // or custom tag field later
  }

  if (category === "suv") {
    where.bodyType = "SUV";
  }

  if (category === "electric") {
    where.fuelType = "ELECTRIC";
  }

  let vehicles = [];

  if (recent) {
    vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: "desc" },
      take: 12,
      include: { media: true },
    });
  } else {
    vehicles = await prisma.vehicle.findMany({
      where,
      include: { media: true },
      take: 20,
    });
  }

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
