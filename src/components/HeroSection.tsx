"use client";

export const HeroSection = () => {
  return (
    <header className="relative py-12 px-4 overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-success/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/3 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Brand logo */}
        <div className="mb-6 flex justify-center">
          <img
            src="/thomeslogo-removebg-preview.png"
            alt="Thomes Infra Logo"
            className="h-[180px] w-auto object-contain"
          />
        </div>

        {/* Main title */}
        <h1 className="font-display text-5xl md:text-7xl font-bold mb-4">
          <span className="text-gradient-primary">Spin</span>
          <span className="text-foreground"> & </span>
          <span className="text-accent">Win</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto">
          Celebrating Our Valued Customers
        </p>

        {/* Decorative line */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-primary/50" />
          <div className="w-3 h-3 rounded-full bg-accent" />
          <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-primary/50" />
        </div>
      </div>
    </header>
  );
};