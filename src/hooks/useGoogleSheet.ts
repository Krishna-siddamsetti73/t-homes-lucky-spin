import { useState, useCallback } from "react";

export interface Participant {
  name: string;
  phone: string;
}

interface UseGoogleSheetReturn {
  participants: Participant[];
  isLoading: boolean;
  error: string | null;
  fetchParticipants: (url: string) => Promise<void>;
  removeParticipant: (index: number) => void;
  resetParticipants: () => void;
}

// Demo participants
const DEMO_PARTICIPANTS: Participant[] = [
  { name: "Rajesh Kumar", phone: "9000000001" },
  { name: "Priya Sharma", phone: "9000000002" },
  { name: "Amit Patel", phone: "9000000003" },
];

// Convert Google Sheet link → CSV link
const toCsvUrl = (url: string, sheetName = "Form_Responses") => {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!match) return null;

  const sheetId = match[1];
  return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
    sheetName
  )}`;
};

export const useGoogleSheet = (): UseGoogleSheetReturn => {
  const [participants, setParticipants] =
    useState<Participant[]>(DEMO_PARTICIPANTS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchParticipants = useCallback(async (url: string) => {
    if (!url) {
      setError("Please provide a valid Google Sheet URL");
      return;
    }

    const csvUrl = toCsvUrl(url);
    if (!csvUrl) {
      setError("Invalid Google Sheets URL");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch sheet. Make sure it is published.");
      }

      const csvText = await response.text();
      if (csvText.includes("<html")) {
        throw new Error("Sheet is not published as CSV.");
      }

      const rows = csvText
        .split("\n")
        .map(r => r.trim())
        .filter(Boolean);

      if (rows.length < 2) {
        throw new Error("Sheet has no data.");
      }

      const headers = rows[0]
        .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
        .map(h => h.replace(/"/g, "").trim());

      const nameCol = headers.findIndex(h => h === "ENTER NAME");
      const phoneCol = headers.findIndex(h => h === "ENTER PHONE NUMBER");

      if (nameCol === -1 || phoneCol === -1) {
        throw new Error("Name or Phone Number column not found.");
      }

      const parsed: Participant[] = [];

      for (let i = 1; i < rows.length; i++) {
        const cols = rows[i]
          .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
          .map(c => c.replace(/"/g, "").trim());

        const name = cols[nameCol];
        const phone = cols[phoneCol];

        if (name && phone) {
          parsed.push({ name, phone });
        }
      }

      if (!parsed.length) {
        throw new Error("No participants found.");
      }

      setParticipants(parsed);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load sheet";
      setError(msg);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeParticipant = useCallback((index: number) => {
    setParticipants(prev => prev.filter((_, i) => i !== index));
  }, []);

  const resetParticipants = useCallback(() => {
    setParticipants(DEMO_PARTICIPANTS);
  }, []);

  return {
    participants,
    isLoading,
    error,
    fetchParticipants,
    removeParticipant,
    resetParticipants,
  };
};
