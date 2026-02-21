import { Trade } from '@/lib/types';

export interface TradeJournalEntry extends Trade {
  sentiment?: 'bullish' | 'bearish' | 'neutral';
  strategy?: string;
  annotation?: string;
}

export type TradeJournal = TradeJournalEntry[];
