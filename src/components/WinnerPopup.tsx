"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Trophy, Phone } from "lucide-react";

interface WinnerPopupProps {
  winner: {
    name: string;
    phone: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WinnerPopup = ({ winner, isOpen, onClose }: WinnerPopupProps) => {
  useEffect(() => {
    if (isOpen && winner) {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { x: 0.5, y: 0.5 },
      });
    }
  }, [isOpen, winner]);

  if (!isOpen || !winner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup */}
      <div className="relative z-10 bg-card rounded-3xl p-10 max-w-lg mx-4 text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 rounded-full success-gradient flex items-center justify-center">
            <Trophy size={48} className="text-success-foreground" />
          </div>
        </div>

        <p className="text-lg font-medium text-muted-foreground mb-2 uppercase">
          🎉 Congratulations 🎉
        </p>

        <h2 className="text-4xl font-bold mb-4 text-gradient-primary">
          {winner.name}
        </h2>

        <div className="flex items-center justify-center gap-2 mb-6 text-lg font-medium">
          <Phone size={18} />
          <span>{winner.phone}</span>
        </div>

        <p className="text-muted-foreground mb-8">
          Please come on to the stage!
        </p>

        <button
          type="button"
          onClick={onClose}
          className="px-8 py-4 rounded-xl font-semibold text-lg hero-gradient text-primary-foreground"
        >
          Next Spin
        </button>
      </div>
    </div>
  );
};