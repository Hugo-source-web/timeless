"use server";

import prisma from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
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

  // 1) Create the bare vehicle first so we get the ID
  const vehicle = await prisma.vehicle.create({
    data: {
      dealershipId,
      slug,
      brand,
      model,
      variant,
      year,
      price,
      // availability, currency, etc. use defaults
    },
  });

  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "vehicles",
    String(vehicle.id)
  );

  await fs.mkdir(uploadDir, { recursive: true });

  let thumbnailUrl: string | null = null;
  const mediaToCreate: {
    type: "IMAGE" | "VIDEO";
    url: string;
    vehicleId: number;
    isHero?: boolean;
    sortOrder?: number;
  }[] = [];

  // 2) Handle thumbnail (optional)
  const thumbnailFile = formData.get("thumbnail") as File | null;
  if (thumbnailFile && thumbnailFile.size > 0) {
    const arrayBuffer = await thumbnailFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = path.extname(thumbnailFile.name) || ".jpg";
    const fileName = `thumbnail${ext}`;
    const filePath = path.join(uploadDir, fileName);
    const publicPath = `/uploads/vehicles/${vehicle.id}/${fileName}`;

    await fs.writeFile(filePath, buffer);
    thumbnailUrl = publicPath;
  }

  // 3) Handle images (multiple)
  const imageFiles = formData.getAll("images") as File[];
  let sortOrder = 0;

  for (const file of imageFiles) {
    if (!file || file.size === 0) continue;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = path.extname(file.name) || ".jpg";
    const fileName = `image-${sortOrder}${ext}`;
    const filePath = path.join(uploadDir, fileName);
    const publicPath = `/uploads/vehicles/${vehicle.id}/${fileName}`;

    await fs.writeFile(filePath, buffer);

    mediaToCreate.push({
      type: "IMAGE",
      url: publicPath,
      vehicleId: vehicle.id,
      sortOrder,
    });

    // If there is no manually provided thumbnail, use first image
    if (!thumbnailUrl && sortOrder === 0) {
      thumbnailUrl = publicPath;
    }

    sortOrder++;
  }

  // 4) Handle video (optional)
  const videoFile = formData.get("video") as File | null;
  if (videoFile && videoFile.size > 0) {
    const arrayBuffer = await videoFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = path.extname(videoFile.name) || ".mp4";
    const fileName = `video${ext}`;
    const filePath = path.join(uploadDir, fileName);
    const publicPath = `/uploads/vehicles/${vehicle.id}/${fileName}`;

    await fs.writeFile(filePath, buffer);

    mediaToCreate.push({
      type: "VIDEO",
      url: publicPath,
      vehicleId: vehicle.id,
    });
  }

  // 5) Persist media entries
  if (mediaToCreate.length > 0) {
    await prisma.mediaAsset.createMany({
      data: mediaToCreate,
    });
  }

  // 6) Update vehicle thumbnailUrl if we have one
  if (thumbnailUrl) {
    await prisma.vehicle.update({
      where: { id: vehicle.id },
      data: { thumbnailUrl },
    });
  }

  // 7) Revalidate admin inventory + go back
  revalidatePath("/admin/vehicles");
  redirect("/admin/vehicles");
}
