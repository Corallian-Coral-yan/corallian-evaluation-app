// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React, { useState, useRef, useCallback } from "react";
// import {
//   Stage,
//   Layer,
//   Rect,
//   Line,
//   Text,
//   Image as KonvaImage,
//   Group,
// } from "react-konva";
// import useImage from "use-image";
// import { labelOptions } from "./modal/labelManager";
// import LabelModal from "@/components/modal/LabelModal";

// import {
//   RectangleStackIcon,
//   PencilIcon,
//   ArrowUturnLeftIcon,
//   TrashIcon,
//   PlusIcon,
//   MinusIcon,
//   ArrowPathRoundedSquareIcon,
// } from "@heroicons/react/24/outline";

// type Point = { x: number; y: number };
// type RectShape = { x: number; y: number; width: number; height: number };
// type LassoShape = Point[];

// type HoverInfo = {
//   type: "Rectangle" | "Lasso";
//   index: number;
//   x: number;
//   y: number;
// } | null;

// type RectWithLabel = RectShape & { label: string };
// type LassoWithLabel = { points: LassoShape; label: string };

// // === CATEGORY/ LABEL STATE ===
// const categories = Array.from(
//   new Set(labelOptions.map((label) => label.category).filter(Boolean))
// );

// export default function AnnotatorCanvas() {
//   const [mode, setMode] = useState<"rect" | "lasso">("rect");
//   const [rects, setRects] = useState<RectWithLabel[]>([]);
//   const [lassos, setLassos] = useState<LassoWithLabel[]>([]);
//   const [newRect, setNewRect] = useState<RectShape | null>(null);
//   const [currentLasso, setCurrentLasso] = useState<LassoShape>([]);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [hoveredShape, setHoveredShape] = useState<HoverInfo>(null);
//   const [stageScale, setStageScale] = useState(1);
//   const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
//   const [lastPanPos, setLastPanPos] = useState<Point | null>(null);
//   const [isPanning, setIsPanning] = useState(false);
//   const [labelingShape, setLabelingShape] = useState<{
//     type: "rect" | "lasso";
//     index: number | null;
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     newShape: any;
//   } | null>(null);

//   // CATEGORY/LABEL STATE
//   const [selectedCategory, setSelectedCategory] = useState(categories[0]);
//   const [selectedLabel, setSelectedLabel] = useState(
//     labelOptions.find((l) => l.category === categories[0])?.code || ""
//   );

//   const MIN_SCALE = 0.5;
//   const MAX_SCALE = 3;
//   const SCALE_BY = 1.1;

//   const [bgImage] = useImage("/coral-1.jpg");
//   const stageRef = useRef<any>(null);

//   const handleMouseDown = useCallback(
//     (e: any) => {
//       const stage = e.target.getStage();
//       const pos = stage.getPointerPosition();
//       if (!pos) return;

//       if (e.evt.button === 2) {
//         setIsPanning(true);
//         setLastPanPos(pos);
//         return;
//       }

//       setIsDrawing(true);

//       if (mode === "rect") {
//         setNewRect({ x: pos.x, y: pos.y, width: 0, height: 0 });
//       } else {
//         setCurrentLasso([pos]);
//       }
//     },
//     [mode]
//   );

//   const handleMouseMove = useCallback(
//     (e: any) => {
//       const stage = e.target.getStage();
//       const pos = stage.getPointerPosition();
//       if (!pos) return;

//       if (isPanning && lastPanPos) {
//         const dx = pos.x - lastPanPos.x;
//         const dy = pos.y - lastPanPos.y;
//         setStagePosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
//         setLastPanPos(pos);
//         return;
//       }

//       if (!isDrawing) return;

//       if (mode === "rect" && newRect) {
//         setNewRect({
//           ...newRect,
//           width: pos.x - newRect.x,
//           height: pos.y - newRect.y,
//         });
//       } else if (mode === "lasso") {
//         setCurrentLasso((prev) => [...prev, pos]);
//       }
//     },
//     [isDrawing, mode, newRect, isPanning, lastPanPos]
//   );

//   const handleMouseUp = useCallback(
//     (e: any) => {
//       if (isPanning) {
//         setIsPanning(false);
//         setLastPanPos(null);
//         return;
//       }

