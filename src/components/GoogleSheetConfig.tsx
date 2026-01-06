import { useState } from "react";
import { Settings, RefreshCw, Link, CheckCircle } from "lucide-react";

interface GoogleSheetConfigProps {
  sheetUrl: string;
  onSheetUrlChange: (url: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
  isConnected: boolean;
}

export const GoogleSheetConfig = ({ 
  sheetUrl, 
  onSheetUrlChange, 
  onRefresh, 
  isLoading,
  isConnected 
}: GoogleSheetConfigProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-card rounded-2xl p-6 card-shadow border border-border/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 w-full text-left"
      >
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isConnected ? 'success-gradient' : 'hero-gradient'}`}>
          {isConnected ? (
            <CheckCircle size={20} className="text-success-foreground" />
          ) : (
            <Settings size={20} className="text-primary-foreground" />
          )}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-foreground">Google Sheet Connection</p>
          <p className="text-sm text-muted-foreground">
            {isConnected ? "Connected & synced" : "Configure data source"}
          </p>
        </div>
        <svg
          className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-6 pt-6 border-t border-border/50 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Link size={14} className="inline mr-2" />
              Published Google Sheet URL
            </label>
            <input
              type="url"
              value={sheetUrl}
              onChange={(e) => onSheetUrlChange(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/e/xxx/pub?output=csv"
              className="w-full px-4 py-3 rounded-xl bg-secondary border border-border 
                text-foreground placeholder:text-muted-foreground
                focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                transition-all duration-200"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Publish your Google Sheet: File → Share → Publish to Web → Select CSV format
            </p>
          </div>

          <button
            onClick={onRefresh}
            disabled={isLoading || !sheetUrl}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium
              hero-gradient text-primary-foreground
              hover:opacity-90 transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            {isLoading ? 'Fetching...' : 'Fetch Participants'}
          </button>
        </div>
      )}
    </div>
  );
};
