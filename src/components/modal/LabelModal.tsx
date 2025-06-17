// components/modal/LabelModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import Select, { MultiValue } from "react-select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface LabelOption {
  code: string;
  name: string;
  category?: string;
  color?: string;
}

interface LabelModalProps {
  isOpen: boolean;
  labelOptions: LabelOption[];
  onConfirm: (labelCodes: string[]) => void;
  onCancel: () => void;
}

export default function LabelModal({
  isOpen,
  labelOptions,
  onConfirm,
  onCancel,
}: LabelModalProps) {
  const [selected, setSelected] = useState<
    MultiValue<{ value: string; label: string }>
  >([]);

  useEffect(() => {
    if (!isOpen) setSelected([]);
  }, [isOpen]);

  if (!isOpen) return null;

  // Build options with the new format
  const options = labelOptions.map((l) => ({
    value: l.code,
    label: `${l.category || "Uncategorized"} : ${l.name} (${l.code})`,
  }));

  return (
    <section className="w-full max-w-3xl mx-auto mt-4">
      <Card>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-semibold">Select One or More Labels</h3>
          <Select
            isMulti
            options={options}
            value={selected}
            onChange={(vals) => setSelected(vals)}
            placeholder="Type to search…"
            className="basic-multi-select"
            classNamePrefix="select"
          />
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              onClick={() => onConfirm(selected.map((v) => v.value))}
              disabled={selected.length === 0}
            >
              Confirm
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
