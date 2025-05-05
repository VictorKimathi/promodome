import React from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from '@radix-ui/react-scroll-area';

export interface Result {
  id: string;
  promoName: string;
  rounds: number;
  rankedList: string[];
  winners: string[];
  timestamp: string;
}

interface PromoHistoryPageProps {
  history: Result[];
  onNavigateBack: () => void;
}

const PromoHistoryPage: React.FC<PromoHistoryPageProps> = ({ history, onNavigateBack }) => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8 flex justify-center">
      <div className="w-full max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Promotion History</h1>
          <Button onClick={onNavigateBack} variant="outline">
            &larr; Back to New Promo
          </Button>
        </div>

        {history.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-10">No past promotions found.</p>
        ) : (
          <ScrollArea className="max-h-[70vh] overflow-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
              <thead className="bg-gray-200 dark:bg-gray-800 text-xs uppercase font-medium text-gray-700 dark:text-gray-300">
                <tr>
                  <th className="px-4 py-3">Promo Name</th>
                  <th className="px-4 py-3">Completed On</th>
                  <th className="px-4 py-3">Rounds</th>
                  <th className="px-4 py-3">Top Winner</th>
                  <th className="px-4 py-3">More Winners</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold">{item.promoName || 'Untitled Promo'}</td>
                    <td className="px-4 py-3">{new Date(item.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-3">{item.rounds}</td>
                    <td className="px-4 py-3">{item.winners[0] || 'N/A'}</td>
                    <td className="px-4 py-3">
                      {item.winners.length > 1 ? `+${item.winners.length - 1} more` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default PromoHistoryPage;
