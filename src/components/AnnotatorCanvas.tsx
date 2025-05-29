"use client";

import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";
import useImage from "use-image";

export default function AnnotatorCanvas() {
  const [mounted, setMounted] = useState(false);
  const [annotations, setAnnotations] = useState<
    { x: number; y: number; width: number; height: number }[]
  >([]);
  const [newAnnotation, setNewAnnotation] = useState<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const stageRef = useRef<any>(null);

  // Load coral image
  const [bgImage, status] = useImage("/coral-1.jpg");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render once mounted and image fully loaded
  if (!mounted || status !== "loaded") {
    return null; // render nothing on SSR or until image loads on client
  }

  const handleMouseDown = (e: any) => {
    if (isDrawing) return;
    const pos = e.target.getStage().getPointerPosition();
    if (!pos) return;
    const { x, y } = pos;
    setNewAnnotation({ x, y, width: 0, height: 0 });
    setIsDrawing(true);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing || !newAnnotation) return;
    const pos = e.target.getStage().getPointerPosition();
    if (!pos) return;
    const { x, y } = pos;
    setNewAnnotation({
      ...newAnnotation,
      width: x - newAnnotation.x,
      height: y - newAnnotation.y,
    });
  };

  const handleMouseUp = () => {
    if (newAnnotation) {
      setAnnotations([...annotations, newAnnotation]);
    }
    setNewAnnotation(null);
    setIsDrawing(false);
  };

  return (
    <div className="border border-gray-300 inline-block">
      <Stage
        ref={stageRef}
        width={800}
        height={600}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {/* Background Image */}
          <KonvaImage image={bgImage} width={800} height={600} />

          {/* Existing Annotations */}
          {annotations.map((rect, i) => (
            <Rect
              key={i}
              {...rect}
              stroke="blue"
              strokeWidth={2}
              fill="rgba(0, 0, 255, 0.2)"
            />
          ))}

          {/* New Annotation */}
          {newAnnotation && (
            <Rect
              {...newAnnotation}
              stroke="red"
              strokeWidth={2}
              dash={[4, 4]}
              fill="rgba(255, 0, 0, 0.1)"
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}
