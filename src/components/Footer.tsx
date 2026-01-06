import { Building2, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="py-8 px-4 border-t border-border/50">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          
          <div>
           <img src="/thomeslogo-removebg-preview.png" className="w-10 h-10flex items-center justify-center" ></img>
            <p className="text-sm text-muted-foreground">Building Dreams, Creating Homes</p>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          Made with <Heart size={14} className="text-accent fill-accent" /> for our valued customers
        </p>
      </div>
    </footer>
  );
};
