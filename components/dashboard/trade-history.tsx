'use client';

import { useState } from 'react';
import { Trade } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge'; // Ensure this exists or use inline styles
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TradeHistoryProps {
  trades: Trade[];
  onNotesUpdate?: (tradeId: string, notes: string) => void;
}

type SortField = 'date' | 'symbol' | 'type' | 'pnl' | 'duration';
type SortDirection = 'asc' | 'desc';

export function TradeHistory({ trades, onNotesUpdate }: TradeHistoryProps) {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedTrades = [...trades].sort((a, b) => {
    let compareA: any;
    let compareB: any;
    switch (sortField) {
      case 'date':
        compareA = a.entryTime;
        compareB = b.entryTime;
        break;
      case 'symbol':
        compareA = a.symbol;
        compareB = b.symbol;
        break;
      case 'type':
        compareA = a.type;
        compareB = b.type;
        break;
      case 'pnl':
        compareA = a.pnl || 0;
        compareB = b.pnl || 0;
        break;
      case 'duration':
        compareA = a.durationMinutes || 0;
        compareB = b.durationMinutes || 0;
        break;
      default:
        compareA = a.entryTime;
        compareB = b.entryTime;
    }

    if (compareA < compareB) return sortDirection === 'asc' ? -1 : 1;
    if (compareA > compareB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedTrades.length / itemsPerPage);
  const paginatedTrades = sortedTrades.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEditNote = (trade: Trade) => {
    setEditingId(trade.id);
    setEditText(trade.notes || '');
  };

  const handleSaveNote = (tradeId: string) => {
    onNotesUpdate?.(tradeId, editText);
    setEditingId(null);
  };

  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="text-neutral-600">⇅</span>;
    return sortDirection === 'asc' ? <span className="text-emerald-400">↑</span> : <span className="text-emerald-400">↓</span>;
  };

  return (
    <Card className="p-4 sm:p-6 bg-[#0A0A0A] border-[#1F1F1F]">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-white">Trade History & Journal</h3>
          <span className="text-xs text-neutral-400 flex-shrink-0">Total: {trades.length}</span>
        </div>

        {trades.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#1F1F1F] hover:bg-transparent">
                    <TableHead
                      className="cursor-pointer text-neutral-400 hover:text-white transition-colors text-xs"
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center gap-1">
                        Entry Date <SortIndicator field="date" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer text-neutral-400 hover:text-white transition-colors text-xs"
                      onClick={() => handleSort('symbol')}
                    >
                      <div className="flex items-center gap-1">
                        Symbol <SortIndicator field="symbol" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer text-neutral-400 hover:text-white transition-colors text-xs"
                      onClick={() => handleSort('type')}
                    >
                      <div className="flex items-center gap-1">
                        Type <SortIndicator field="type" />
                      </div>
                    </TableHead>
                    <TableHead className="text-neutral-400 text-xs">Entry / Exit</TableHead>
                    <TableHead
                      className="cursor-pointer text-neutral-400 hover:text-white transition-colors text-right text-xs"
                      onClick={() => handleSort('pnl')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        PnL <SortIndicator field="pnl" />
                      </div>
                    </TableHead>
                    <TableHead className="text-neutral-400 text-xs">Tags</TableHead>
                    <TableHead className="text-neutral-400 text-xs">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTrades.map((trade) => (
                    <TableRow
                      key={trade.id}
                      className="border-[#1F1F1F] hover:bg-neutral-900/50 transition-colors text-xs"
                    >
                      <TableCell className="text-xs text-neutral-300">
                        {new Date(trade.entryTime).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-white">{trade.symbol}</TableCell>
                      <TableCell>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded inline-block ${trade.type === 'long'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}
                        >
                          {trade.type.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-neutral-300">
                        <div className="text-neutral-400">{trade.entryPrice.toFixed(2)}</div>
                        <div className="text-neutral-500 text-xs">{trade.exitPrice?.toFixed(2)}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div
                          className={`text-xs font-semibold ${(trade.pnl || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
                            }`}
                        >
                          ${trade.pnl?.toFixed(2)}
                        </div>
                        <div className="text-xs text-neutral-500">{trade.pnlPercent?.toFixed(2)}%</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                          {trade.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700"
                            >
                              {tag}
                            </span>
                          ))}
                          {(!trade.tags || trade.tags.length === 0) && (
                            <span className="text-xs text-neutral-600 italic">No tags</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {editingId === trade.id ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="flex-1 bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                              placeholder="Add note..."
                              autoFocus
                            />
                            <Button
                              onClick={() => handleSaveNote(trade.id)}
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-7 px-2"
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <div
                            className="text-neutral-400 text-xs cursor-pointer hover:text-neutral-300 transition-colors truncate max-w-[200px]"
                            onClick={() => handleEditNote(trade)}
                            title={trade.notes || 'Click to add note'}
                          >
                            {trade.notes ? (
                              <span className="text-neutral-300">{trade.notes}</span>
                            ) : (
                              <span className="text-neutral-600 hover:text-emerald-400 transition-colors">+ Add note</span>
                            )}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-[#1F1F1F]">
                <span className="text-xs text-neutral-500">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                    className="h-8 border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-800"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                    className="h-8 border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-800"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="h-40 flex items-center justify-center text-neutral-500">No trades found</div>
        )}
      </div>
    </Card>
  );
}
