
import React from 'react';
 // Assuming Result type is exported from App.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area"; // For long lists
export interface Result {
    id: string;
    promoName: string;
    rounds: number;
    rankedList: string[];
    winners: string[];
    timestamp: string;
  }
interface ResultsSummaryPageProps {
  result: Result;
  onProceed: () => void;
  onClear: () => void; // Renamed from onBackToSetup for clarity based on button text
}

const ResultsSummaryPage: React.FC<ResultsSummaryPageProps> = ({ result, onProceed, onClear }) => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8 flex justify-center items-center">
      <Card className="w-full max-w-2xl shadow-xl bg-white dark:bg-gray-800">
        <CardHeader className="text-center border-b border-gray-200 dark:border-gray-700 pb-4">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200">Promotion Results</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">Summary for: {result.promoName || 'Untitled Promo'}</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="text-sm">
            <p><span className="font-semibold">Completed:</span> {new Date(result.timestamp).toLocaleString()}</p>
            <p><span className="font-semibold">Rounds of Shuffling:</span> {result.rounds}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-lg text-gray-700 dark:text-gray-300">Final Ranked List (Winner at Top):</h3>
            <ScrollArea className="h-60 w-full rounded-md border border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-900/50">
              <ol className="list-decimal list-inside space-y-1 text-gray-800 dark:text-gray-200">
                {result.rankedList.map((entry, index) => (
                  <li key={index} className={`${index === 0 ? 'font-bold text-green-600 dark:text-green-400' : ''}`}>
                    {entry}
                    {index === 0 && <span className="ml-2 text-xs font-normal text-green-600 dark:text-green-400">(Winner!)</span>}
                  </li>
                ))}
              </ol>
            </ScrollArea>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-4 p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
          <Button
            variant="outline"
            onClick={onClear} // This button now navigates back to setup
            className="border-red-500 text-red-500 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20 font-bold py-2 px-4 rounded"
          >
            Clear & New Promo
          </Button>
          <Button
            onClick={onProceed} // This button navigates to history
            className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Proceed to History
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResultsSummaryPage;

