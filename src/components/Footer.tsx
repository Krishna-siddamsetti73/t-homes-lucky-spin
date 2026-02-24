import { Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="py-8 px-4 border-t border-border/50">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo + Tagline */}
        <div className="flex items-center gap-3">
          <img
            src="/thomeslogo-removebg-preview.png"
            alt="Thomes Infra Logo"
            className="w-10 h-10 object-contain"
          />
          <div>
            <p className="text-sm font-medium text-foreground">
              Thomes Infra
            </p>
            <p className="text-sm text-muted-foreground">
              Building Dreams, Creating Homes
            </p>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          Made with{" "}
          <Heart size={14} className="text-accent fill-accent" />{" "}
          for our valued customers
        </p>

      </div>
    </footer>
  );
};