"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

type CoralLabel = "AA" | "HC" | "SC" | "SP" | "DC" | "Unknown";

interface PredictionData {
  imageUrl: string;
  label: CoralLabel;
  confidence: number; // 0.0 - 1.0
}

interface VerificationResult {
  correct: boolean;
  originalLabel: CoralLabel;
  newLabel: CoralLabel;
  imageUrl: string;
}

// --- Labels (Replace or load from config if needed) ---
const LABELS: CoralLabel[] = ["AA", "HC", "SC", "SP", "DC", "Unknown"];

export default function VerifyPredictionPage() {
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [newLabel, setNewLabel] = useState<CoralLabel | "">("");
  const [submitted, setSubmitted] = useState(false);

  // Mocked model prediction (replace with dynamic loading later)
  const prediction: PredictionData = {
    imageUrl: "/coral-1.jpg",
    label: "AA",
  };

  const handleSubmit = () => {
    if (isCorrect === null) return;

    const result: VerificationResult = {
      correct: isCorrect,
      originalLabel: prediction.label,
      newLabel: isCorrect ? prediction.label : newLabel || "Unknown",
      imageUrl: prediction.imageUrl,
    };

    console.log("Submitted verification:", result);
    setSubmitted(true);

    // TODO: send `result` to backend via fetch/axios
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Verify Coral Prediction</h1>

      <Card>
        <CardContent className="flex flex-col gap-6 items-center">
          <img
            src={prediction.imageUrl}
            alt="Predicted coral"
            className="w-full max-w-3xl rounded-lg shadow" // bigger max width
          />
          <div className="w-full max-w-3xl space-y-4 text-center">
            {" "}
            {/* Center text */}
            <div>
              <p className="text-xl font-medium">
                Predicted Label:{" "}
                <span className="font-bold">{prediction.label}</span>
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <Button
                variant={isCorrect === true ? "default" : "outline"}
                onClick={() => setIsCorrect(true)}
              >
                ✅ Correct
              </Button>
              <Button
                variant={isCorrect === false ? "destructive" : "outline"}
                onClick={() => setIsCorrect(false)}
              >
                ❌ Not Correct
              </Button>
            </div>
            {isCorrect === false && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Select the correct label:
                </label>
                <Select onValueChange={(val) => setNewLabel(val as CoralLabel)}>
                  <SelectTrigger className="w-60 mx-auto">
                    <SelectValue placeholder="Choose correct label" />
                  </SelectTrigger>
                  <SelectContent>
                    {LABELS.map((label) => (
                      <SelectItem key={label} value={label}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {isCorrect !== null && (isCorrect || newLabel) && (
              <Button
                onClick={handleSubmit}
                disabled={submitted}
                className="mt-4"
              >
                {submitted ? "Submitted ✅" : "Submit Verification"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