//       if (mode === "rect" && newRect) {
//         if (Math.abs(newRect.width) > 5 && Math.abs(newRect.height) > 5) {
//           // Reset to first category/label for modal
//           setSelectedCategory(categories[0]);
//           const firstLabel = labelOptions.find(
//             (l) => l.category === categories[0]
//           );
//           setSelectedLabel(firstLabel ? firstLabel.code : "");
//           setLabelingShape({ type: "rect", index: null, newShape: newRect });
//         }
//         setNewRect(null);
//       } else if (mode === "lasso") {
//         if (currentLasso.length > 2) {
//           setSelectedCategory(categories[0]);
//           const firstLabel = labelOptions.find(
//             (l) => l.category === categories[0]
//           );
//           setSelectedLabel(firstLabel ? firstLabel.code : "");
//           setLabelingShape({
//             type: "lasso",
//             index: null,
//             newShape: { points: currentLasso },
//           });
//         }
//         setCurrentLasso([]);
//       }
//       setIsDrawing(false);
//     },
//     [mode, newRect, currentLasso, isPanning]
//   );

//   const handleWheel = useCallback((e: any) => {
//     e.evt.preventDefault();
//     const stage = stageRef.current;
//     const oldScale = stage.scaleX();
//     const pointer = stage.getPointerPosition();
//     if (!pointer) return;

//     const mousePointTo = {
//       x: (pointer.x - stage.x()) / oldScale,
//       y: (pointer.y - stage.y()) / oldScale,
//     };

//     const direction = e.evt.deltaY > 0 ? 1 : -1;
//     let newScale = direction > 0 ? oldScale * SCALE_BY : oldScale / SCALE_BY;
//     newScale = Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE);

//     const newPos = {
//       x: pointer.x - mousePointTo.x * newScale,
//       y: pointer.y - mousePointTo.y * newScale,
//     };

//     setStageScale(newScale);
//     setStagePosition(newPos);
//   }, []);

//   const zoomIn = () => {
//     const newScale = Math.min(stageScale * SCALE_BY, MAX_SCALE);
//     setStageScale(newScale);
//   };

//   const zoomOut = () => {
//     const newScale = Math.max(stageScale / SCALE_BY, MIN_SCALE);
//     setStageScale(newScale);
//   };

//   const resetZoom = () => {
//     setStageScale(1);
//     setStagePosition({ x: 0, y: 0 });
//   };

//   const handleUndo = () => {
//     if (mode === "rect") setRects((prev) => prev.slice(0, -1));
//     else setLassos((prev) => prev.slice(0, -1));
//   };

//   const handleDeleteAll = () => {
//     if (mode === "rect") setRects([]);
//     else setLassos([]);
//   };

//   const confirmLabel = () => {
//     if (!labelingShape) return;

//     const { type, index, newShape } = labelingShape;
//     if (type === "rect") {
//       if (index === null) {
//         setRects((prev) => [...prev, { ...newShape, label: selectedLabel }]);
//       } else {
//         setRects((prev) =>
//           prev.map((r, i) => (i === index ? { ...r, label: selectedLabel } : r))
//         );
//       }
//     } else if (type === "lasso") {
//       if (index === null) {
//         setLassos((prev) => [
//           ...prev,
//           { points: newShape.points, label: selectedLabel },
//         ]);
//       } else {
//         setLassos((prev) =>
//           prev.map((l, i) =>
//             i === index ? { points: newShape.points, label: selectedLabel } : l
//           )
//         );
//       }
//     }
//     setLabelingShape(null);
//   };

//   const cancelLabel = () => {
//     setLabelingShape(null);
//   };

//   const shapeTooltip =
//     hoveredShape &&
//     (() => {
//       const labelCode =
//         hoveredShape.type === "Rectangle"
//           ? rects[hoveredShape.index]?.label
//           : lassos[hoveredShape.index]?.label;
//       const labelObj = labelOptions.find((l) => l.code === labelCode);

//       return (
//         <>
//           <Rect
//             x={hoveredShape.x}
//             y={hoveredShape.y - 40}
//             width={140}
//             height={30}
//             fill="black"
//             opacity={0.7}
//             cornerRadius={4}
//           />
//           <Text
//             x={hoveredShape.x + 5}
//             y={hoveredShape.y - 38}
//             text={`${hoveredShape.type} #${hoveredShape.index + 1}`}
//             fontSize={12}
//             fill="white"
//           />
//           <Text
//             x={hoveredShape.x + 5}
//             y={hoveredShape.y - 22}
//             text={`Label: ${labelObj ? labelObj.name : labelCode || "N/A"}`}
//             fontSize={12}
//             fill="white"
//           />
//         </>
//       );
//     })();

