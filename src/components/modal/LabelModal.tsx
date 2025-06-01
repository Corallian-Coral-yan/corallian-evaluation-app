import React from "react";

interface LabelModalProps {
  isOpen: boolean;
  labelOptions: string[];
  selectedLabel: string;
  onSelectLabel: (label: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function LabelModal({
  isOpen,
  labelOptions,
  selectedLabel,
  onSelectLabel,
  onConfirm,
  onCancel,
}: LabelModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4">Select Label</h2>
        <select
          value={selectedLabel}
          onChange={(e) => onSelectLabel(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        >
          {labelOptions.map((label) => (
            <option key={label} value={label}>
              {label}
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
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
