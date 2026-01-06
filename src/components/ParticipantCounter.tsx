import { useEffect, useState } from "react";
import { Users } from "lucide-react";

interface ParticipantCounterProps {
  count: number;
}

export const ParticipantCounter = ({ count }: ParticipantCounterProps) => {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    if (count === 0) {
      setDisplayCount(0);
      return;
    }

    // Animate count up
    const duration = 1500;
    const steps = 30;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const newCount = Math.round(easeOut * count);
      
      setDisplayCount(newCount);
      
      if (currentStep >= steps) {
        setDisplayCount(count);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [count]);

  return (
    <div className="bg-card rounded-2xl p-6 card-shadow border border-border/50">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl hero-gradient flex items-center justify-center glow-blue">
          <Users size={28} className="text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Total Participants
          </p>
          <p className="text-4xl font-display font-bold text-gradient-primary animate-count-up">
            {displayCount}
          </p>
        </div>
      </div>
    </div>
  );
};
