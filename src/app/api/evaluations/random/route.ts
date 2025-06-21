import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ImageModel } from "@/models/Image";

interface ImageDoc {
  _id: string;
  imageId: string;
  filename: string;
  maskFilename?: string;
  tau?: string;
  site?: string;
  dateTaken?: Date;
  actualLabel?: string;
  predictedLabel?: string;
  createdAt?: Date;
}

export async function GET() {
  await connectToDatabase();
  const count = await ImageModel.countDocuments();
  if (count === 0) {
    return NextResponse.json({ error: "No images available" }, { status: 404 });
  }
  const rand = Math.floor(Math.random() * count);
  const image = (await ImageModel.findOne()
    .skip(rand)
    .lean()) as ImageDoc | null;
  if (!image) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
  return NextResponse.json({
    ...image,
    imageUrl: `/api/images/${image.filename}`,
  });
}
