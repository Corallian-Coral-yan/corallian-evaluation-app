"use client";

import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect, Line, Image as KonvaImage } from "react-konva";
import useImage from "use-image";

export default function AnnotatorCanvas() {
  const [mode, setMode] = useState<"rect" | "lasso">("rect");
  const [rects, setRects] = useState<any[]>([]);
  const [lassos, setLassos] = useState<any[][]>([]);
  const [currentLasso, setCurrentLasso] = useState<any[]>([]);
  const [newRect, setNewRect] = useState<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const stageRef = useRef<any>(null);

  const [bgImage, status] = useImage("/coral-1.jpg");

  const handleMouseDown = (e: any) => {
    const pos = e.target.getStage().getPointerPosition();
    if (!pos) return;

    setIsDrawing(true);

    if (mode === "rect") {
      setNewRect({ x: pos.x, y: pos.y, width: 0, height: 0 });
    } else if (mode === "lasso") {
      setCurrentLasso([pos]);
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing) return;
    const pos = e.target.getStage().getPointerPosition();
    if (!pos) return;

    if (mode === "rect" && newRect) {
      setNewRect({
        ...newRect,
        width: pos.x - newRect.x,
        height: pos.y - newRect.y,
      });
    } else if (mode === "lasso") {
      setCurrentLasso((prev) => [...prev, pos]);
    }
  };

  const handleMouseUp = () => {
    if (mode === "rect" && newRect) {
      setRects([...rects, newRect]);
      setNewRect(null);
    } else if (mode === "lasso") {
      setLassos([...lassos, currentLasso]);
      setCurrentLasso([]);
    }
    setIsDrawing(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 🧰 Toolbox */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode("rect")}
          className={`px-3 py-1 rounded ${
            mode === "rect" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Rectangle
        </button>
        <button
          onClick={() => setMode("lasso")}
          className={`px-3 py-1 rounded ${
            mode === "lasso" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Lasso
        </button>
      </div>

      {/* 🖼️ Canvas */}
      <div className="border border-gray-300 inline-block">
        {status === "loaded" && (
          <Stage
            ref={stageRef}
            width={800}
            height={600}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <Layer>
              {/* Background image */}
              <KonvaImage image={bgImage} width={800} height={600} />

              {/* Rectangles */}
              {rects.map((rect, i) => (
                <Rect
                  key={i}
                  {...rect}
                  stroke="blue"
                  strokeWidth={2}
                  fill="rgba(0, 0, 255, 0.2)"
                />
              ))}
              {newRect && (
                <Rect
                  {...newRect}
                  stroke="red"
                  strokeWidth={2}
                  dash={[4, 4]}
                  fill="rgba(255, 0, 0, 0.1)"
                />
              )}

              {/* Lassos */}
              {lassos.map((points, i) => (
                <Line
                  key={i}
                  points={points.flatMap((p) => [p.x, p.y])}
                  stroke="green"
                  strokeWidth={2}
                  closed
                  fill="rgba(0, 255, 0, 0.2)"
                />
              ))}
              {/* Active lasso while drawing */}
              {currentLasso.length > 1 && (
                <Line
                  points={currentLasso.flatMap((p) => [p.x, p.y])}
                  stroke="red"
                  strokeWidth={2}
                />
              )}
            </Layer>
          </Stage>
        )}
      </div>
    </div>
  );
}
