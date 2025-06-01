import React, { useState, useEffect } from "react";

interface LabelOption {
  code: string;
  name: string;
  category?: string;
  color?: string;
}

interface LabelModalProps {
  isOpen: boolean;
  categories: string[];
  labelOptions: LabelOption[];
  onConfirm: (labelCode: string) => void;
  onCancel: () => void;
}

export default function LabelModal({
  isOpen,
  categories,
  labelOptions,
  onConfirm,
  onCancel,
}: LabelModalProps) {
  const [step, setStep] = useState<"category" | "label">("category");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedLabel, setSelectedLabel] = useState<string>("");

  useEffect(() => {
    if (!isOpen) {
      // Reset modal state when closed
      setStep("category");
      setSelectedCategory("");
      setSelectedLabel("");
    }
  }, [isOpen]);

  // Filter labels by selectedCategory
  const filteredLabels = labelOptions.filter(
    (label) => label.category === selectedCategory
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        {step === "category" && (
          <>
            <h2 className="text-lg font-semibold mb-4">Select Category</h2>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            >
              <option value="" disabled>
                -- Select category --
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedCategory) setStep("label");
                }}
                disabled={!selectedCategory}
                className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
                  !selectedCategory ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}

        {step === "label" && (
          <>
            <h2 className="text-lg font-semibold mb-4">Select Label</h2>
            <select
              value={selectedLabel}
              onChange={(e) => setSelectedLabel(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            >
              <option value="" disabled>
                -- Select label --
              </option>
              {filteredLabels.map((label) => (
                <option key={label.code} value={label.code}>
                  {label.name}
                </option>
              ))}
            </select>
            <div className="flex justify-between">
              <button
                onClick={() => setStep("category")}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Back
              </button>
              <div className="flex gap-2">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (selectedLabel) onConfirm(selectedLabel);
                  }}
                  disabled={!selectedLabel}
                  className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
                    !selectedLabel ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
