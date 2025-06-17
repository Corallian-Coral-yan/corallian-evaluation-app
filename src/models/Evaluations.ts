import mongoose from "mongoose";

const EvaluationsSchema = new mongoose.Schema({
  imageId: { type: String, required: true },
  correct: { type: Boolean, required: true },
  originalLabel: { type: String, required: true },
  newLabel: { type: String, required: true },
  additionalLabels: { type: [String], default: [] },
  user: { type: String }, // optional
  submittedAt: { type: Date, default: Date.now },
});

export const EvaluationsModel =
  mongoose.models.Evaluations || mongoose.model("Evaluations", EvaluationsSchema);
