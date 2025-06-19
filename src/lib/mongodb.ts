import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "corallian";

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

let isConnected = false;

declare global {
  let _mongooseConnection: Promise<typeof mongoose> | undefined;
}

const cached = global._mongooseConnection;

export async function connectToDatabase() {
  if (isConnected) return;

  if (!cached) {
    global._mongooseConnection = mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB_NAME,
    });
  }

  await global._mongooseConnection;
  isConnected = true;
}
