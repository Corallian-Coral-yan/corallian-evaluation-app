import fs from "fs";
import path from "path";
import { connectToDatabase } from "../src/lib/mongodb";
import { ImageModel } from "../src/models/Image";
import dotenv from "dotenv";

dotenv.config();

const IMAGE_DIR = path.join(process.cwd(), "coral-data/images/aa_not-aa");

function formatDateFromString(raw: string): Date | null {
  if (!/^\d{8}$/.test(raw)) return null;
  const year = raw.slice(0, 4);
  const month = raw.slice(4, 6);
  const day = raw.slice(6, 8);
  return new Date(`${year}-${month}-${day}`);
}

async function run() {
  await connectToDatabase();
  const files = fs.readdirSync(IMAGE_DIR);
  let count = 0;

  for (const file of files) {
    if (!file.match(/\.(jpg|jpeg|png)$/i)) continue;

    const filenameWithoutExt = file.replace(/\.(jpg|jpeg|png)$/i, "");

    // Extract labels from the full filename
    const labelMatch = filenameWithoutExt.match(
      /__actual-([^_]+)__pred-([^_]+)$/
    );
    if (!labelMatch) {
      console.warn(`❌ Label pattern mismatch in: ${file}`);
      continue;
    }

    const [_, actualLabel, predictedLabel] = labelMatch;

    // Remove the label portion to isolate the core parts
    const core = filenameWithoutExt.replace(/__actual-[^_]+__pred-[^_]+$/, "");
    const parts = core.split("_");

    if (parts.length < 5) {
      console.warn(`❌ Unexpected filename structure in: ${file}`);
      continue;
    }

    const tau = parts[0]; // e.g., TWB or R
    const rawFilename = parts[1]; // e.g., IMG_1089 or DSC02643
    const dateRaw = parts[2]; // e.g., 20240429
    const imageId = `${tau}_${rawFilename}`;
    const dateTaken = formatDateFromString(dateRaw);

    await ImageModel.updateOne(
      { imageId },
      {
        $set: {
          imageId,
          filename: file,
          tau,
          site: tau,
          dateTaken,
          actualLabel,
          predictedLabel,
        },
      },
      { upsert: true }
    );

    console.log(`✅ Indexed: ${imageId}`);
    count++;
  }

  console.log(`\n✅ Done. ${count} images processed.`);
  process.exit();
}

run().catch((err) => {
  console.error("❌ Error during indexing:", err);
  process.exit(1);
});
