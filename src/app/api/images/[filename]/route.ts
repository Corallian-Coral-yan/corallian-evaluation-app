import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import mime from "mime";

// Set your images directory relative to project root
const IMAGE_DIR = path.join(process.cwd(), "coral-data", "images", "aa_not-aa");

// This is all Next.js expects for dynamic API routes:
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  try {
    // Check if the file exists (case-insensitive)
    const files = await fs.readdir(IMAGE_DIR);
    const matched = files.find(
      (f) => f.toLowerCase() === filename.toLowerCase()
    );
    if (!matched) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const filePath = path.join(IMAGE_DIR, matched);
    const fileBuffer = await fs.readFile(filePath);
    const contentType = mime.getType(filePath) || "application/octet-stream";
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${matched}"`,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