//   // Hover handlers for shapes
//   const handleRectMouseEnter = (index: number) => {
//     setHoveredShape({ type: "Rectangle", index, x: 10, y: 10 });
//   };
//   const handleRectMouseLeave = () => {
//     setHoveredShape(null);
//   };
//   const handleLassoMouseEnter = (index: number) => {
//     setHoveredShape({ type: "Lasso", index, x: 10, y: 10 });
//   };
//   const handleLassoMouseLeave = () => {
//     setHoveredShape(null);
//   };

//   // Filter labels by selectedCategory for modal
//   const filteredLabels = labelOptions.filter(
//     (label) => label.category === selectedCategory
//   );

//   return (
//     <div className="flex min-h-screen bg-gray-50 font-sans">
//       {/* Toolbar */}
//       <nav className="flex flex-col items-center gap-2 py-6 px-2 bg-white shadow-md border-r border-gray-200 w-16">
//         {/* === Drawing Tools === */}
//         <div className="flex flex-col items-center gap-2">
//           <button
//             onClick={() => setMode("rect")}
//             title="Rectangle"
//             className={`w-12 h-12 flex items-center justify-center rounded-md transition-colors duration-150
//         ${mode === "rect" ? "bg-gray-200" : "hover:bg-gray-100"}`}
//           >
//             <RectangleStackIcon className="w-6 h-6 text-gray-700" />
//           </button>

//           <button
//             onClick={() => setMode("lasso")}
//             title="Lasso"
//             className={`w-12 h-12 flex items-center justify-center rounded-md transition-colors duration-150
//         ${mode === "lasso" ? "bg-gray-200" : "hover:bg-gray-100"}`}
//           >
//             <PencilIcon className="w-6 h-6 text-gray-700" />
//           </button>
//         </div>

//         <div className="w-8 border-t border-gray-300 my-2" />

//         {/* === Edit Actions === */}
//         <div className="flex flex-col items-center gap-2">
//           <button
//             onClick={handleUndo}
//             title="Undo"
//             className="w-12 h-12 flex items-center justify-center rounded-md hover:bg-gray-100"
//           >
//             <ArrowUturnLeftIcon className="w-6 h-6 text-gray-700" />
//           </button>

//           <button
//             onClick={handleDeleteAll}
//             title={`Clear ${mode === "rect" ? "Rectangles" : "Lassos"}`}
//             className="w-12 h-12 flex items-center justify-center rounded-md hover:bg-gray-100"
//           >
//             <TrashIcon className="w-6 h-6 text-gray-700" />
//           </button>
//         </div>

//         <div className="w-8 border-t border-gray-300 my-2" />

//         {/* === Zoom Controls === */}
//         <div className="flex flex-col items-center gap-2">
//           <button
//             onClick={zoomIn}
//             title="Zoom In"
//             className="w-12 h-12 flex items-center justify-center rounded-md hover:bg-gray-100"
//           >
//             <PlusIcon className="w-6 h-6 text-gray-700" />
//           </button>
//           <button
//             onClick={zoomOut}
//             title="Zoom Out"
//             className="w-12 h-12 flex items-center justify-center rounded-md hover:bg-gray-100"
//           >
//             <MinusIcon className="w-6 h-6 text-gray-700" />
//           </button>
//           <button
//             onClick={resetZoom}
//             title="Reset Zoom"
//             className="w-12 h-12 flex items-center justify-center rounded-md hover:bg-gray-100"
//           >
//             <ArrowPathRoundedSquareIcon className="w-6 h-6 text-gray-700" />
//           </button>
//         </div>
//       </nav>

//       {/* Canvas */}
//       <div className="flex-1 flex justify-center items-center bg-gray-100 p-4">
//         <Stage
//           ref={stageRef}
//           width={900}
//           height={600}
//           onMouseDown={handleMouseDown}
//           onMouseMove={handleMouseMove}
//           onMouseUp={handleMouseUp}
//           onWheel={handleWheel}
//           scaleX={stageScale}
//           scaleY={stageScale}
//           x={stagePosition.x}
//           y={stagePosition.y}
//           style={{ cursor: isPanning ? "grabbing" : "crosshair" }}
//           onContextMenu={(e) => e.evt.preventDefault()}
//         >
//           <Layer>
//             {/* Background image */}
//             {bgImage && <KonvaImage image={bgImage} width={900} height={600} />}

