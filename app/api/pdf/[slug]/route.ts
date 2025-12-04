export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { PDFPage, PDFFont } from "pdf-lib";
import type { NextRequest } from "next/server";

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN = 40;

function drawWrappedText({
  page,
  text,
  x,
  y,
  font,
  size,
  maxWidth,
  lineHeight,
}: {
  page: PDFPage;
  text: string;
  x: number;
  y: number;
  font: PDFFont;
  size: number;
  maxWidth: number;
  lineHeight: number;
}): number {
  if (!text) return y;

  const words = text.split(" ");
  let line = "";

  for (let i = 0; i < words.length; i++) {
    const test = line + words[i] + " ";
    const width = font.widthOfTextAtSize(test, size);

    if (width > maxWidth) {
      page.drawText(line, { x, y, size, font });
      y -= lineHeight;
      line = words[i] + " ";
    } else {
      line = test;
    }
  }

  if (line.trim().length > 0) {
    page.drawText(line, { x, y, size, font });
    y -= lineHeight;
  }

  return y;
}


export async function GET(
  _req: NextRequest,
  context: { params: { slug: string } }
) {
  try {
    // ESM import — THIS is the correct one
    const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");

    const { slug } = await context.params;

    const vehicle = await prisma.vehicle.findUnique({
      where: { slug },
      include: { media: true, dealership: true },
    });

    if (!vehicle)
      return NextResponse.json({ error: "Vehículo no encontrado" }, { status: 404 });

    // Create PDF
    const pdf = await PDFDocument.create();
    let page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    let y = PAGE_HEIGHT - MARGIN;

    // ---- CUSTOM FONT WITHOUT FONTKIT ----
// ---- STANDARD FONTS (Vercel-safe, no fontkit required) ----
    const timelessFont = await pdf.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdf.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

    // ---- TITLE ----
    const title = "TIMELESS";
    page.drawText(title, {
      x: PAGE_WIDTH / 2 - timelessFont.widthOfTextAtSize(title, 32) / 2,
      y,
      size: 32,
      font: timelessFont,
    });

    y -= 20;

    // Divider
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: PAGE_WIDTH - MARGIN, y },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });

    y -= 30;

    // ---- HERO IMAGE ----
    const hero = vehicle.media.find((m) => m.isHero)?.url;

    if (hero) {
      const finalURL = hero.startsWith("http")
        ? hero
        : `${process.env.NEXT_PUBLIC_BASE_URL}${hero}`;

      try {
        const bytes = await fetch(finalURL).then((r) => r.arrayBuffer());
        const img = finalURL.endsWith(".png")
          ? await pdf.embedPng(bytes)
          : await pdf.embedJpg(bytes);

        const imgWidth = PAGE_WIDTH - MARGIN * 2;
        const ratio = img.height / img.width;
        const imgHeight = imgWidth * ratio;

        page.drawImage(img, {
          x: MARGIN,
          y: y - imgHeight,
          width: imgWidth,
          height: imgHeight,
        });

        y -= imgHeight + 30;
      } catch (err) {
        console.error("Image failed:", err);
      }
    }

    // ---- VEHICLE TITLE ----
    const vehicleTitle = `${vehicle.brand} ${vehicle.model} ${vehicle.variant ?? ""}`;
    page.drawText(vehicleTitle, {
      x: PAGE_WIDTH / 2 - fontBold.widthOfTextAtSize(vehicleTitle, 22) / 2,
      y,
      size: 22,
      font: fontBold,
    });

    y -= 25;

    const subtitle = `Año ${vehicle.year} · ${vehicle.condition}`;
    page.drawText(subtitle, {
      x: PAGE_WIDTH / 2 - fontRegular.widthOfTextAtSize(subtitle, 12) / 2,
      y,
      size: 12,
      font: fontRegular,
      color: rgb(0.3, 0.3, 0.3),
    });

    // ---- START SPECS PAGE ----
    page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    y = PAGE_HEIGHT - MARGIN;

    const sections = [
    {
      title: "General Information",
      rows: [
        ["Brand", vehicle.brand],
        ["Model", vehicle.model],
        ["Variant", vehicle.variant],
        ["Year", vehicle.year],
        ["Condition", vehicle.condition],
        ["First registration", vehicle.firstRegistration],
        ["Mileage", vehicle.mileageKm ? `${vehicle.mileageKm} km` : null],
        ["Previous owners", vehicle.previousOwners],
        ["VIN", vehicle.vin],
        ["Stock number", vehicle.stockNumber],
        ["Price", vehicle.price ? `${vehicle.price} ${vehicle.currency}` : null],
      ],
    },

    {
      title: "Performance",
      rows: [
        ["0–100 km/h", vehicle.accel_0_100_s ? `${vehicle.accel_0_100_s}s` : null],
        ["0–200 km/h", vehicle.accel_0_200_s ? `${vehicle.accel_0_200_s}s` : null],
        ["0–300 km/h", vehicle.accel_0_300_s ? `${vehicle.accel_0_300_s}s` : null],
        ["0–400 km/h", vehicle.accel_0_400_s ? `${vehicle.accel_0_400_s}s` : null],
        ["Top speed (limited)", vehicle.maxSpeedLimitedKmh ? `${vehicle.maxSpeedLimitedKmh} km/h` : null],
        ["Top speed (unlocked)", vehicle.maxSpeedUnlockedKmh ? `${vehicle.maxSpeedUnlockedKmh} km/h` : null],
        ["Power output", vehicle.powerTotalHp ? `${vehicle.powerTotalHp} hp` : null],
        ["Mass DIN", vehicle.massDinKg ? `${vehicle.massDinKg} kg` : null],
        ["Electric WLTP range", vehicle.electricRangeWltpKm ? `${vehicle.electricRangeWltpKm} km` : null],
      ],
    },

    {
      title: "Engine",
      rows: [
        ["Configuration", vehicle.engineConfiguration],
        ["Architecture", vehicle.engineArchitecture],
        ["Displacement", vehicle.engineDisplacementL ? `${vehicle.engineDisplacementL} L` : null],
        ["Power", vehicle.enginePowerHp ? `${vehicle.enginePowerHp} hp` : null],
        ["Torque", vehicle.engineTorqueNm ? `${vehicle.engineTorqueNm} Nm` : null],
        ["Max RPM", vehicle.engineMaxRpm],
      ],
    },

    {
      title: "Transmission",
      rows: [
        ["Type", vehicle.transmissionType],
        ["Cooling system", vehicle.transmissionCooling],
        ["eSynchro", vehicle.eSynchroDescription],
        ["eLSD", vehicle.elsdDescription],
      ],
    },

    {
      title: "Electric System",
      rows: [
        ["Battery architecture", vehicle.batteryArchitectureV ? `${vehicle.batteryArchitectureV} V` : null],
        ["Peak battery power", vehicle.batteryPowerPeakKw ? `${vehicle.batteryPowerPeakKw} kW` : null],
        ["Battery capacity", vehicle.batteryEnergyKwh ? `${vehicle.batteryEnergyKwh} kWh` : null],
        ["Cooling", vehicle.batteryCooling],
      ],
    },

    {
      title: "Front Motor",
      rows: [
        ["Layout", vehicle.frontMotorLayout],
        ["Power", vehicle.frontMotorPowerKwTotal ? `${vehicle.frontMotorPowerKwTotal} kW` : null],
        ["Torque", vehicle.frontMotorTorqueNmWheels ? `${vehicle.frontMotorTorqueNmWheels} Nm` : null],
        ["Max RPM", vehicle.frontMotorMaxRpm],
        ["Type", vehicle.frontMotorType],
        ["Inverter", vehicle.frontInverterType],
        ["Drive system", vehicle.frontDriveSystem],
      ],
    },

    {
      title: "Rear Motor",
      rows: [
        ["Power", vehicle.rearMotorPowerKw ? `${vehicle.rearMotorPowerKw} kW` : null],
        ["Torque", vehicle.rearMotorTorqueNm ? `${vehicle.rearMotorTorqueNm} Nm` : null],
        ["Max RPM", vehicle.rearMotorMaxRpm],
        ["Type", vehicle.rearMotorType],
        ["Inverter", vehicle.rearInverterType],
      ],
    },

    {
      title: "Dimensions",
      rows: [
        ["Length", vehicle.lengthMm ? `${vehicle.lengthMm} mm` : null],
        ["Width", vehicle.widthMm ? `${vehicle.widthMm} mm` : null],
        ["Width with mirrors", vehicle.widthWithMirrorsMm ? `${vehicle.widthWithMirrorsMm} mm` : null],
        ["Height", vehicle.heightMm ? `${vehicle.heightMm} mm` : null],
        ["Wheelbase", vehicle.wheelbaseMm ? `${vehicle.wheelbaseMm} mm` : null],
        ["Body type", vehicle.bodyType],
        ["Doors", vehicle.doors],
        ["Seats", vehicle.seats],
      ],
    },

    {
      title: "Exterior",
      rows: [
        ["Exterior color", vehicle.exteriorColor],
        ["Interior color", vehicle.interiorColor],
        ["Upholstery", vehicle.upholstery],
      ],
    },

    {
      title: "Dealership",
      rows: [
        ["Name", vehicle.dealership?.name],
        ["City", vehicle.dealership?.city],
        ["Country", vehicle.dealership?.country],
        ["Contact phone", vehicle.dealership?.phone],
        ["Contact email", vehicle.dealership?.email],
      ],
    },

    {
      title: "Warranty",
      rows: [
        ["Warranty type", vehicle.warrantyType],
        ["Warranty expiry", vehicle.warrantyExpiry?.toISOString().slice(0,10)],
        ["ITV valid until", vehicle.itvValidUntil?.toISOString().slice(0,10)],
      ],
    },
  ];


    const ROW_LABEL_X = MARGIN;
    const ROW_VALUE_X = PAGE_WIDTH - MARGIN - 180;
    for (const section of sections) {
      const valid = section.rows.filter(([_, v]) => v !== null && v !== undefined);
      if (!valid.length) continue;

      // PAGE BREAK BEFORE TITLE
      if (y < 120) {
        page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        y = PAGE_HEIGHT - MARGIN;
      }

      // SECTION HEADER
      page.drawRectangle({
        x: MARGIN,
        y: y - 4,
        width: PAGE_WIDTH - MARGIN * 2,
        height: 18,
        color: rgb(0.95, 0.95, 0.95),
      });

      page.drawText(section.title, {
        x: MARGIN + 4,
        y,
        font: fontBold,
        size: 12,
        color: rgb(0.15, 0.15, 0.15),
      });

      y -= 26;

      // ---- ROW LOOP ----
      for (const [label, rawValue] of valid) {
        if (y < 60) {
          page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
          y = PAGE_HEIGHT - MARGIN;
        }

        // Normalize values for safety
        const safeLabel = label ? String(label) : "";
        const value = rawValue !== null && rawValue !== undefined ? String(rawValue) : "";

        const isLong =
          safeLabel === "" ||
          safeLabel.toLowerCase().includes("description") ||
          safeLabel.toLowerCase().includes("summary");

        // Draw label (unless empty)
        if (safeLabel.length > 0) {
          page.drawText(safeLabel, {
            x: ROW_LABEL_X,
            y,
            font: fontRegular,
            size: 10,
          });
        }

        if (!isLong) {
          // Single line value
          page.drawText(value, {
            x: ROW_VALUE_X,
            y,
            font: fontRegular,
            size: 10,
            color: rgb(0.4, 0.4, 0.4),
          });

          y -= 14;
        } else {
          // Wrapped long text
          y = drawWrappedText({
            page,
            text: value,
            x: ROW_LABEL_X,
            y: y - 2,
            font: fontRegular,
            size: 10,
            maxWidth: PAGE_WIDTH - MARGIN * 2,
            lineHeight: 12,
          });

          y -= 8;
        }
      }

      y -= 16; // extra padding after each section
    }




    // ---- FOOTER ----
    page.drawText(
      `${vehicle.dealership?.name ?? ""} · ${vehicle.dealership?.city ?? ""}`,
      {
        x:
          PAGE_WIDTH / 2 -
          fontRegular.widthOfTextAtSize(
            `${vehicle.dealership?.name ?? ""} · ${vehicle.dealership?.city ?? ""}`,
            10
          ) /
            2,
        y: 40,
        size: 10,
        font: fontRegular,
        color: rgb(0.4, 0.4, 0.4),
      }
    );

    const generated = `Generado el ${new Date().toLocaleDateString()}`;

    page.drawText(generated, {
      x: PAGE_WIDTH / 2 - fontRegular.widthOfTextAtSize(generated, 10) / 2,
      y: 28,
      size: 10,
      font: fontRegular,
      color: rgb(0.4, 0.4, 0.4),
    });

    // ---- OUTPUT ----
    const pdfBytes = await pdf.save();

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${slug}-spec-sheet.pdf"`,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error generando PDF" }, { status: 500 });
  }
}
