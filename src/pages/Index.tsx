"use client";

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
  const [sheetUrl1, setSheetUrl1] = useState("");
  const [sheetUrl2, setSheetUrl2] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);

  const [winner, setWinner] = useState<Participant | null>(null);
  const [showWinnerPopup, setShowWinnerPopup] = useState(false);

  const {
    participants,
    sheet1Participants,
    sheet2Participants,
    isLoading1,
    isLoading2,
    error,
    fetchParticipants,
    removeParticipant,
    resetParticipants,
  } = useGoogleSheet();

  // ✅ Handle spin result
  const handleSpinComplete = (_winnerName: string, index: number) => {
    const selectedWinner = participants[index];

    setWinner({
      name: selectedWinner.name,
      phone: selectedWinner.phone,
    });

    toast.success(
      `🎉 ${selectedWinner.name} (${selectedWinner.phone}) is the winner!`
    );

    setShowWinnerPopup(true);
    removeParticipant(index);
  };

  /**
   * ✅ CORE FIX:
   * - If sheet2 has participants → spin from sheet2
   * - Else if sheet1 has participants → spin from sheet1
   * - Else → no spin
   */
  const eligibleIndexes =
    sheet2Participants.length > 0
      ? participants
          .map((p, idx) => (p.source === "sheet2" ? idx : -1))
          .filter(i => i !== -1)
      : sheet1Participants.length > 0
      ? participants
          .map((p, idx) => (p.source === "sheet1" ? idx : -1))
          .filter(i => i !== -1)
      : [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeroSection />

      <main className="flex-1 px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Top Controls */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <ParticipantCounter count={participants.length} />

            <GoogleSheetConfig
              title="First Sheet"
              sheetUrl={sheetUrl1}
              onSheetUrlChange={setSheetUrl1}
              onRefresh={() => fetchParticipants(sheetUrl1, "sheet1")}
              isLoading={isLoading1}
              isConnected={sheet1Participants.length > 0 && !error}
            />

            <GoogleSheetConfig
              title="Second Sheet (Primary Winners)"
              sheetUrl={sheetUrl2}
              onSheetUrlChange={setSheetUrl2}
              onRefresh={() => fetchParticipants(sheetUrl2, "sheet2")}
              isLoading={isLoading2}
              isConnected={sheet2Participants.length > 0 && !error}
            />
          </div>

          {error && (
            <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-center">
              {error}
            </div>
          )}

          {/* Spin Section */}
          <section className="flex flex-col items-center">
            <SpinWheel
              participants={participants.map(p => p.name)}
              eligibleIndexes={eligibleIndexes}
              onSpinComplete={handleSpinComplete}
              isSpinning={isSpinning}
              setIsSpinning={setIsSpinning}
            />

            {/* Status messages */}
            {sheet2Participants.length === 0 &&
              sheet1Participants.length > 0 && (
                <p className="text-sm text-green-600 mt-4">
                  Second sheet completed 🎉 Now spinning from first sheet
                </p>
              )}

            {sheet1Participants.length === 0 &&
              sheet2Participants.length === 0 && (
                <p className="text-sm text-red-500 mt-4">
                  All participants completed
                </p>
              )}

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

      {/* Winner Popup */}
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