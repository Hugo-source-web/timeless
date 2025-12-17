import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { randomBytes } from "crypto";
import { Resend } from "resend";

function buildVerifyUrl(email: string, token: string) {
  const base =
    process.env.NEXTAUTH_URL || "http://localhost:3000";

  const params = new URLSearchParams({
    email,
    token,
  });

  return `${base}/api/auth/verify-email?${params.toString()}`;
}


export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = body.name;
    const email = String(body.email || "").toLowerCase().trim();
    const password = body.password;
    const employeeCode = body.employeeCode;


    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    const hashed = await hash(password, 12);

    let role: UserRole = UserRole.CUSTOMER;

    if (employeeCode && employeeCode.startsWith("id-")) {
      const digits = employeeCode.replace("id-", "");
      if (/^\d{6}$/.test(digits)) {
        role = UserRole.EMPLOYEE;
      }
    }

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashed,
        role,
      },
    });

    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    const verifyUrl = buildVerifyUrl(email, token);

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: "Timeless Motors <noreply@resend.dev>",
      to: email,
      subject: "Verifica tu cuenta en Timeless",
      html: `...`,
    });

    console.log("RESEND DATA:", data);
    console.log("RESEND ERROR:", error);

    if (error) {
      return NextResponse.json(
        { error: "Email delivery failed", details: error },
        { status: 500 }
      );
    }



    return NextResponse.json(
      { success: true, message: "Verification email sent" },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
