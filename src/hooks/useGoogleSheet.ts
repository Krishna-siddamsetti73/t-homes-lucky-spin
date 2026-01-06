import { useState, useCallback } from "react";

interface UseGoogleSheetReturn {
  participants: string[];
  isLoading: boolean;
  error: string | null;
  fetchParticipants: (url: string) => Promise<void>;
  removeParticipant: (index: number) => void;
  resetParticipants: () => void;
}

// Demo participants for testing
const DEMO_PARTICIPANTS = [
  "Rajesh Kumar",
  "Priya Sharma",
  "Amit Patel",
  "Sneha Gupta",
  "Vikram Singh",
  "Anjali Verma",
  "Rohit Agarwal",
  "Kavita Reddy",
  "Suresh Nair",
  "Meera Joshi",
  "Arjun Mehta",
  "Pooja Chauhan",
  "Deepak Yadav",
  "Swati Mishra",
  "Rahul Saxena",
];

// Converts /edit or /view Google Sheet URL → CSV URL
const toCsvUrl = (url: string, sheetName = "Form_Responses") => {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!match) return null;

  const sheetId = match[1];

  return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
    sheetName
  )}`;
};

export const useGoogleSheet = (): UseGoogleSheetReturn => {
  const [participants, setParticipants] = useState<string[]>(DEMO_PARTICIPANTS);
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
        throw new Error("Failed to fetch data. Make sure the sheet is published.");
      }

      const csvText = await response.text();

      // Guard: user pasted non-CSV or unpublished sheet
      if (csvText.startsWith("<!DOCTYPE html") || csvText.includes("<html")) {
        throw new Error(
          "Sheet is not published. Please publish it to the web as CSV."
        );
      }

      const rows = csvText
        .split("\n")
        .map(r => r.trim())
        .filter(Boolean);

      if (rows.length < 2) {
        throw new Error("Sheet has no response data.");
      }

      // Parse header row
      const headers = rows[0]
        .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
        .map(h => h.replace(/"/g, "").trim());

      // EXACT match for your Google Form question
      const nameColumnIndex = headers.findIndex(
        h => h === "ENTER NAME"
      );

      if (nameColumnIndex === -1) {
        throw new Error('Column "What is your name?" not found.');
      }

      const names: string[] = [];

      for (let i = 1; i < rows.length; i++) {
        const columns = rows[i]
          .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
          .map(c => c.replace(/"/g, "").trim());

        const name = columns[nameColumnIndex];
        if (name) names.push(name);
      }

      if (names.length === 0) {
        throw new Error("No participant names found.");
      }

      setParticipants(names);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch participants";
      setError(message);
      console.error("Google Sheet error:", err);
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
