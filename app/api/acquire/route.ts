import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
    name,
    surname,
    email,
    phone,
    brand,
    model,
    price,
    reservationAmount,
    slug,
    } = body;


    if (!name || !email || !brand || !model) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY!);

    await resend.emails.send({
      from: "Timeless Motors <noreply@resend.dev>",
      to: email,
      subject: `Solicitud de adquisición – ${brand} ${model}`,
      html: `
        <h2>Hola ${name},</h2>

        <p>
          Hemos recibido correctamente tu solicitud de adquisición para el
          <strong>${brand} ${model}</strong>.
        </p>

        <p>
          <strong>Resumen de la solicitud:</strong>
        </p>

        <ul>
          <li>Precio total: ${price.toLocaleString("es-ES")} €</li>
          <li>Reserva inicial (simulada): ${reservationAmount.toLocaleString(
            "es-ES"
          )} €</li>
        </ul>

        <p>
          Un asesor de Timeless Motors se pondrá en contacto contigo para
          continuar el proceso.
        </p>

        <p style="color: #666; font-size: 14px;">
          * Este proceso es una simulación con fines demostrativos. No se ha
          realizado ningún pago real.
        </p>

        <br />
        <p>Atentamente,<br />Timeless Motors</p>
      `,
    });

    await prisma.vehicle.update({
        where: { slug },
        data: {
            availability: "RESERVED",
            reservedUntil: new Date(
            Date.now() + 1000 * 60 * 60 * 24 * 3
            ),
        },
    });


    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ACQUIRE_EMAIL_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
