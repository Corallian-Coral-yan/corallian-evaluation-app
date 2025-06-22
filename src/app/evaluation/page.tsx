"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Select, { MultiValue } from "react-select";
import { labelOptions } from "@/components/modal/labelManager";

type CoralLabel = "AA" | "HC" | "SC" | "SP" | "DC" | "Unknown";

interface EvaluationData {
  imageId: string;
  filename: string;
  actualLabel: CoralLabel;
  predictedLabel: CoralLabel;
  imageUrl: string;
}

export default function EvaluationPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<EvaluationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // For inline multi-select
  const [selectedOptions, setSelectedOptions] = useState<
    MultiValue<{ value: string; label: string }>
  >([]);

  // load random image
  const loadRandom = async () => {
    setLoading(true);
    setSubmitted(false);
    setIsCorrect(null);
    setSelectedOptions([]);
    try {
      const res = await fetch("/api/evaluations/random");
      const json = await res.json();
      setData(res.ok && !json.error ? json : null);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRandom();
  }, []);

  // handle Correct / Not Correct
  const handleMark = (correct: boolean) => {
    setIsCorrect(correct);
  };

  // Submit everything
  const handleSubmit = async () => {
    if (!data || isCorrect === null) return;

    const additionalLabels = selectedOptions.map((opt) => opt.value);

    const payload = {
      imageId: data.imageId,
      correct: isCorrect,
      originalLabel: data.predictedLabel,
      newLabel: isCorrect ? "Right" : "Wrong",
      additionalLabels,
      user: session?.user?.email || "anonymous",
    };

    try {
      const res = await fetch("/api/evaluations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      alert("Could not save evaluation. Please try again.");
    }
  };

  if (loading) return <p className="text-center p-6">Loading…</p>;
  if (!data)
    return (
      <div className="text-center p-6">
        <p>No image available.</p>
        <Button onClick={loadRandom}>Try Again</Button>
      </div>
    );

  // build react-select options once
  const selectOptions = labelOptions.map((l) => ({
    value: l.code,
    label: `${l.category} : ${l.name} (${l.code})`,
  }));

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-6 py-6 space-y-6">
      <h1 className="text-2xl sm:text-3xl font-semibold text-center">
        Evaluate Coral Prediction
      </h1>

      <Card>
        <CardContent className="flex flex-col items-center gap-6">
          <img
            src={data.imageUrl}
            alt={data.imageId}
            className="w-full max-w-full rounded-lg shadow"
            loading="lazy"
            style={{ aspectRatio: "16/9", objectFit: "contain" }}
          />

          <div className="w-full max-w-3xl space-y-2">
            <p className="text-lg sm:text-xl text-center">
              <strong>Predicted Label:</strong>{" "}
              <span
                className={
                  data.predictedLabel === data.actualLabel
                    ? "text-green-700 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                {data.predictedLabel.toLowerCase() === "true"
                  ? "Not Coral"
                  : "Coral"}
              </span>
            </p>

            {/* ✅ Correct / ❌ Not Correct */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant={isCorrect === true ? "default" : "outline"}
                onClick={() => handleMark(true)}
                disabled={submitted}
                className="w-full sm:w-auto"
              >
                ✅ Correct
              </Button>
              <Button
                variant={isCorrect === false ? "destructive" : "outline"}
                onClick={() => handleMark(false)}
                disabled={submitted}
                className="w-full sm:w-auto"
              >
                ❌ Not Correct
              </Button>
            </div>

            {/* Inline multi-select, always visible but disabled until mark */}
            <div className="mt-4">
              <p className="text-sm text-center text-gray-600 mb-2">
                If you think there are other TAUs/labels in this image, please
                add them here:
              </p>
              <Select
                isMulti
                options={selectOptions}
                value={selectedOptions}
                onChange={(vals) => setSelectedOptions(vals)}
                placeholder="Select one or more labels…"
                isDisabled={isCorrect === null || submitted}
                className="basic-multi-select"
                classNamePrefix="select"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: 44,
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
              />
            </div>

            {/* Show picked labels */}
            {selectedOptions.length > 0 && (
              <p className="mt-2 text-sm text-center break-words">
                <strong>Also present:</strong>{" "}
                {selectedOptions.map((o) => o.label).join(", ")}
              </p>
            )}

            {/* Submit & Next */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Button
                onClick={handleSubmit}
                disabled={isCorrect === null || submitted}
                className="w-full sm:w-auto"
              >
                {submitted ? "Saved ✅" : "Submit"}
              </Button>
              <Button
                onClick={loadRandom}
                disabled={!submitted}
                variant="outline"
                className="w-full sm:w-auto"
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
