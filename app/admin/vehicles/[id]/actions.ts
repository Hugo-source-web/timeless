"use server";

import prisma from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AvailabilityStatus, MediaType, Prisma } from "@prisma/client";

async function ensureUploadDir(vehicleId: number) {
  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "vehicles",
    String(vehicleId)
  );

  await fs.mkdir(uploadDir, { recursive: true });
  return uploadDir;
}

export async function updateVehicle(id: number, formData: FormData) {
  const brand = formData.get("brand")?.toString().trim() || "";
  const model = formData.get("model")?.toString().trim() || "";
  const variant = formData.get("variant")?.toString().trim() || null;
  const year = Number(formData.get("year"));
  const price = Number(formData.get("price"));
  const dealershipId = Number(formData.get("dealershipId"));

  // Availability enum (cast to your Prisma enum)
  const availability = formData.get("availability") as AvailabilityStatus | null;

  // Reservation fields from form
  let reservedByUserId: number | null = null;
  const reservedByUserIdRaw = formData.get("reservedByUserId");
  if (reservedByUserIdRaw && reservedByUserIdRaw.toString().trim() !== "") {
    reservedByUserId = Number(reservedByUserIdRaw);
  }

  let reservedUntil: Date | null = null;
  const reservedUntilRaw = formData.get("reservedUntil")?.toString();
  if (reservedUntilRaw) {
    reservedUntil = new Date(reservedUntilRaw);
  }

  // Enforce reservation rules by status
  if (availability === "AVAILABLE" || availability === "SOLD") {
    reservedByUserId = null;
    reservedUntil = null;
  }

  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: { media: true },
  });

  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  const uploadDir = await ensureUploadDir(id);

  // --- THUMBNAIL REPLACE ---
  let updatedThumbnailUrl = vehicle.thumbnailUrl;
  const newThumbnail = formData.get("thumbnail") as File | null;

  if (newThumbnail && newThumbnail.size > 0) {
    const buffer = Buffer.from(await newThumbnail.arrayBuffer());
    const ext = path.extname(newThumbnail.name) || ".jpg";
    const fileName = `thumbnail${ext}`;
    const filePath = path.join(uploadDir, fileName);
    const publicPath = `/uploads/vehicles/${id}/${fileName}`;

    await fs.writeFile(filePath, buffer);
    updatedThumbnailUrl = publicPath;
  }

  // --- NEW IMAGES ---
  const imageFiles = formData.getAll("images") as File[];
  const newMediaEntries: Prisma.MediaAssetCreateManyInput[] = [];

  // sortOrder continuation from existing images
  let sortOrder =
    vehicle.media.filter((m) => m.type === "IMAGE").length ?? 0;

  for (const file of imageFiles) {
    if (!file || file.size === 0) continue;

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || ".jpg";
    const fileName = `image-${sortOrder}${ext}`;
    const filePath = path.join(uploadDir, fileName);
    const publicPath = `/uploads/vehicles/${id}/${fileName}`;

    await fs.writeFile(filePath, buffer);

    newMediaEntries.push({
      type: MediaType.IMAGE,
      url: publicPath,
      vehicleId: id,
      sortOrder,
      alt: null,
      isHero: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: 0, // will be ignored by createMany auto-increment
    });

    // if there was no thumbnail, set first new image as thumbnail
    if (!updatedThumbnailUrl && sortOrder === 0) {
      updatedThumbnailUrl = publicPath;
    }

    sortOrder++;
  }

  // --- VIDEO REPLACEMENT ---
  const newVideo = formData.get("video") as File | null;

  if (newVideo && newVideo.size > 0) {
    // delete old video file + row if exists
    const oldVideo = vehicle.media.find((m) => m.type === "VIDEO");
    if (oldVideo) {
      const oldPath = path.join(process.cwd(), "public", oldVideo.url);
      await fs.rm(oldPath, { force: true });
      await prisma.mediaAsset.delete({ where: { id: oldVideo.id } });
    }

    const buffer = Buffer.from(await newVideo.arrayBuffer());
    const ext = path.extname(newVideo.name) || ".mp4";
    const fileName = `video${ext}`;
    const filePath = path.join(uploadDir, fileName);
    const publicPath = `/uploads/vehicles/${id}/${fileName}`;

    await fs.writeFile(filePath, buffer);

    newMediaEntries.push({
      type: MediaType.VIDEO,
      url: publicPath,
      vehicleId: id,
      sortOrder: 0,
      alt: null,
      isHero: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: 0,
    });
  }

  // Persist new media rows
  if (newMediaEntries.length > 0) {
    await prisma.mediaAsset.createMany({
      data: newMediaEntries.map(({ id, createdAt, updatedAt, ...rest }) => rest),
    });
  }

  // Update vehicle fields
  await prisma.vehicle.update({
    where: { id },
    data: {
      brand,
      model,
      variant,
      year,
      price,
      dealershipId,
      thumbnailUrl: updatedThumbnailUrl,
      availability: availability ?? vehicle.availability,
      reservedByUserId,
      reservedUntil,
    },
  });

  revalidatePath("/admin/vehicles");
  redirect("/admin/vehicles");
}
