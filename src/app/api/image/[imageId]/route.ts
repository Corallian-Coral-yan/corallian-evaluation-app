// src/app/api/image/[imageId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ImageModel } from "@/models/Image";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ imageId: string }> } // note params is a Promise
) {
  try {
    const { imageId } = await context.params; // <-- await here
    await connectToDatabase();

    const image = await ImageModel.findOne({ imageId }).lean();

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const imageUrl = `/api/images/${image.filename}`;

    return NextResponse.json({ ...image, imageUrl });
  } catch (error) {
    console.error("❌ Failed to fetch image metadata:", error);
    return NextResponse.json(
      { error: "Failed to load image metadata" },
      { status: 500 }
    );
  }
}

