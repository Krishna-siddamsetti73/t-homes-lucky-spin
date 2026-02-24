"use client";

import { useState } from "react";
import { Settings, RefreshCw, Link as LinkIcon, CheckCircle } from "lucide-react";

interface GoogleSheetConfigProps {
  sheetUrl: string;
  onSheetUrlChange: (url: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
  isConnected: boolean;
  /** optional label shown at top of the box */
  title?: string;
}

export const GoogleSheetConfig = ({
  sheetUrl,
  onSheetUrlChange,
  onRefresh,
  isLoading,
  isConnected,
  title,
}: GoogleSheetConfigProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-card rounded-2xl p-6 border border-border/50">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-3 w-full text-left"
      >
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isConnected ? "success-gradient" : "hero-gradient"
          }`}
        >
          {isConnected ? (
            <CheckCircle size={20} />
          ) : (
            <Settings size={20} />
          )}
        </div>

        <div className="flex-1">
          <p className="font-semibold">Google Sheet Connection</p>

          {title && (
            <p className="text-xs text-muted-foreground">{title}</p>
          )}

          <p className="text-sm text-muted-foreground">
            {isConnected ? "Connected & synced" : "Configure data source"}
          </p>
        </div>
      </button>

      {/* Expandable content */}
      {isOpen && (
        <div className="mt-6 pt-6 border-t border-border/50 space-y-4">
          <label className="block text-sm font-medium">
            <LinkIcon size={14} className="inline mr-2" />
            Google Sheet URL
          </label>

          <input
            type="url"
            value={sheetUrl}
            onChange={e => onSheetUrlChange(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/..."
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border outline-none focus:ring-2 focus:ring-accent"
          />

          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading || !sheetUrl}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-primary-foreground
              ${isLoading || !sheetUrl ? "opacity-60 cursor-not-allowed" : "hero-gradient"}
            `}
          >
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
            {isLoading ? "Fetching..." : "Fetch Participants"}
          </button>
        </div>
      )}
    </div>
  );
};