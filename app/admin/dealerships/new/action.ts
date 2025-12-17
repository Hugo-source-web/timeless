"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createDealership(formData: FormData) {
  const name = String(formData.get("name"));
  const city = String(formData.get("city"));
  const country = String(formData.get("country"));
  const region = String(formData.get("region"));
  const latitude = Number(formData.get("latitude"));
  const longitude = Number(formData.get("longitude"));

  const slug = slugify(`${name}-${city}`);

  await prisma.dealership.create({
    data: {
      name,
      slug,
      city,
      country,
      region,
      latitude,
      longitude,
    },
  });

  revalidatePath("/admin/dealerships");
  revalidatePath("/search"); // updates Leaflet
  redirect("/admin/dealerships");
}
