// app/api/evaluations/summary/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { EvaluationsModel } from "@/models/Evaluations";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  // allow filtering by user
  const url = new URL(req.url);
  const user = url.searchParams.get("user") || "";

  const match: Record<string, any> = {};
  if (user) match.user = user;

  const totalEvals = await EvaluationsModel.countDocuments(match);
  const correctCount = await EvaluationsModel.countDocuments({
    ...match,
    correct: true,
  });
  const userAccuracy = totalEvals ? correctCount / totalEvals : 0;

  return NextResponse.json({ totalEvals, userAccuracy });
}
