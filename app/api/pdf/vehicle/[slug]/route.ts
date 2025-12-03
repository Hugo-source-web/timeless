import puppeteer from "puppeteer";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  // URL of the printable page
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/vehiculos/${slug}/pdf`;

  // Launch browser
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "30px", bottom: "30px" }
  });

  await browser.close();

  const buffer = Buffer.from(pdfBuffer);

  return new NextResponse(buffer, {
    status: 200,
    headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${slug}-spec-sheet.pdf"`,
    },
  });
}
