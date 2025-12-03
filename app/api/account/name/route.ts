import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await req.json();

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid name" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: Number(session.user.id) },
      data: { name },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Name update error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
