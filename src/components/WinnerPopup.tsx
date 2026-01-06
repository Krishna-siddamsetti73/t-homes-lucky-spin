import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Trophy, PartyPopper, Sparkles } from "lucide-react";

interface WinnerPopupProps {
  winner: string;
  isOpen: boolean;
  onClose: () => void;
}

export const WinnerPopup = ({ winner, isOpen, onClose }: WinnerPopupProps) => {
  useEffect(() => {
    if (isOpen && winner) {
      // Fire confetti from both sides
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = ["#0066CC", "#E53E3E", "#38A169", "#FFD700"];

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      // Initial burst
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { x: 0.5, y: 0.5 },
        colors: colors,
      });

      frame();
    }
  }, [isOpen, winner]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 animate-winner-entrance">
        <div className="relative bg-card rounded-3xl p-10 elevated-shadow max-w-lg mx-4 text-center overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 left-0 w-full h-2 hero-gradient" />
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-success/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
          
          {/* Floating icons */}
          <div className="absolute top-6 left-6 text-accent animate-float">
            <PartyPopper size={28} />
          </div>
          <div className="absolute top-6 right-6 text-primary animate-float" style={{ animationDelay: "0.5s" }}>
            <Sparkles size={28} />
          </div>
          
          {/* Content */}
          <div className="relative">
            {/* Trophy */}
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 rounded-full success-gradient flex items-center justify-center glow-green animate-trophy-bounce">
                <Trophy size={48} className="text-success-foreground" />
              </div>
            </div>

            {/* Congratulations text */}
            <p className="text-lg font-medium text-muted-foreground mb-2 tracking-wide uppercase">
              🎉 Congratulations 🎉
            </p>

            {/* Winner name */}
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gradient-primary mb-6">
              {winner}
            </h2>

            <p className="text-muted-foreground mb-8">
              Please come on to the stage !
            </p>

            {/* Next spin button */}
            <button
              onClick={onClose}
              className="px-8 py-4 rounded-xl font-semibold text-lg 
                hero-gradient text-primary-foreground
                hover:opacity-90 transition-all duration-300
                hover:scale-105 active:scale-95
                glow-blue"
            >
              Next Spin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
