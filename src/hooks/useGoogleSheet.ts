import { useState, useCallback, useMemo } from "react";

export interface Participant {
  name: string;
  phone: string;
  /** which sheet the row came from */
  source?: "sheet1" | "sheet2";
}

interface UseGoogleSheetReturn {
  participants: Participant[];
  sheet1Participants: Participant[];
  sheet2Participants: Participant[];
  isLoading: boolean;
  isLoading1: boolean;
  isLoading2: boolean;
  error: string | null;
  fetchParticipants: (
    url: string,
    source: "sheet1" | "sheet2"
  ) => Promise<void>;
  removeParticipant: (index: number) => void;
  resetParticipants: () => void;
}

// Demo data defaults to sheet1 so that the wheel still has some values
const DEMO_PARTICIPANTS: Participant[] = [
  { name: "Rajesh Kumar", phone: "9000000001", source: "sheet1" },
  { name: "Priya Sharma", phone: "9000000002", source: "sheet1" },
  { name: "Amit Patel", phone: "9000000003", source: "sheet1" },
];

// helper to turn a sharing URL into csv-export endpoint
const toCsvUrl = (url: string, sheetName = "Form_Responses") => {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!match) return null;
  const sheetId = match[1];
  return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
    sheetName
  )}`;
};

export const useGoogleSheet = (): UseGoogleSheetReturn => {
  const [sheet1Participants, setSheet1Participants] =
    useState<Participant[]>(DEMO_PARTICIPANTS);
  const [sheet2Participants, setSheet2Participants] = useState<Participant[]>([]);

  const participants = useMemo(
    () => [...sheet1Participants, ...sheet2Participants],
    [sheet1Participants, sheet2Participants]
  );

  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const isLoading = isLoading1 || isLoading2;
  const [error, setError] = useState<string | null>(null);

  const fetchParticipants = useCallback(
    async (url: string, source: "sheet1" | "sheet2") => {
      if (!url) {
        setError("Please provide a valid Google Sheet URL");
        return;
      }
      const csvUrl = toCsvUrl(url);
      if (!csvUrl) {
        setError("Invalid Google Sheets URL");
        return;
      }

      source === "sheet1" ? setIsLoading1(true) : setIsLoading2(true);
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
          .split(/,(?=(?:(?:[^\"]*\"){2})*[^\"]*$)/)
          .map(h => h.replace(/\"/g, "").trim());

        const nameCol = headers.findIndex(h => h === "ENTER NAME");
        const phoneCol = headers.findIndex(h => h === "ENTER PHONE NUMBER");

        if (nameCol === -1 || phoneCol === -1) {
          throw new Error("Name or Phone Number column not found.");
        }

        const parsed: Participant[] = [];
        for (let i = 1; i < rows.length; i++) {
          const cols = rows[i]
            .split(/,(?=(?:(?:[^\"]*\"){2})*[^\"]*$)/)
            .map(c => c.replace(/\"/g, "").trim());
          const name = cols[nameCol];
          const phone = cols[phoneCol];
          if (name && phone) {
            parsed.push({ name, phone, source });
          }
        }

        if (!parsed.length) {
          throw new Error("No participants found.");
        }

        if (source === "sheet1") {
          setSheet1Participants(parsed);
        } else {
          setSheet2Participants(parsed);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to load sheet";
        setError(msg);
        console.error(err);
      } finally {
        source === "sheet1" ? setIsLoading1(false) : setIsLoading2(false);
      }
    },
    []
  );

  const removeParticipant = useCallback(
    (index: number) => {
      const sheet1Len = sheet1Participants.length;
      if (index < sheet1Len) {
        setSheet1Participants(prev => prev.filter((_, i) => i !== index));
      } else {
        setSheet2Participants(prev =>
          prev.filter((_, i) => i !== index - sheet1Len)
        );
      }
    },
    [sheet1Participants]
  );

  const resetParticipants = useCallback(() => {
    setSheet1Participants(DEMO_PARTICIPANTS);
    setSheet2Participants([]);
  }, []);

  return {
    participants,
    sheet1Participants,
    sheet2Participants,
    isLoading,
    isLoading1,
    isLoading2,
    error,
    fetchParticipants,
    removeParticipant,
    resetParticipants,
  };
};
