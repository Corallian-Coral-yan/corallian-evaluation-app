import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  imageId: { type: String, required: true, unique: true },
  filename: { type: String, required: true },
  maskFilename: { type: String },
  tau: String,
  site: String,
  dateTaken: Date,
  actualLabel: String,
  predictedLabel: String,
  createdAt: { type: Date, default: Date.now },
});

export const ImageModel =
  mongoose.models.Image || mongoose.model("Image", ImageSchema);
