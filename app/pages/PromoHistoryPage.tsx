import React from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Result {
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
          <ScrollArea className="h-[calc(100vh-150px)] pr-2">
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 dark:border-gray-700 text-sm">
                <thead className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                  <tr>
                    <th className="p-3 text-left">Promo Name</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Rounds</th>
                    <th className="p-3 text-left">Winner(s)</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                  {history.map((item) => (
                    <tr key={item.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                      <td className="p-3">{item.promoName || 'Untitled Promo'}</td>
                      <td className="p-3">{new Date(item.timestamp).toLocaleString()}</td>
                      <td className="p-3">{item.rounds}</td>
                      <td className="p-3">
                        {item.winners.length > 0 ? item.winners[0] : 'N/A'}
                        {item.winners.length > 1 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                            (+{item.winners.length - 1} more)
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default PromoHistoryPage;
