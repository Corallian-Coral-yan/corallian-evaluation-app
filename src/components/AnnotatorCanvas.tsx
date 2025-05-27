// src/components/AnnotatorCanvas.tsx
"use client";

import React from "react";
import { Stage, Layer, Rect } from "react-konva";

export default function AnnotatorCanvas() {
  return (
    <Stage width={800} height={600} style={{ border: "1px solid #ccc" }}>
      <Layer>
        {/* Example annotation shape */}
        <Rect x={50} y={50} width={100} height={100} fill="rgba(0,0,255,0.3)" />
      </Layer>
    </Stage>
  );
}
