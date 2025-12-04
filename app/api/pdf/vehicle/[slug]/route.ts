import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/vehiculos/${slug}/pdf`;

  // Required for Vercel serverless
  const executablePath = await chromium.executablePath;

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: (executablePath ?? undefined) as unknown as string | undefined,
    headless: true,
  });





  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0" });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "30px", bottom: "30px" },
  });

  await browser.close();

  const buffer = Buffer.from(pdf);

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${slug}-spec-sheet.pdf"`,
    },
  });
}
