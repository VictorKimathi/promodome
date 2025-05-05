
import React from 'react';
// import { Result } from '../App'; // Assuming Result type is exported from App.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
interface Result {
    id: string;
    promoName: string;
    rounds: number;
    rankedList: string[];
    winners: string[];
    timestamp: string;
  }
interface HistoryItemProps {
  item: Result;
  // Add onClick handler if needed for viewing details later
}

const HistoryItem: React.FC<HistoryItemProps> = ({ item }) => {
  return (
    <Card className="mb-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">{item.promoName || 'Untitled Promo'}</CardTitle>
        <CardDescription className="text-xs text-gray-500 dark:text-gray-400">
          Completed: {new Date(item.timestamp).toLocaleString()} | Rounds: {item.rounds}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm pt-2">
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-medium">Winner:</span> {item.winners.length > 0 ? item.winners[0] : 'N/A'}
          {item.winners.length > 1 && <span className="text-xs"> (+{item.winners.length - 1} more)</span>}
        </p>
        {/* Optionally show top few entries or link to full results */}
      </CardContent>
    </Card>
  );
};

interface PromoHistoryPageProps {
  history: Result[];
  onNavigateBack: () => void;
  // onClearItem?: (id: string) => void; // Optional clear functions
  // onClearAll?: () => void;
}

const PromoHistoryPage: React.FC<PromoHistoryPageProps> = ({ history, onNavigateBack }) => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8 flex justify-center">
      <div className="w-full max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Promotion History</h1>
          <Button onClick={onNavigateBack} variant="outline">
            &larr; Back to New Promo
          </Button>
        </div>

        {history.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-10">No past promotions found.</p>
        ) : (
          <ScrollArea className="h-[calc(100vh-150px)] pr-4"> {/* Adjust height as needed */}
            {history.map((item) => (
              <HistoryItem key={item.id} item={item} />
            ))}
          </ScrollArea>
        )}

        {/* Optional: Add Clear All button here if needed */}
        {/* {history.length > 0 && onClearAll && (
          <div className="mt-6 text-center">
            <Button variant="destructive" onClick={onClearAll}>Clear All History</Button>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default PromoHistoryPage;

