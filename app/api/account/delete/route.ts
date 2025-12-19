import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  const userId = Number(session.user.id);

  try {
    // If user has reserved vehicles, release them
    await prisma.vehicle.updateMany({
      where: { reservedByUserId: userId },
      data: {
        reservedByUserId: null,
        reservedUntil: null,
        availability: "AVAILABLE",
      },
    });

    // Delete user (accounts, sessions, authenticators cascade)
    await prisma.user.delete({
      where: { id: userId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("Error deleting account:", err);
    return NextResponse.json(
      { error: "No se pudo eliminar la cuenta" },
      { status: 500 }
    );
  }
}
