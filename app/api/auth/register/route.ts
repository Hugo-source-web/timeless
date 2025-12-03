import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { name, email, password, employeeCode } = await req.json();

    if (!email || !password)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists)
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });

    const hashed = await hash(password, 12);

    let role = "CUSTOMER";

    // EMPLOYEE VERIFICATION
    if (employeeCode && employeeCode.startsWith("id-")) {
      const digits = employeeCode.replace("id-", "");
      if (/^\d{6}$/.test(digits)) {
        role = "EMPLOYEE";
      }
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashed,
        role: UserRole.CUSTOMER,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
