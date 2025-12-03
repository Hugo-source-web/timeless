import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  try {
    await prisma.mediaAsset.deleteMany({
      where: { vehicleId: id },
    });

    await prisma.vehicle.delete({
      where: { id },
    });

    return NextResponse.redirect("/admin/vehicles");
  } catch (err) {
    console.error(err);
    return new NextResponse("Error deleting vehicle", { status: 500 });
  }
}
