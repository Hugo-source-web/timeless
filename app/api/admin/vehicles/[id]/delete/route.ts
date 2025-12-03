import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const id = parseInt(context.params.id, 10);

  try {
    // Delete media assets linked to the vehicle
    await prisma.mediaAsset.deleteMany({
      where: { vehicleId: id },
    });

    // Delete the vehicle itself
    await prisma.vehicle.delete({
      where: { id },
    });

    return NextResponse.redirect("/admin/vehicles");
  } catch (err) {
    console.error(err);
    return new NextResponse("Error deleting vehicle", { status: 500 });
  }
}
