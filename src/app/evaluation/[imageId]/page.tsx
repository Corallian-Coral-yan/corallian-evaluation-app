"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";

type CoralLabel = "AA" | "HC" | "SC" | "SP" | "DC" | "Unknown";

interface PredictionData {
  imageId: string;
  filename: string;
  actualLabel: CoralLabel;
  predictedLabel: CoralLabel;
  tau?: string;
  site?: string;
  dateTaken?: string;
  imageUrl: string; // now expected from API
}

interface VerificationResult {
  correct: boolean;
  originalLabel: CoralLabel;
  newLabel: CoralLabel;
  imageId: string;
}

const onboardingSteps = [
  {
    title: "Welcome to Evaluation",
    description:
      "Here you will verify the model's predictions for coral labels. Your feedback helps improve the system.",
  },
  {
    title: "How to Use",
    description:
      "Look at the predicted label and image. Confirm if correct or select the right label if wrong.",
  },
  {
    title: "Let's Get Started!",
    description: "Click the button below to begin verifying coral predictions.",
  },
];

export default function VerifyPredictionPage() {
  const params = useParams();
  const imageId = Array.isArray(params?.imageId)
    ? params.imageId[0]
    : params?.imageId;

  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  const [onboardingOpen, setOnboardingOpen] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const completed = localStorage.getItem("onboardingCompleted");
    if (completed === "true") {
      setOnboardingOpen(false);
    }
  }, []);

  useEffect(() => {
    if (!imageId) return;
    setLoading(true);

    fetch(`/api/image/${imageId}`)
      .then((res) => res.json())
      .then((data) => setPrediction(data))
      .catch((err) => console.error("Error fetching image metadata:", err))
      .finally(() => setLoading(false));
  }, [imageId]);

  const handleSubmit = () => {
    if (isCorrect === null || !prediction) return;

    const result: VerificationResult = {
      correct: isCorrect,
      originalLabel: prediction.predictedLabel,
      newLabel: isCorrect ? prediction.predictedLabel : "Unknown",
      imageId: prediction.imageId,
    };

    console.log("✅ Submitted verification:", result);
    setSubmitted(true);

    // TODO: send result to backend API via POST
  };

  const nextStep = () => {
    if (stepIndex < onboardingSteps.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      localStorage.setItem("onboardingCompleted", "true");
      setOnboardingOpen(false);
    }
  };

  const prevStep = () => {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
    }
  };

  return (
    <>
      {/* Onboarding */}
      <Dialog.Root open={onboardingOpen} onOpenChange={setOnboardingOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30" />
          <Dialog.Content className="fixed top-1/2 left-1/2 max-w-md w-full -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={stepIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.4 }}
              >
                <Dialog.Title className="text-xl font-semibold mb-2">
                  {onboardingSteps[stepIndex].title}
                </Dialog.Title>
                <Dialog.Description className="mb-6 text-gray-700">
                  {onboardingSteps[stepIndex].description}
                </Dialog.Description>

                <div className="flex justify-between">
                  <Button
                    onClick={prevStep}
                    disabled={stepIndex === 0}
                    variant="outline"
                  >
                    Back
                  </Button>
                  <Button onClick={nextStep}>
                    {stepIndex === onboardingSteps.length - 1
                      ? "Get Started"
                      : "Next"}
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Main UI */}
      {!onboardingOpen && (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <h1 className="text-3xl font-semibold">Verify Coral Prediction</h1>

          {loading || !prediction ? (
            <p className="text-center text-lg">Loading...</p>
          ) : (
            <Card>
              <CardContent className="flex flex-col gap-6 items-center">
                <img
                  src={prediction.imageUrl}
                  alt={`Coral image ${prediction.imageId}`}
                  className="w-full max-w-3xl rounded-lg shadow"
                  loading="lazy"
                  style={{ aspectRatio: "16/9", objectFit: "contain" }}
                />
                <div className="w-full max-w-3xl space-y-2 text-center">
                  <p className="text-xl">
                    <strong>Predicted Label:</strong>{" "}
                    <span
                      className={
                        prediction.predictedLabel === prediction.actualLabel
                          ? "text-green-700 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {prediction.actualLabel === "True" ? "AA" : "Not AA"}
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

                  <Button
                    onClick={handleSubmit}
                    disabled={isCorrect === null || submitted}
                    className="mt-4"
                  >
                    {submitted ? "Submitted ✅" : "Submit Verification"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </>
  );
}
