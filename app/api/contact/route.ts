import { NextResponse } from "next/server";
import { Resend } from "resend";
import twilio from "twilio";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, brand, model } = body;

    const formattedPhone = phone.startsWith("+")
      ? phone
      : `+34${phone.replace(/\D/g, "")}`;

    // --- TWILIO ---
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );

    await client.messages.create({
      body: `¡Hola ${name}! Hemos recibido su interés en el ${brand} ${model}. Nos pondremos en contacto con usted muy pronto.`,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: formattedPhone,
    });

    // --- RESEND ---
    const resend = new Resend(process.env.RESEND_API_KEY!);

    await resend.emails.send({
      from: "noreply@resend.dev",  // FIXED
      to: email,
      subject: `Confirmación de contacto – ${brand} ${model}`,
      html: `
        <h2>Hola ${name},</h2>
        <p>Gracias por ponerse en contacto con nosotros.</p>
        <p>Hemos recibido su interés en el <strong>${brand} ${model}</strong>.</p>
        <p>Nos pondremos en contacto con usted muy pronto.</p>
        <br/>
        <p>Atentamente,<br/>Timeless Motors</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
