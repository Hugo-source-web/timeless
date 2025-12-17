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
      to: email,
      subject: "Verifica tu cuenta en Timeless",
      html: `
        <div style="font-family:system-ui, -apple-system, BlinkMacSystemFont, sans-serif; line-height:1.5">
          <h2>Verificación de correo</h2>
          <p>Gracias por registrarte en <strong>Timeless</strong>.</p>
          <p>Para activar tu cuenta, confirma que este correo es tuyo:</p>
          <p style="margin:16px 0">
            <a href="${verifyUrl}" style="
              display:inline-block;
              padding:10px 16px;
              background:#111;
              color:#fff;
              text-decoration:none;
              border-radius:6px;
            ">
              Verificar mi cuenta
            </a>
          </p>
          <p style="font-size:12px;color:#666">
            Este enlace caduca en 24 horas.
          </p>
          <p style="font-size:12px;color:#666">
            Si no solicitaste esta cuenta, puedes ignorar este mensaje.
          </p>
        </div>
      `,
  });

  return NextResponse.json({ success: true });
}
