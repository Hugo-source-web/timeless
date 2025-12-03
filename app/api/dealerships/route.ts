import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const dealers = await prisma.dealership.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      city: true,
      latitude: true,
      longitude: true,
    },
  });

  return NextResponse.json(dealers);
}
