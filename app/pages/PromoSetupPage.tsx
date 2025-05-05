"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Crown, Dices } from 'lucide-react';
import DiceSelection from '../../components/DiceSelection'; // Import the dice component
// import { Result } from '../App'; // Import Result type
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
export interface Result {
    id: string;
    promoName: string;
    rounds: number;
    rankedList: string[];
    winners: string[];
    timestamp: string;
  }
// Helper function to format date/time (can be moved to utils)
const formatDateTime = (date: Date): string => {
  return date.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  });
};

interface PromoSetupPageProps {
  onPromoComplete: (result: Result) => void;
}

const PromoSetupPage: React.FC<PromoSetupPageProps> = ({ onPromoComplete }) => {
  

  const [promoTitle, setPromoTitle] = useState('');
  const [entriesInput, setEntriesInput] = useState('');
  const [numberOfRoundsInput, setNumberOfRoundsInput] = useState(''); // Input field value
  const [finalNumberOfRounds, setFinalNumberOfRounds] = useState<number | null>(null); // Confirmed rounds
  const [numberOfWinners, setNumberOfWinners] = useState(1);
  const [winners, setWinners] = useState<string[]>([]); // Keep this? Maybe not needed here
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false); // Renamed from isRolling
  const [currentTime, setCurrentTime] = useState(new Date());
  const [roundsMode, setRoundsMode] = useState<'manual' | 'dice_prompt' | 'dice_rolled'>('manual');

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer); // Cleanup interval on component unmount
  }, []);

  // Update final rounds when manual input changes and is valid
  useEffect(() => {
    if (roundsMode === 'manual') {
        const rounds = parseInt(numberOfRoundsInput);
        if (!isNaN(rounds) && rounds > 0) {
            setFinalNumberOfRounds(rounds);
            setError(''); // Clear potential previous error
        } else if (numberOfRoundsInput.trim() === '') {
            setFinalNumberOfRounds(null); // Clear if input is empty
            setError('');
        } else {
            setFinalNumberOfRounds(null); // Invalid input
            // Optionally set error here, or wait for Start Promo click
        }
    }
  }, [numberOfRoundsInput, roundsMode]);

  const handleEntriesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newEntries = event.target.value;
    setEntriesInput(newEntries);
    const lines = newEntries.split('\n').filter(line => line.trim() !== '');
    if (lines.length > 20000) {
      setError('Maximum 20,000 entries allowed.');
    } else {
      setError('');
    }
  };

  const handleStartPromo = () => {
    setError('');
    const participants = entriesInput.split('\n').map(line => line.trim()).filter(line => line !== '');

    if (participants.length === 0) {
      setError('Please add at least one entry.');
      return;
    }

    if (finalNumberOfRounds === null || finalNumberOfRounds <= 0) {
        setError('Please set a valid number of rounds (greater than 0) either manually or using the dice.');
        return;
    }

    if (numberOfWinners <= 0) {
      setError('Number of winners must be greater than 0.');
      return;
    }

    if (numberOfWinners > participants.length) {
      setError('Number of winners cannot exceed the number of entries.');
      return;
    }

    setIsProcessing(true);

    // Simulate processing delay
    setTimeout(() => {
      let array = [...participants];

      // Perform shuffle multiple times based on rounds
      for (let round = 0; round < finalNumberOfRounds; round++) {
          // Fisher-Yates (Knuth) Shuffle
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
      }

      const selectedWinners = array.slice(0, numberOfWinners);

      // Create result object
      const result: Result = {
          id: uuidv4(), // Generate unique ID
          promoName: promoTitle || 'Untitled Promo',
          rounds: finalNumberOfRounds,
          rankedList: array, // The final shuffled list
          winners: selectedWinners,
          timestamp: new Date().toISOString(),
      };

      setIsProcessing(false);
      onPromoComplete(result); // Pass result up to App.tsx

    }, 1500); // Simulate a 1.5 second processing time
  };

  const handleCancel = () => {
    setPromoTitle('');
    setEntriesInput('');
    setNumberOfRoundsInput('');
    setFinalNumberOfRounds(null);
    setNumberOfWinners(1);
    setWinners([]); // Clear winners if kept
    setError('');
    setIsProcessing(false);
    setRoundsMode('manual'); // Reset rounds mode
  }

  const handleDiceRollComplete = (result: number) => {
      setFinalNumberOfRounds(result);
      setNumberOfRoundsInput(result.toString()); // Update input field as well
      setRoundsMode('dice_rolled');
      setError(''); // Clear error on successful roll
  };

  const participants = entriesInput.split('\n').map(line => line.trim()).filter(line => line !== '');
  const entryCount = participants.length;
  const isStartDisabled = isProcessing || entryCount === 0 || finalNumberOfRounds === null || finalNumberOfRounds <= 0 || !!error || numberOfWinners > entryCount;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8 flex flex-col items-center">
        {/* Header Text - Placed outside the card */}
        <div className="w-full max-w-3xl flex justify-end mb-2">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Quantum RNG</span>
        </div>

        <Card className="w-full max-w-3xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          {/* Custom Header */}
          <CardHeader className="text-center p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="promo-title-main text-5xl font-bold tracking-wider mb-1">PROMO</h1>
            <h2 className="promo-title-dome text-4xl font-bold tracking-[0.3em]">DOME</h2>
          </CardHeader>

          <CardContent className="p-6 space-y-5">
            {/* Promo Title */}
            <div className="flex items-center space-x-3">
              <Label htmlFor="promo-title" className="w-28 text-right font-semibold text-gray-700 dark:text-gray-300 flex-shrink-0">Promo Title</Label>
              <Input
                id="promo-title"
                placeholder="(Title/name of your promotion)"
                value={promoTitle}
                onChange={(e) => setPromoTitle(e.target.value)}
                className="flex-grow dark:bg-gray-700 dark:text-white dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            {/* Roll Dice / Rounds */}
            <div className="flex items-center space-x-3">
               <div className="w-28 flex-shrink-0"></div> {/* Spacer */}
               <Button
                 variant="outline"
                 className={`roll-dice-btn text-white font-semibold px-4 py-2 rounded ${roundsMode !== 'manual' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'}`}
                 onClick={() => setRoundsMode(roundsMode === 'manual' ? 'dice_prompt' : 'manual')}
                 disabled={isProcessing}
                >
                 {roundsMode === 'manual' ? 'Roll Dice' : 'Enter Manually'}
                 {roundsMode !== 'manual' && <Dices className="ml-2 h-4 w-4" />}
               </Button>
               <Input
                 id="num-rounds"
                 placeholder="(# of Rounds)"
                 value={numberOfRoundsInput}
                 onChange={(e) => setNumberOfRoundsInput(e.target.value)}
                 className="w-28 dark:bg-gray-700 dark:text-white dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500"
                 disabled={roundsMode !== 'manual' || isProcessing}
               />
               <Tooltip>
                 <TooltipTrigger asChild>
                   <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                     <Info className="h-5 w-5" />
                   </Button>
                 </TooltipTrigger>
                 <TooltipContent className="max-w-xs bg-black text-white p-2 rounded shadow-lg text-sm">
                   <p>Click "Roll Dice" for Quantum RNG mode, or enter rounds manually. This determines how many times the list is shuffled.</p>
                 </TooltipContent>
               </Tooltip>
            </div>

            {/* {roundsMode === 'dice_prompt' && (
                <div className="pl-32">
                    <DiceSelection onDiceRollComplete={handleDiceRollComplete} />
                </div>
            )} */}
            {roundsMode === 'dice_rolled' && finalNumberOfRounds !== null && (
                 <div className="pl-32 text-center py-2 text-green-700 dark:text-green-300 font-bold">
                    <p>Rounds set to: <span className="text-xl">{finalNumberOfRounds}</span> (via dice roll)</p>
                 </div>
            )}

            {/* List of Entries */}
            <div className="flex space-x-3">
              <Label htmlFor="entries" className="w-28 text-right font-semibold text-gray-700 dark:text-gray-300 flex-shrink-0 pt-2">List of Entries</Label>
              <div className="flex-grow space-y-1">
                <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">(add one entry per line up to 20,000 entries)</span>
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 h-6 w-6">
                            <Info className="h-4 w-4" />
                        </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs bg-black text-white p-2 rounded shadow-lg text-sm">
                        <p>You can add up to 20,000 lines to be randomized. Use names, emails, etc. Ensure 1 entry per line.</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
                <div className="flex flex-row gap-6 items-start">
  {/* Left: Textarea */}
  <div className="flex-1">
    <Label htmlFor="entries">Entries (one per line)</Label>
    <Textarea
      id="entries"
      className="mt-1"
      placeholder="Enter entries here..."
      rows={10}
      value={entriesInput}
      onChange={handleEntriesChange}
    />
  </div>

  <div className="w-72"> 
    <DiceSelection
      onDiceRollComplete={(result) => {
        setRoundsMode('dice_rolled');
        setFinalNumberOfRounds(result);
      }}
      maxDiceOptions={5}
    />
  </div>
