import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest, context: any) {
  const id = Number(context?.params?.id);

  if (!id) {
    return new NextResponse("Invalid ID", { status: 400 });
  }

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
