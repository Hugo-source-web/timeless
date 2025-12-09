import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest, context: any) {
  const params = await context.params;   // ← await fixes everything
  const id = Number(params?.id);

  console.log("DEBUG awaited params:", params);

  if (!id) {
    return new NextResponse("Invalid ID", { status: 400 });
  }

  try {
    await prisma.mediaAsset.deleteMany({ where: { vehicleId: id } });
    await prisma.vehicle.delete({ where: { id } });

    return NextResponse.redirect("/admin/vehicles");
  } catch (err) {
    console.error(err);
    return new NextResponse("Error deleting vehicle", { status: 500 });
  }
}

