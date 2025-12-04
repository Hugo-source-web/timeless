import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { renderToBuffer } from "@react-pdf/renderer";
import { PdfSpecSheet } from "@/components/PdfSpecSheet";
import { createElement } from "react";

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  const vehicle = await prisma.vehicle.findUnique({
    where: { slug },
    include: { media: true, dealership: true },
  });

  if (!vehicle) {
    return NextResponse.json(
      { error: "Vehículo no encontrado" },
      { status: 404 }
    );
  }

  // Infer the correct MediaAsset type from the returned object
  type MediaAssetType = (typeof vehicle.media)[number];

  const heroImageRel =
    vehicle.media.find((m: MediaAssetType) => m.isHero)?.url ??
    "/placeholder.jpg";

  const heroImage = heroImageRel.startsWith("http")
    ? heroImageRel
    : `${process.env.NEXT_PUBLIC_BASE_URL}${heroImageRel}`;


  // Rebuild the sections array based on your PDFPage code
  const sections = [
    {
      title: "Performance",
      rows: [
        ["Power output", vehicle.powerTotalHp ? `${vehicle.powerTotalHp} hp` : null],
        ["Maximum speed", vehicle.maxSpeedLimitedKmh ? `${vehicle.maxSpeedLimitedKmh} km/h` : null],
        ["Mass (DIN)", vehicle.massDinKg ? `${vehicle.massDinKg} kg` : null],
        ["Electric-only range (WLTP)", vehicle.electricRangeWltpKm ? `${vehicle.electricRangeWltpKm} km` : null],
      ],
    },
    // add other sections here...
  ];

  // Generate PDF buffer
  const pdfBuffer = await renderToBuffer(
    createElement(PdfSpecSheet, {
      vehicle,
      sections,
      heroImage,
    })
  );

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${slug}-spec-sheet.pdf"`,
    },
  });
}
