import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  const body = await req.json();
  const client = await clientPromise;
  const db = client.db("coral");

  const result = await db.collection("evaluations").insertOne({
    ...body,
    createdAt: new Date(),
  });

  return NextResponse.json({ success: true, insertedId: result.insertedId });
}
