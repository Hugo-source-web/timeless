import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route"; // adjust if needed

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { password } = await req.json();

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password too short" },
        { status: 400 }
      );
    }

    const hashed = await hash(password, 12);

    await prisma.user.update({
      where: { id: Number(session.user.id) },
      data: { passwordHash: hashed },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Password update error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
