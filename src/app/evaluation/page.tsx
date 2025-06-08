"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";

type CoralLabel = "AA" | "HC" | "SC" | "SP" | "DC" | "Unknown";

interface PredictionData {
  imageUrl: string;
  label: CoralLabel;
  confidence?: number;
}

interface VerificationResult {
  correct: boolean;
  originalLabel: CoralLabel;
  newLabel: CoralLabel;
  imageUrl: string;
}

const LABELS: CoralLabel[] = ["AA", "HC", "SC", "SP", "DC", "Unknown"];

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
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [newLabel, setNewLabel] = useState<CoralLabel | "">("");
  const [submitted, setSubmitted] = useState(false);

  const [onboardingOpen, setOnboardingOpen] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);

  // On mount, check localStorage for onboarding flag
  useEffect(() => {
    const completed = localStorage.getItem("onboardingCompleted");
    if (completed === "true") {
      setOnboardingOpen(false);
    }
  }, []);

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

    // TODO: send `result` to backend
  };

  const nextStep = () => {
    if (stepIndex < onboardingSteps.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      // Mark onboarding complete and close
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
      {/* Onboarding Dialog */}
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

      {/* Main Verification UI */}
      {!onboardingOpen && (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <h1 className="text-3xl font-semibold">Verify Coral Prediction</h1>

          <Card>
            <CardContent className="flex flex-col gap-6 items-center">
              <img
                src={prediction.imageUrl}
                alt="Predicted coral"
                className="w-full max-w-3xl rounded-lg shadow"
              />
              <div className="w-full max-w-3xl space-y-4 text-center">
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
                    <Select
                      onValueChange={(val) => setNewLabel(val as CoralLabel)}
                    >
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
      )}
    </>
  );
}
