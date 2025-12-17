import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = (url.searchParams.get("email") || "").toLowerCase();
  const token = url.searchParams.get("token") || "";

  if (!email || !token) {
    return NextResponse.redirect(
      new URL("/login?error=Enlace inválido", url)
    );
  }

  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (
    !record ||
    record.identifier.toLowerCase() !== email ||
    record.expires < new Date()
  ) {
    return NextResponse.redirect(
      new URL("/login?error=Enlace caducado o inválido", url)
    );
  }

    await prisma.user.update({
    where: {
        email,
        emailVerified: null,
    },
    data: {
        emailVerified: new Date(),
    },
    });

  await prisma.verificationToken.delete({
    where: { token },
  });

  return NextResponse.redirect(
    new URL(
      "/login?success=Email verificado. Ya puedes iniciar sesión.",
      url
    )
  );
}
