'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FiltersProps {
  symbols: string[];
  onFilterChange: (filters: FilterState) => void;
  selectedSymbol?: string;
  selectedDateRange?: string;
}

export interface FilterState {
  symbol?: string;
  dateRange?: string;
}

export function Filters({ symbols, onFilterChange, selectedSymbol, selectedDateRange }: FiltersProps) {
  const [symbol, setSymbol] = useState(selectedSymbol || 'all');
  const [dateRange, setDateRange] = useState(selectedDateRange || '7d');

  const handleApply = () => {
    onFilterChange({
      symbol: symbol === 'all' ? undefined : symbol,
      dateRange: dateRange,
    });
  };

  const handleReset = () => {
    setSymbol('all');
    setDateRange('7d');
    onFilterChange({});
  };

  return (
    <Card className="p-6 bg-neutral-900 border-neutral-800">
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-white">Filters</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Symbol Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-neutral-400">Trading Pair</label>
            <Select value={symbol} onValueChange={setSymbol}>
              <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                <SelectValue placeholder="All symbols" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700">
                <SelectItem value="all">All Symbols</SelectItem>
                {symbols.map((sym) => (
                  <SelectItem key={sym} value={sym}>
                    {sym}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-neutral-400">Time Period</label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700">
                <SelectItem value="1d">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleApply}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium h-9"
          >
            Apply Filters
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex-1 border-neutral-700 text-neutral-300 hover:bg-neutral-800 h-9"
          >
            Reset
          </Button>
        </div>
      </div>
    </Card>
  );
}
