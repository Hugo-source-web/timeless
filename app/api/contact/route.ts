import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, brand, model } = body;

    const resend = new Resend(process.env.RESEND_API_KEY!);

    await resend.emails.send({
      from: "noreply@resend.dev",
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
