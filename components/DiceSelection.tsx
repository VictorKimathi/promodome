
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dices } from 'lucide-react'; // Use Dices icon

interface DiceSelectionProps {
  onDiceRollComplete: (result: number) => void;
  maxDiceOptions?: number; // How many dice buttons to show (e.g., 1 to 6)
}

// Simple function to simulate rolling multiple dice
const rollDice = (numberOfDice: number): number => {
  let total = 0;
  for (let i = 0; i < numberOfDice; i++) {
    total += Math.floor(Math.random() * 6) + 1; // Random number between 1 and 6
  }
  return total;
};

const DiceSelection: React.FC<DiceSelectionProps> = ({ onDiceRollComplete, maxDiceOptions = 5 }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationResult, setAnimationResult] = useState<number | null>(null);
  const [selectedDiceCount, setSelectedDiceCount] = useState<number | null>(null);

  const handleDiceButtonClick = (numberOfDice: number) => {
    setSelectedDiceCount(numberOfDice);
    setIsAnimating(true);
    setAnimationResult(null);

    // Simulate animation duration
    setTimeout(() => {
      const result = rollDice(numberOfDice);
      setAnimationResult(result);
      setIsAnimating(false);
      onDiceRollComplete(result); // Pass the result back up
    }, 1500); // 1.5 second animation
  };

  return (
    <div className="p-4 border border-dashed border-gray-400 dark:border-gray-600 rounded-lg my-4 bg-gray-50 dark:bg-gray-700/50">
      <p className="text-center font-semibold mb-3 text-gray-700 dark:text-gray-300">Choose number of dice to roll (Quantum RNG):</p>
      <div className="flex flex-col items-start gap-3 mb-4">
        {[...Array(maxDiceOptions)].map((_, i) => {
          const diceCount = i + 1;
          return (
            <Button
              key={diceCount}
              variant="outline"
              className="dice-option-btn border-green-500 text-green-600 hover:bg-green-50 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-900/30"
              onClick={() => handleDiceButtonClick(diceCount)}
              disabled={isAnimating}
            >
              Roll {diceCount} <Dices className="ml-2 h-4 w-4" />
            </Button>
          );
        })}
      </div>

      {isAnimating && (
        <div className="text-center py-4">
          <div className="dice-animation text-4xl"> {/* Basic animation placeholder */}
            굴리는 중... 🎲
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Rolling {selectedDiceCount} dice...</p>
        </div>
      )}

      {animationResult !== null && !isAnimating && (
        <div className="text-center py-4 text-green-700 dark:text-green-300 font-bold">
          <p>Rolled a total of: <span className="text-2xl">{animationResult}</span></p>
          <p className="text-sm">(Number of Rounds set to {animationResult})</p>
        </div>
      )}
    </div>
  );
};

export default DiceSelection;

