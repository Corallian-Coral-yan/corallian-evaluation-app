import path from "path";
import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import mime from "mime";

// Adjust this to exactly where your images live:
const IMAGE_DIR = path.join(process.cwd(), "coral-data", "images", "aa_not-aa");

export async function GET(
  _req: NextRequest,
  { params }: { params: { filename: string } }
) {
  const { filename } = params;
  console.log("🔍 Requested filename:", filename);

  let files: string[];
  try {
    files = await fs.readdir(IMAGE_DIR);
  } catch (err) {
    console.error("❌ Could not read image directory:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  const matched = files.find((f) => f.toLowerCase() === filename.toLowerCase());
  if (!matched) {
    console.warn(`⚠️ No file matching "${filename}" (case‐insensitive)`);
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  const filePath = path.join(IMAGE_DIR, matched);
  console.log("✅ Serving file:", filePath);

  try {
    const fileBuffer = await fs.readFile(filePath);
    const contentType = mime.getType(filePath) || "application/octet-stream";
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: { "Content-Type": contentType },
    });
  } catch (err) {
    console.error("❌ Error reading matched file:", err);
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
}
