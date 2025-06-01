"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  Stage,
  Layer,
  Rect,
  Line,
  Text,
  Image as KonvaImage,
  Group,
} from "react-konva";
import useImage from "use-image";

import {
  RectangleStackIcon,
  PencilIcon,
  ArrowUturnLeftIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

type Point = { x: number; y: number };
type RectShape = { x: number; y: number; width: number; height: number };
type LassoShape = Point[];

type HoverInfo = {
  type: "Rectangle" | "Lasso";
  index: number;
  x: number;
  y: number;
} | null;

export default function AnnotatorCanvas() {
  const [mode, setMode] = useState<"rect" | "lasso">("rect");
  const [rects, setRects] = useState<RectShape[]>([]);
  const [lassos, setLassos] = useState<LassoShape[]>([]);
  const [newRect, setNewRect] = useState<RectShape | null>(null);
  const [currentLasso, setCurrentLasso] = useState<LassoShape>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hoveredShape, setHoveredShape] = useState<HoverInfo>(null);

  const [bgImage, status] = useImage("/coral-1.jpg");
  const stageRef = useRef<any>(null);

  const handleMouseDown = useCallback(
    (e: any) => {
      const pos = e.target.getStage().getPointerPosition();
      if (!pos) return;
      setIsDrawing(true);

      if (mode === "rect") {
        setNewRect({ x: pos.x, y: pos.y, width: 0, height: 0 });
      } else {
        setCurrentLasso([pos]);
      }
    },
    [mode]
  );

  const handleMouseMove = useCallback(
    (e: any) => {
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
    },
    [isDrawing, mode, newRect]
  );

  const handleMouseUp = useCallback(() => {
    if (mode === "rect" && newRect) {
      setRects((prev) => [...prev, newRect]);
      setNewRect(null);
    } else if (mode === "lasso") {
      setLassos((prev) => [...prev, currentLasso]);
      setCurrentLasso([]);
    }
    setIsDrawing(false);
  }, [mode, newRect, currentLasso]);

  const handleUndo = () => {
    if (mode === "rect") setRects((prev) => prev.slice(0, -1));
    else setLassos((prev) => prev.slice(0, -1));
  };

  const handleDeleteAll = () => {
    if (mode === "rect") setRects([]);
    else setLassos([]);
  };

  const shapeTooltip = hoveredShape && (
    <>
      <Rect
        x={hoveredShape.x}
        y={hoveredShape.y - 24}
        width={120}
        height={20}
        fill="black"
        opacity={0.7}
        cornerRadius={4}
      />
      <Text
        x={hoveredShape.x + 5}
        y={hoveredShape.y - 22}
        text={`${hoveredShape.type} #${hoveredShape.index}`}
        fontSize={12}
        fill="white"
      />
    </>
  );

  // Toolbar icons mapped properly to your imports
  const tools = [
    { tool: "rect", IconComponent: RectangleStackIcon, label: "Rectangle" },
    { tool: "lasso", IconComponent: PencilIcon, label: "Lasso" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Toolbar on left */}
      <nav className="flex flex-col items-center gap-4 py-6 px-2 bg-white shadow-md border-r border-gray-200 w-16">
        {tools.map(({ tool, IconComponent, label }) => (
          <button
            key={tool}
            onClick={() => setMode(tool as "rect" | "lasso")}
            title={label}
            className={`w-12 h-12 flex items-center justify-center rounded-md transition-colors duration-150
              ${mode === tool ? "bg-gray-200" : "hover:bg-gray-100"}`}
          >
            <IconComponent
              className="w-6 h-6 text-gray-700"
              aria-label={label}
              role="img"
            />
          </button>
        ))}

        <button
          onClick={handleUndo}
          title="Undo"
          className="w-12 h-12 flex items-center justify-center rounded-md hover:bg-gray-100"
        >
          <ArrowUturnLeftIcon className="w-6 h-6 text-gray-700" />
        </button>

        <button
          onClick={handleDeleteAll}
          title={`Clear ${mode === "rect" ? "Rectangles" : "Lassos"}`}
          className="w-12 h-12 flex items-center justify-center rounded-md hover:bg-gray-100"
        >
          <TrashIcon className="w-6 h-6 text-gray-700" />
        </button>
      </nav>

      {/* Canvas area */}
      <main className="flex-1 flex justify-center items-center p-6">
        <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white">
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
                <KonvaImage image={bgImage} width={800} height={600} />

                {rects.map((rect, i) => (
                  <Group
                    key={`rect-${i}`}
                    onMouseEnter={() =>
                      setHoveredShape({
                        type: "Rectangle",
                        index: i,
                        x: rect.x,
                        y: rect.y,
                      })
                    }
                    onMouseLeave={() => setHoveredShape(null)}
                  >
                    <Rect
                      {...rect}
                      stroke="#3B82F6"
                      strokeWidth={2}
                      fill="rgba(59, 130, 246, 0.2)"
                    />
                  </Group>
                ))}

                {newRect && (
                  <Rect
                    {...newRect}
                    stroke="#EF4444"
                    strokeWidth={2}
                    dash={[4, 4]}
                    fill="rgba(239, 68, 68, 0.1)"
                  />
                )}

                {lassos.map((points, i) => (
                  <Group
                    key={`lasso-${i}`}
                    onMouseEnter={() =>
                      setHoveredShape({
                        type: "Lasso",
                        index: i,
                        x: points[0].x,
                        y: points[0].y,
                      })
                    }
                    onMouseLeave={() => setHoveredShape(null)}
                  >
                    <Line
                      points={points.flatMap((p) => [p.x, p.y])}
                      stroke="#10B981"
                      strokeWidth={2}
                      closed
                      fill="rgba(16, 185, 129, 0.2)"
                    />
                  </Group>
                ))}

                {currentLasso.length > 1 && (
                  <Line
                    points={currentLasso.flatMap((p) => [p.x, p.y])}
                    stroke="#EF4444"
                    strokeWidth={2}
                  />
                )}

                {shapeTooltip}
              </Layer>
            </Stage>
          )}
        </div>
      </main>
    </div>
  );
}
