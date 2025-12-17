"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createVehicle(formData: FormData) {
  const dealershipId = Number(formData.get("dealershipId"));
  const brand = String(formData.get("brand") || "").trim();
  const model = String(formData.get("model") || "").trim();
  const variant = formData.get("variant")?.toString().trim() || null;
  const year = Number(formData.get("year"));
  const price = Number(formData.get("price"));

  if (!dealershipId || !brand || !model || !year || !price) {
    throw new Error("Faltan campos obligatorios.");
  }

  const rawSlug = `${brand}-${model}${variant ? "-" + variant : ""}-${year}`;
  const slug = slugify(rawSlug);

  await prisma.vehicle.create({
    data: {
      dealershipId,
      slug,
      brand,
      model,
      variant,
      year,
      price,
      // availability, currency, thumbnailUrl, etc. use defaults
    },
  });

  revalidatePath("/admin/vehicles");
  redirect("/admin/vehicles");
}
