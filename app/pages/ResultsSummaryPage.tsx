
import React from 'react';
// import { Result } from '../App';
// Remove CardTitle from this import
import { Card, CardContent, CardHeader, CardFooter } from "../../components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy } from 'lucide-react'; // Import the Trophy icon
import { cn } from "@/lib/utils"; // Import cn utility for class merging
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
  onProceed: () => void; // Navigate to history
  onClear: () => void;   // Navigate back to setup
}

// Local fallback implementation for CardTitle
const CardTitle = React.forwardRef<
  HTMLParagraphElement, // Use <p> or <div> as appropriate
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p // Changed from div to p for semantic correctness, assuming it's a title
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)} // Use cn for merging classes
    {...props}
  />
));
CardTitle.displayName = "CardTitle";


const ResultsSummaryPage: React.FC<ResultsSummaryPageProps> = ({ result, onProceed, onClear }) => {
  const { promoName, rounds, rankedList, winners, timestamp } = result;
  const numberOfWinners = winners.length;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8 flex flex-col items-center">
      <Card className="w-full max-w-2xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader className="text-center p-6 border-b border-gray-200 dark:border-gray-700">
          {/* Use the local CardTitle */}
          <CardTitle className="text-3xl font-bold text-gray-800 dark:text-gray-100">Promotion Results</CardTitle>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">"{promoName}"</p>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            Completed on: {new Date(timestamp).toLocaleString()} after {rounds} rounds of shuffling.
          </div>

          {/* Winner(s) Highlight */}
          <div className="text-center my-4">
            <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-200">Winner{numberOfWinners > 1 ? 's' : ''}:</h3>
            {winners.map((winner, index) => (
              <p key={index} className="text-2xl font-bold text-green-600 dark:text-green-400 flex items-center justify-center">
                <Trophy className="inline-block w-6 h-6 text-yellow-500 mr-2" />
                {winner}
              </p>
            ))}
          </div>

          {/* Full Ranked List */}
          <div>
            <h4 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">Full Ranked List:</h4>
            <ScrollArea className="h-72 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 p-3">
              <ol className="list-decimal list-inside space-y-1 text-gray-800 dark:text-gray-200">
                {rankedList.map((entry, index) => (
                  <li key={index} className={`p-1 rounded ${index < numberOfWinners ? 'font-bold bg-yellow-100 dark:bg-yellow-900/50' : ''}`}>
                    {index + 1}. {entry}
                    {index < numberOfWinners && <Trophy className="inline-block w-4 h-4 text-yellow-500 ml-2" />}
                  </li>
                ))}
              </ol>
            </ScrollArea>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
          <Button
            onClick={onClear}
            variant="outline"
            className="w-full sm:w-auto border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/50"
          >
            Run New Promo
          </Button>
          <Button
            onClick={onProceed}
            className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white"
          >
            View History
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResultsSummaryPage;

