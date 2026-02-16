'use client';

import { Trade } from '@/lib/types';
import { exportTradesCSV } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ExportImportProps {
  trades: Trade[];
}

export function ExportImport({ trades }: ExportImportProps) {
  const handleExportCSV = () => {
    const csv = exportTradesCSV(trades);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `deriverse-trades-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const json = JSON.stringify(trades, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `deriverse-trades-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="p-6 bg-neutral-900 border-neutral-800">
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-white">Export Data</h3>
        
        <p className="text-xs text-neutral-400">
          Download your trade history for external analysis or record-keeping.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            onClick={handleExportCSV}
            disabled={trades.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium h-10"
          >
            Export as CSV
          </Button>
          <Button
            onClick={handleExportJSON}
            disabled={trades.length === 0}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium h-10"
          >
            Export as JSON
          </Button>
        </div>

        <div className="text-xs text-neutral-500 pt-2">
          {trades.length > 0 ? `${trades.length} trades ready to export` : 'No trades to export'}
        </div>
      </div>
    </Card>
  );
}
