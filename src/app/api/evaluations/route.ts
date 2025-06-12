// app/api/evaluations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { EvaluationsModel } from "@/models/Evaluations";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { imageId, correct, originalLabel, newLabel, user } =
      await req.json();

    if (!imageId || correct === undefined || !originalLabel || !newLabel) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const doc = await EvaluationsModel.create({
      imageId,
      correct,
      originalLabel,
      newLabel,
      user,
    });
    return NextResponse.json({ success: true, id: doc._id });
  } catch (err) {
    console.error("❌ Error saving evaluation:", err);
    return NextResponse.json(
      { error: "Failed to save evaluation" },
      { status: 500 }
    );
  }
}
