import { Trade } from '@/lib/types';

export interface TradeJournalEntry extends Trade {
  sentiment?: 'bullish' | 'bearish' | 'neutral';
  strategy?: string;
  annotation?: string;
}

export interface TradeJournalModalProps {
  trade: TradeJournalEntry;
  onClose: () => void;
  onSave: (entry: TradeJournalEntry) => void;
}

// This will be a modal component for editing/annotating a trade journal entry.
// UI and logic to be implemented in next steps.