import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;   // <-- IMPORTANT

  try {
    await prisma.mediaAsset.deleteMany({
      where: { vehicleId: Number(id) },
    });

    await prisma.vehicle.delete({
      where: { id: Number(id) },
    });

    return NextResponse.redirect("/admin/vehicles");
  } catch (err) {
    console.error(err);
    return new NextResponse("Error deleting vehicle", { status: 500 });
  }
}
