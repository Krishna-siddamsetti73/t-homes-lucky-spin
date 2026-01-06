import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { SpinWheel } from "@/components/SpinWheel";
import { WinnerPopup } from "@/components/WinnerPopup";
import { ParticipantCounter } from "@/components/ParticipantCounter";
import { GoogleSheetConfig } from "@/components/GoogleSheetConfig";
import { Footer } from "@/components/Footer";
import { useGoogleSheet, Participant } from "@/hooks/useGoogleSheet";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";

const Index = () => {
  const [sheetUrl, setSheetUrl] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);

  // ✅ winner is now an OBJECT, not string
  const [winner, setWinner] = useState<Participant | null>(null);
  const [showWinnerPopup, setShowWinnerPopup] = useState(false);

  const {
    participants,
    isLoading,
    error,
    fetchParticipants,
    removeParticipant,
    resetParticipants,
  } = useGoogleSheet();

  const handleSpinComplete = (_winnerName: string, index: number) => {
    const selectedWinner = participants[index];

    setWinner({
      name: selectedWinner.name,
      phone: selectedWinner.phone,
    });

    toast.success(`🎉 ${selectedWinner.name} is the winner!`);
    setShowWinnerPopup(true);
    removeParticipant(index);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeroSection />

      <main className="flex-1 px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <ParticipantCounter count={participants.length} />

            <GoogleSheetConfig
              sheetUrl={sheetUrl}
              onSheetUrlChange={setSheetUrl}
              onRefresh={() => fetchParticipants(sheetUrl)}
              isLoading={isLoading}
              isConnected={participants.length > 0 && !error}
            />
          </div>

          {error && (
            <div className="mb-8 p-4 rounded-xl bg-accent/10 border border-accent/30 text-accent text-center">
              {error}
            </div>
          )}

          <section className="flex flex-col items-center">
            {/* ✅ Pass ONLY names to SpinWheel */}
            <SpinWheel
              participants={participants.map(p => p.name)}
              onSpinComplete={handleSpinComplete}
              isSpinning={isSpinning}
              setIsSpinning={setIsSpinning}
            />

            <p className="text-muted-foreground mt-6">
              {participants.length
                ? `${participants.length} participants ready`
                : "Connect your Google Sheet to load participants"}
            </p>

            {participants.length > 0 && participants.length < 15 && (
              <button
                onClick={resetParticipants}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg
                           bg-secondary text-secondary-foreground text-sm"
              >
                <RotateCcw size={16} />
                Reset Demo Participants
              </button>
            )}
          </section>
        </div>
      </main>

      <Footer />

      {/* ✅ Winner popup gets OBJECT */}
      <WinnerPopup
        winner={winner}
        isOpen={showWinnerPopup}
        onClose={() => {
          setShowWinnerPopup(false);
          setWinner(null);
        }}
      />
    </div>
  );
};

export default Index;