//             {/* Rectangles */}
//             {rects.map((rect, i) => {
//               const labelObj = labelOptions.find((l) => l.code === rect.label);
//               return (
//                 <Group
//                   key={`rect-${i}`}
//                   onMouseEnter={(e) => {
//                     e.target.getStage().container().style.cursor = "pointer";
//                     setHoveredShape({
//                       type: "Rectangle",
//                       index: i,
//                       x: e.target.x(),
//                       y: e.target.y(),
//                     });
//                   }}
//                   onMouseLeave={(e) => {
//                     e.target.getStage().container().style.cursor = "crosshair";
//                     setHoveredShape(null);
//                   }}
//                 >
//                   <Rect
//                     x={rect.x}
//                     y={rect.y}
//                     width={rect.width}
//                     height={rect.height}
//                     stroke="red"
//                     strokeWidth={2}
//                     dash={[6, 4]}
//                     fill="rgba(255,0,0,0.15)"
//                   />
//                   <Text
//                     x={rect.x + 5}
//                     y={rect.y + 5}
//                     text={labelObj ? labelObj.name : rect.label}
//                     fontSize={14}
//                     fill="red"
//                     fontStyle="bold"
//                   />
//                 </Group>
//               );
//             })}

//             {/* Lassos */}
//             {lassos.map(({ points, label }, i) => {
//               const labelObj = labelOptions.find((l) => l.code === label);
//               return (
//                 <Group
//                   key={`lasso-${i}`}
//                   onMouseEnter={(e) => {
//                     e.target.getStage().container().style.cursor = "pointer";
//                     const firstPoint = points[0];
//                     setHoveredShape({
//                       type: "Lasso",
//                       index: i,
//                       x: firstPoint.x,
//                       y: firstPoint.y,
//                     });
//                   }}
//                   onMouseLeave={(e) => {
//                     e.target.getStage().container().style.cursor = "crosshair";
//                     setHoveredShape(null);
//                   }}
//                 >
//                   <Line
//                     points={points.flatMap((p) => [p.x, p.y])}
//                     stroke="blue"
//                     strokeWidth={2}
//                     closed
//                     fill="rgba(0,0,255,0.15)"
//                     tension={0.3}
//                   />
//                   {points.length > 0 && (
//                     <Text
//                       x={points[0].x + 5}
//                       y={points[0].y + 5}
//                       text={labelObj ? labelObj.name : label}
//                       fontSize={14}
//                       fill="blue"
//                       fontStyle="bold"
//                     />
//                   )}
//                 </Group>
//               );
//             })}

//             {/* Drawing current shapes */}
//             {isDrawing && mode === "rect" && newRect && (
//               <Rect
//                 x={newRect.x}
//                 y={newRect.y}
//                 width={newRect.width}
//                 height={newRect.height}
//                 stroke="green"
//                 strokeWidth={2}
//                 dash={[4, 2]}
//                 fill="rgba(0,255,0,0.1)"
//               />
//             )}

//             {isDrawing && mode === "lasso" && currentLasso.length > 0 && (
//               <Line
//                 points={currentLasso.flatMap((p) => [p.x, p.y])}
//                 stroke="green"
//                 strokeWidth={2}
//                 tension={0.3}
//                 lineCap="round"
//                 lineJoin="round"
//               />
//             )}

//             {/* Tooltip */}
//             {hoveredShape && shapeTooltip}
//           </Layer>
//         </Stage>

//         {/* --- Label Modal with Category Selection --- */}
//         <LabelModal
//           isOpen={!!labelingShape}
//           categories={categories}
//           labelOptions={labelOptions}
//           onConfirm={(labelCode) => {
//             // Save label and close modal
//             if (!labelingShape) return;
//             const { type, index, newShape } = labelingShape;
//             if (type === "rect") {
//               if (index === null) {
//                 setRects((prev) => [
//                   ...prev,
//                   { ...newShape, label: labelCode },
//                 ]);
//               } else {
//                 setRects((prev) =>
//                   prev.map((r, i) =>
//                     i === index ? { ...r, label: labelCode } : r
//                   )
//                 );
//               }
//             } else if (type === "lasso") {
//               if (index === null) {
//                 setLassos((prev) => [
//                   ...prev,
//                   { points: newShape.points, label: labelCode },
//                 ]);
//               } else {
//                 setLassos((prev) =>
//                   prev.map((l, i) =>
//                     i === index
//                       ? { points: newShape.points, label: labelCode }
//                       : l
//                   )
//                 );
//               }
//             }
//             setLabelingShape(null);
//           }}
//           onCancel={() => setLabelingShape(null)}
//         />
//       </div>
//     </div>
//   );
// }
