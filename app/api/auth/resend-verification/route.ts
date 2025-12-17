import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email } = await req.json();
  const normalized = email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { email: normalized },
  });

  if (!user || user.emailVerified) {
    return NextResponse.json({ success: true });
  }

  // delete old tokens
  await prisma.verificationToken.deleteMany({
    where: { identifier: normalized },
  });

  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);

  await prisma.verificationToken.create({
    data: {
      identifier: normalized,
      token,
      expires,
    },
  });

  const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?email=${normalized}&token=${token}`;

  await resend.emails.send({
    from: "noreply@resend.dev",
    to: normalized,
    subject: "Verifica tu cuenta en Timeless",
    html: `<p><a href="${verifyUrl}">Verificar cuenta</a></p>`,
  });

  return NextResponse.json({ success: true });
}