</div>


{/* <Card className="w-full">
  <CardContent>
    <Label>Entries</Label>
    <div className="relative">
    <Textarea
      id="entries"
      className="mt-1"
      placeholder="Enter entries here..."
      rows={10}
      value={entriesInput}
      onChange={handleEntriesChange}
    />
     
    </div>
  </CardContent>
</Card> */}


                <p className="text-sm font-medium text-gray-600 dark:text-gray-400"># of Entries - {entryCount}</p>
              </div>
            </div>

            {/* Number of Winners */}
            {/* <div className="flex items-center space-x-3">
                <Label htmlFor="num-winners" className="w-28 text-right font-semibold text-gray-700 dark:text-gray-300 flex-shrink-0">Number of Winners</Label>
                <Input
                    id="num-winners"
                    type="number"
                    min="1"
                    max={entryCount > 0 ? entryCount : 1}
                    value={numberOfWinners}
                    onChange={(e) => setNumberOfWinners(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-24 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    disabled={isProcessing}
                />
            </div> */}

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Timestamp */}
            <div className="text-right text-xs text-gray-500 dark:text-gray-400 pt-2">
                {formatDateTime(currentTime)}
            </div>

          </CardContent>

          {/* Footer Buttons */}
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
             <Button
               onClick={handleStartPromo}
               disabled={isStartDisabled}
               className="start-promo-btn w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center relative"
             >
                <Crown className="crown-icon left-2 top-1/2 -translate-y-1/2 absolute h-5 w-5 text-yellow-400" />
               {isProcessing ? (
                 <>
                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   Processing...
                 </>
               ) : (
                 <>
                   start promo
                 </>
               )}
               <Crown className="crown-icon right-2 top-1/2 -translate-y-1/2 absolute h-5 w-5 text-yellow-400" />
             </Button>
             <img 
               src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJgAAACUCAMAAABY3hBoAAAAYFBMVEUAAAD////x8fESEhJTU1ORkZGUlJTIyMg9PT2Li4vq6uq5ubnh4eH4+PjT09Pu7u5HR0csLCxnZ2fAwMCrq6sfHx8zMzOysrJgYGCAgIA4ODihoaFbW1sLCwsnJydxcXGKmUPCAAACo0lEQVR4nO3c23KCMBCA4QRajkFQEEU8vP9bloMV0aQTySy7ndn/qhe5+MYqIoQV8ikV7AVi9SGfLGL6M2tQWX1FqoEdsFVDx/wV1mCT7kVqBku+sEFTm2cYIZe4Jg9YdsbGzPKzX1iMTXkpvsNKbMhb4QDzCmzHW6cB9o3N0FT2MGyErlsHa7ERurZKZDtshLZQqAu2QVsg6B0rhm6C2sH13knQ+jZ6dBHoJ4ccx3Ecx3EcB9aXXUVRRPXVX8/lS/tyFVbxWhdFfO8DWZ+XtKvYPob1lTeisI4WEYVJD/ryyFKYlAFVGPBdBAeYBP0IuMCyK1EY6KVxJxjkP9MNFlKFyZoqrFod5iVj+d9wtTqsraOx4rxLc/2a3g92VdUEm3/hNIlJBnb4t4OJrelFA7sHYwkTUaZfl2LDRKVft0GHnfQvGdjdIWuY0C9M8GEb7boc6hedPSykClPadWTfY/ifyka/Duxc0Rbm69/7+Ef+VL8MbkOMHexyMLjgtgWYYE87Sva7wPBF2X0owS5MmWBlPNamG2VkQf5Ocjy1htuj5gZLwFyOMMDLF04wuLe+IwzymqcLDHSXrQMM7HTfEQb5BnOBlcD7dJbCYP+Pi2HqCO1aBMtiyGucS2H5ZoXbIh/DkqrBvsmlwnllGx9X3S9ngqFvc7Q4g2UYwxjGMIYxjGEMYxjDGMYwhjHsH8L0LugdiBYZtjDDbXPiOI7jOI7juP8TzZEqHYvoCftW0JyO07Hwf3tpCwTgwy8uhUKRnPZyVQL2qbSl9UOrwDe4LGkY80XwgDEORiM4HWocJUdmtuOj3+F7GTbkpWlcoVphx5J9+2nAI9wjAEuajcRU4M9y21bPh4jKnMgcsvPb2FWZEpjzeNINqpX5YYvL2ldPDxr+AD/WH+AZSZUAAAAAAElFTkSuQmCC"
               alt="Description"
               height = {50}
               width={50}
             />
             <Button
               variant="outline"
               onClick={handleCancel}
               disabled={isProcessing}
               className="cancel-promo-btn w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out disabled:opacity-50"
             >
               Cancel promo
             </Button>
          </CardFooter>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default PromoSetupPage;

