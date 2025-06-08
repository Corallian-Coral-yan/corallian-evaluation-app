import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("coral");

  const predictions = await db
    .collection("predictions")
    .find({})
    .limit(10)
    .toArray();

  return NextResponse.json(predictions);
}
