const { MongoClient } = require("mongodb");
require("dotenv").config();

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB_NAME);

    // Insert sample predictions
    await db.collection("predictions").insertMany([
      { imageUrl: "/coral-1.jpg", label: "AA", confidence: 0.9 },
      { imageUrl: "/coral-2.jpg", label: "HC", confidence: 0.85 },
    ]);

    // Insert sample evaluations
    await db.collection("evaluations").insertOne({
      correct: true,
      originalLabel: "AA",
      newLabel: "AA",
      imageUrl: "/coral-1.jpg",
      createdAt: new Date(),
    });

    console.log("Seed data inserted");
  } finally {
    await client.close();
  }
}

main().catch(console.error);
