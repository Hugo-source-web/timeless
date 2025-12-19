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

const str = (v: FormDataEntryValue | null) =>
  v === null || v === "" ? null : String(v);

const num = (v: FormDataEntryValue | null) =>
  v === null || v === "" ? null : Number(v);

const date = (v: FormDataEntryValue | null) =>
  v === null || v === "" ? null : new Date(String(v));


export async function createVehicle(formData: FormData) {
  const dealershipId = Number(formData.get("dealershipId"));
  const brand = String(formData.get("brand") || "").trim();
  const model = String(formData.get("model") || "").trim();
  const variant = str(formData.get("variant"));
  const year = Number(formData.get("year"));
  const price = Number(formData.get("price"));

  if (!dealershipId || !brand || !model || !year || !price) {
    throw new Error("Faltan campos obligatorios.");
  }

  const slug = slugify(
    `${brand}-${model}${variant ? "-" + variant : ""}-${year}`
  );

  await prisma.vehicle.create({
    data: {
      dealershipId,
      slug,
      brand,
      model,
      variant,
      year,
      price,

      firstRegistration: num(formData.get("firstRegistration")),
      vin: str(formData.get("vin")),
      stockNumber: str(formData.get("stockNumber")),
      mileageKm: num(formData.get("mileageKm")),
      previousOwners: num(formData.get("previousOwners")),
      itvValidUntil: date(formData.get("itvValidUntil")),

      condition: formData.get("condition") as any,
      availability: formData.get("availability") as any,

      warrantyType: str(formData.get("warrantyType")),
      warrantyExpiry: date(formData.get("warrantyExpiry")),

      heroTitle: str(formData.get("heroTitle")),
      heroSubtitle: str(formData.get("heroSubtitle")),
      heroTaglineTitle: str(formData.get("heroTaglineTitle")),
      heroTaglineBody: str(formData.get("heroTaglineBody")),
      heroVideoUrl: str(formData.get("heroVideoUrl")),

      highlight_0_100_s: num(formData.get("highlight_0_100_s")),
      highlight_power_kw: num(formData.get("highlight_power_kw")),
      highlight_power_hp: num(formData.get("highlight_power_hp")),
      highlight_top_speed: num(formData.get("highlight_top_speed")),

      engineConfiguration: str(formData.get("engineConfiguration")),
      engineArchitecture: str(formData.get("engineArchitecture")),
      engineDisplacementL: num(formData.get("engineDisplacementL")),
      enginePowerHp: num(formData.get("enginePowerHp")),
      engineTorqueNm: num(formData.get("engineTorqueNm")),
      engineMaxRpm: num(formData.get("engineMaxRpm")),

      transmissionType: str(formData.get("transmissionType")),
      elsdDescription: str(formData.get("elsdDescription")),
      eSynchroDescription: str(formData.get("eSynchroDescription")),
      transmissionCooling: str(formData.get("transmissionCooling")),

      lengthMm: num(formData.get("lengthMm")),
      widthMm: num(formData.get("widthMm")),
      widthWithMirrorsMm: num(formData.get("widthWithMirrorsMm")),
      heightMm: num(formData.get("heightMm")),
      wheelbaseMm: num(formData.get("wheelbaseMm")),
      massDinKg: num(formData.get("massDinKg")),

      batteryArchitectureV: num(formData.get("batteryArchitectureV")),
      batteryPowerPeakKw: num(formData.get("batteryPowerPeakKw")),
      batteryEnergyKwh: num(formData.get("batteryEnergyKwh")),
      batteryCooling: str(formData.get("batteryCooling")),
      electricRangeWltpKm: num(formData.get("electricRangeWltpKm")),

      bodyType: str(formData.get("bodyType")),
      doors: num(formData.get("doors")),
      seats: num(formData.get("seats")),
      driveType: formData.get("driveType") as any,
      fuelType: formData.get("fuelType") as any,
      exteriorColor: str(formData.get("exteriorColor")),
      interiorColor: str(formData.get("interiorColor")),
      upholstery: str(formData.get("upholstery")),

      optionsSummary: str(formData.get("optionsSummary")),
      description: str(formData.get("description")),
    },
  });

  revalidatePath("/admin/vehicles");
  redirect("/admin/vehicles");
}
