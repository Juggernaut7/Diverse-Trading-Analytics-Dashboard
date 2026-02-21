import React, { useState } from 'react';
import { TradeJournalModalProps, TradeJournalEntry } from './trade-journal-modal';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function TradeJournalModal({ trade, onClose, onSave }: TradeJournalModalProps) {
  const [annotation, setAnnotation] = useState(trade.annotation || '');
  const [strategy, setStrategy] = useState(trade.strategy || '');
  const [sentiment, setSentiment] = useState<TradeJournalEntry['sentiment']>(trade.sentiment || 'neutral');

  const handleSave = () => {
    onSave({ ...trade, annotation, strategy, sentiment });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <div className="bg-neutral-900 p-6 rounded-lg max-w-md mx-auto">
        <h2 className="text-lg font-bold mb-4 text-white">Journal Entry</h2>
        <div className="mb-3">
          <label className="block text-xs text-neutral-400 mb-1">Strategy Tag</label>
          <input
            className="w-full px-2 py-1 rounded bg-neutral-800 text-white border border-neutral-700"
            value={strategy}
            onChange={e => setStrategy(e.target.value)}
            placeholder="e.g. Breakout, Reversal, Trend Following"
          />
        </div>
        <div className="mb-3">
          <label className="block text-xs text-neutral-400 mb-1">Sentiment</label>
          <select
            className="w-full px-2 py-1 rounded bg-neutral-800 text-white border border-neutral-700"
            value={sentiment}
            onChange={e => setSentiment(e.target.value as TradeJournalEntry['sentiment'])}
          >
            <option value="bullish">Bullish</option>
            <option value="bearish">Bearish</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-xs text-neutral-400 mb-1">Annotation / Notes</label>
          <textarea
            className="w-full px-2 py-1 rounded bg-neutral-800 text-white border border-neutral-700 min-h-[60px]"
            value={annotation}
            onChange={e => setAnnotation(e.target.value)}
            placeholder="Add your thoughts, trade rationale, or lessons learned..."
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="border-neutral-700 text-neutral-400">Cancel</Button>
          <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white">Save</Button>
        </div>
      </div>
    </Dialog>
  );
}
