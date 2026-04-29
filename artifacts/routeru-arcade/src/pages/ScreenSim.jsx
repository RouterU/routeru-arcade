import React, { useState } from "react";
import screenSimData from "../data/screenSim.json";

export default function ScreenSim() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [clickPoint, setClickPoint] = useState(null);
  const [score, setScore] = useState(0);

  const current = screenSimData[currentIndex];

  function handleImageClick(e) {
    if (result) return;

    const rect = e.currentTarget.getBoundingClientRect();

    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    setClickPoint({ x: clickX, y: clickY });

    const isCorrect = current.correctZones.some((zone) => {
      return (
        clickX >= zone.x &&
        clickX <= zone.x + zone.width &&
        clickY >= zone.y &&
        clickY <= zone.y + zone.height
      );
    });

    if (isCorrect) {
      setScore((prev) => prev + 100);
      setResult("correct");
    } else {
      setResult("incorrect");
    }
  }

  function nextQuestion() {
    setResult(null);
    setClickPoint(null);

    if (currentIndex < screenSimData.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      alert(`Training complete! Final score: ${score}`);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Route Planner Simulator</h1>
          <p className="text-slate-300 mt-2">
            Click the area of the screen where you would make the change.
          </p>
          <p className="mt-2 font-semibold">Score: {score}</p>
        </div>

        <div className="bg-slate-900 rounded-2xl p-5 shadow-xl">
          <h2 className="text-xl font-semibold mb-4">
            {current.question}
          </h2>

          <div className="relative border border-slate-700 rounded-xl overflow-hidden">
            <img
              src={current.image}
              alt={current.title}
              className="w-full block cursor-crosshair"
              onClick={handleImageClick}
            />

            {clickPoint && (
              <div
                className={`absolute w-5 h-5 rounded-full border-2 -translate-x-1/2 -translate-y-1/2 ${
                  result === "correct"
                    ? "bg-green-500 border-white"
                    : "bg-red-500 border-white"
                }`}
                style={{
                  left: `${clickPoint.x}%`,
                  top: `${clickPoint.y}%`
                }}
              />
            )}

            {result && current.correctZones.map((zone, index) => (
              <div
                key={index}
                className="absolute border-4 border-green-400 bg-green-400/20 rounded-md"
                style={{
                  left: `${zone.x}%`,
                  top: `${zone.y}%`,
                  width: `${zone.width}%`,
                  height: `${zone.height}%`
                }}
              />
            ))}
          </div>

          {result && (
            <div
              className={`mt-5 p-4 rounded-xl ${
                result === "correct"
                  ? "bg-green-900/60 border border-green-500"
                  : "bg-red-900/60 border border-red-500"
              }`}
            >
              <h3 className="text-lg font-bold">
                {result === "correct" ? "Correct!" : "Not quite."}
              </h3>
              <p className="mt-2 text-slate-100">
                {current.explanation}
              </p>

              <button
                onClick={nextQuestion}
                className="mt-4 px-5 py-2 rounded-lg bg-white text-slate-950 font-bold hover:bg-slate-200"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
