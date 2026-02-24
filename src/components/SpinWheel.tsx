"use client";

import { useRef, useState, useEffect } from "react";

interface SpinWheelProps {
  participants: string[];
  /** list of indices within `participants` that are eligible to win; if absent all are eligible */
  eligibleIndexes?: number[];
  onSpinComplete: (winner: string, index: number) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
}

const WHEEL_COLORS = [
  "hsl(210, 100%, 45%)",
  "hsl(210, 100%, 35%)",
  "hsl(0, 85%, 55%)",
  "hsl(145, 70%, 42%)",
  "hsl(210, 80%, 50%)",
  "hsl(0, 70%, 45%)",
  "hsl(145, 60%, 35%)",
  "hsl(220, 60%, 40%)",
];

const CANVAS_SIZE = 580;
const CENTER_RADIUS = 55;
const INNER_TEXT_RADIUS = 130;

export const SpinWheel = ({
  participants,
  eligibleIndexes,
  onSpinComplete,
  isSpinning,
  setIsSpinning,
}: SpinWheelProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const animationRef = useRef<number | null>(null);

  const drawWheel = (
    ctx: CanvasRenderingContext2D,
    rotationDeg: number
  ) => {
    const { width, height } = ctx.canvas;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(cx, cy) - 20;

    ctx.clearRect(0, 0, width, height);

    // Glow
    ctx.save();
    ctx.shadowColor = "hsl(210, 100%, 50%)";
    ctx.shadowBlur = 40;
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 8, 0, Math.PI * 2);
    ctx.fillStyle = "hsl(210, 100%, 40%)";
    ctx.fill();
    ctx.restore();

    // Outer ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 6, 0, Math.PI * 2);
    ctx.fillStyle = "hsl(220, 30%, 18%)";
    ctx.fill();

    if (!participants.length) {
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = "hsl(210, 100%, 40%)";
      ctx.fill();

      ctx.fillStyle = "#fff";
      ctx.font = "bold 12px Inter";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("No participants", cx, cy);
      return;
    }

    const slice = (Math.PI * 2) / participants.length;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((rotationDeg * Math.PI) / 180);
    ctx.translate(-cx, -cy);

    participants.forEach((name, i) => {
      const start = i * slice - Math.PI / 2;
      const end = start + slice;

      // Slice
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length];
      ctx.fill();

      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + slice / 2);
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#fff";
      ctx.font = "bold 14px Inter";

      const label = name.length > 14 ? name.slice(0, 12) + "…" : name;
      ctx.fillText(label, INNER_TEXT_RADIUS, 0);
      ctx.restore();
    });

    ctx.restore();

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, CENTER_RADIUS, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, CENTER_RADIUS);
    grad.addColorStop(0, "hsl(0,85%,60%)");
    grad.addColorStop(1, "hsl(0,85%,45%)");
    ctx.fillStyle = grad;
    ctx.fill();

    // Pointer
    ctx.beginPath();
    ctx.moveTo(cx + radius + 22, cy);
    ctx.lineTo(cx + radius - 6, cy - 18);
    ctx.lineTo(cx + radius - 6, cy + 18);
    ctx.closePath();
    ctx.fillStyle = "hsl(0,85%,55%)";
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawWheel(ctx, rotation);
  }, [participants, rotation]);

  const spin = () => {
    if (isSpinning || !participants.length) return;

    if (eligibleIndexes && eligibleIndexes.length === 0) return;

    setIsSpinning(true);

    const candidates =
      eligibleIndexes && eligibleIndexes.length > 0
        ? eligibleIndexes
        : participants.map((_, i) => i);

    const chosen =
      candidates[Math.floor(Math.random() * candidates.length)];

    const slice = 360 / participants.length;
    const target = 360 * 8 + (360 - chosen * slice - slice / 2);

    const duration = 4000;
    let start: number | null = null;

    const animate = (time: number) => {
      if (!start) start = time;
      const t = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);

      setRotation((eased * target) % 360);

      if (t < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        onSpinComplete(participants[chosen], chosen);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="flex justify-center">
      <div
        className="relative"
        style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
      >
        <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE} />

        {eligibleIndexes && eligibleIndexes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-red-500 font-semibold">
           
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={spin}
          disabled={
            isSpinning ||
            (eligibleIndexes !== undefined && eligibleIndexes.length === 0)
          }
          className="absolute inset-0 m-auto w-24 h-24 rounded-full
                     font-bold text-lg text-white z-10
                     transition-transform duration-300
                     hover:scale-105 active:scale-95"
          style={{
            background: "transparent",
            textShadow: "0 2px 4px rgba(0,0,0,.3)",
          }}
        >
          {isSpinning ? "..." : "SPIN"}
        </button>
      </div>
    </div>
  );
};