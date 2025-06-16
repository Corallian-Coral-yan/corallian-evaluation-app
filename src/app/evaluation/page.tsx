"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type CoralLabel = "AA" | "HC" | "SC" | "SP" | "DC" | "Unknown";

interface EvaluationData {
  imageId: string;
  filename: string;
  actualLabel: CoralLabel;
  predictedLabel: CoralLabel;
  imageUrl: string;
}

export default function EvaluationPage() {
  const [data, setData] = useState<EvaluationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Load one random image
  const loadRandom = async () => {
    setLoading(true);
    setSubmitted(false);
    setIsCorrect(null);
    try {
      const res = await fetch("/api/evaluations/random");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to load random image:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRandom();
  }, []);

  const handleSubmit = async () => {
    if (!data || isCorrect === null) return;
    const payload = {
      imageId: data.imageId,
      correct: isCorrect,
      originalLabel: data.predictedLabel,
      newLabel: isCorrect ? data.predictedLabel : "Unknown",
    };
    try {
      await fetch("/api/evaluations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Error saving evaluation:", err);
      alert("Could not submit; please try again.");
    }
  };

  if (loading) return <p className="text-center p-6">Loading…</p>;
  if (!data) return <p className="text-center p-6">No image available.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Evaluate Coral Prediction</h1>
      <Card>
        <CardContent className="flex flex-col items-center gap-6">
          <img
            src={data.imageUrl}
            alt={data.imageId}
            className="max-w-full rounded-lg shadow"
          />
          <div className="w-full max-w-3xl space-y-2 text-center">
            <p className="text-xl">
              <strong>Actual:</strong>{" "}
              <span className="text-green-700 font-semibold">
                {data.actualLabel}
              </span>
            </p>
            <p className="text-xl">
              <strong>Predicted:</strong>{" "}
              <span
                className={
                  data.predictedLabel === data.actualLabel
                    ? "text-green-700 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                {data.predictedLabel}
              </span>
            </p>
            <div className="flex justify-center gap-4 mt-4">
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
            <div className="flex justify-center gap-4 mt-4">
              <Button
                onClick={handleSubmit}
                disabled={isCorrect === null || submitted}
              >
                {submitted ? "Saved ✅" : "Submit"}
              </Button>
              <Button
                variant="outline"
                onClick={loadRandom}
                disabled={!submitted}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
