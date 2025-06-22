import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "corallian";

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

let isConnected = false;

declare global {
  // Augment the NodeJS.Global type to include _mongooseConnection
  // This allows us to attach the connection to the global object
  let _mongooseConnection: Promise<typeof mongoose> | undefined;
}

// Use globalThis for better compatibility
const globalWithMongoose = global as typeof global & {
  _mongooseConnection?: Promise<typeof mongoose>;
};

const cached = globalWithMongoose._mongooseConnection;

export async function connectToDatabase() {
  if (isConnected) return;

  if (!cached) {
    globalWithMongoose._mongooseConnection = mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB_NAME,
    });
  }

  await globalWithMongoose._mongooseConnection;
  isConnected = true;
}
