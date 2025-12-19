import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const targetUserId = body?.userId
    ? Number(body.userId)
    : Number(session.user.id);

  const requesterId = Number(session.user.id);
  const requesterRole = session.user.role;

  if (targetUserId !== requesterId && requesterRole !== "ADMIN") {
    return NextResponse.json(
      { error: "Permisos insuficientes" },
      { status: 403 }
    );
  }

  if (targetUserId === requesterId && body?.userId) {
    return NextResponse.json(
      { error: "No puedes eliminar tu propia cuenta desde el panel admin" },
      { status: 400 }
    );
  }

  try {
    await prisma.vehicle.updateMany({
      where: { reservedByUserId: targetUserId },
      data: {
        reservedByUserId: null,
        reservedUntil: null,
        availability: "AVAILABLE",
      },
    });

    await prisma.user.delete({
      where: { id: targetUserId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "No se pudo eliminar el usuario" },
      { status: 500 }
    );
  }
}
