import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import './DiceSelection.css'; // We'll create this file for the 3D dice styles

interface DiceSelectionProps {
  onDiceRollComplete: (result: number) => void;
  maxDiceOptions?: number;
}

// Component to render a 3D die
const Die3D: React.FC<{ value: number | null, isRolling: boolean }> = ({ value, isRolling }) => {
  const dieRef = useRef<HTMLDivElement>(null);
  
  // Set random rotation during rolling animation
  useEffect(() => {
    if (!isRolling || !dieRef.current) return;
    
    const randomizeRotation = () => {
      if (!dieRef.current) return;
      const randomX = Math.floor(Math.random() * 360);
      const randomY = Math.floor(Math.random() * 360);
      dieRef.current.style.setProperty('--random-x', `${randomX}deg`);
      dieRef.current.style.setProperty('--random-y', `${randomY}deg`);
    };
    
    const interval = setInterval(randomizeRotation, 150);
    return () => clearInterval(interval);
  }, [isRolling]);
  
  // Set final rotation based on value when rolling stops
  useEffect(() => {
    if (isRolling || !dieRef.current || value === null) return;
    
    // Define rotations for each face value
    const faceRotations = {
      1: 'rotateX(0deg) rotateY(0deg)',      // Front face (1)
      2: 'rotateX(0deg) rotateY(-90deg)',    // Right face (2)
      3: 'rotateX(-90deg) rotateY(0deg)',    // Top face (3)
      4: 'rotateX(90deg) rotateY(0deg)',     // Bottom face (4)
      5: 'rotateX(0deg) rotateY(90deg)',     // Left face (5)
      6: 'rotateX(0deg) rotateY(180deg)',    // Back face (6)
    };
    
    dieRef.current.style.transform = faceRotations[value as keyof typeof faceRotations];
  }, [value, isRolling]);
  
  return (
    <div className="dice-container">
      <div 
        ref={dieRef}
        className={`dice-cube ${isRolling ? 'is-rolling' : ''}`}
      >
        {/* Front face - 1 */}
        <div className="dice-face front">
          <span className="dot center"></span>
        </div>
        
        {/* Back face - 6 */}
        <div className="dice-face back">
          <span className="dot top left"></span>
          <span className="dot top right"></span>
          <span className="dot middle left"></span>
          <span className="dot middle right"></span>
          <span className="dot bottom left"></span>
          <span className="dot bottom right"></span>
        </div>
        
        {/* Right face - 2 */}
        <div className="dice-face right">
          <span className="dot top right"></span>
          <span className="dot bottom left"></span>
        </div>
        
        {/* Left face - 5 */}
        <div className="dice-face left">
          <span className="dot top left"></span>
          <span className="dot top right"></span>
          <span className="dot center"></span>
          <span className="dot bottom left"></span>
          <span className="dot bottom right"></span>
        </div>
        
        {/* Top face - 3 */}
        <div className="dice-face top">
          <span className="dot top right"></span>
          <span className="dot center"></span>
          <span className="dot bottom left"></span>
        </div>
        
        {/* Bottom face - 4 */}
        <div className="dice-face bottom">
          <span className="dot top left"></span>
          <span className="dot top right"></span>
          <span className="dot bottom left"></span>
          <span className="dot bottom right"></span>
        </div>
      </div>
    </div>
  );
};

const DiceSelection: React.FC<DiceSelectionProps> = ({ onDiceRollComplete, maxDiceOptions = 5 }) => {
  const [numberOfDice, setNumberOfDice] = useState<number>(2);
  const [isRolling, setIsRolling] = useState(false);
  const [diceValues, setDiceValues] = useState<(number | null)[]>(Array(numberOfDice).fill(null));
  const [finalResult, setFinalResult] = useState<number | null>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Adjust diceValues array size when numberOfDice changes
  useEffect(() => {
    setDiceValues(Array(numberOfDice).fill(null));
    setFinalResult(null);
  }, [numberOfDice]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    };
  }, []);

  const handleRollClick = () => {
    setIsRolling(true);
    setFinalResult(null);
    const animationDuration = 1500; // 1.5 seconds

    // Set timeout to stop animation and show final result
    animationTimeoutRef.current = setTimeout(() => {
      // Generate final random values for each die
      const rolls = Array(numberOfDice).fill(0).map(() => Math.floor(Math.random() * 6) + 1);
      const total = rolls.reduce((sum, val) => sum + val, 0);
      
      setDiceValues(rolls);
      setFinalResult(total);
      setIsRolling(false);
      onDiceRollComplete(total);
    }, animationDuration);
  };

  return (
    <div className="p-4 border border-dashed border-gray-400 dark:border-gray-600 rounded-lg my-4 bg-gray-50 dark:bg-gray-700/50">
      <div className="flex items-center justify-center gap-4 mb-4">
        <Label htmlFor="dice-count-select" className="font-semibold text-gray-700 dark:text-gray-300">Dice:</Label>
        <Select
          value={numberOfDice.toString()}
          onValueChange={(value) => setNumberOfDice(parseInt(value))}
          disabled={isRolling}
        >
          <SelectTrigger id="dice-count-select" className="w-[80px] dark:bg-gray-600 dark:text-white dark:border-gray-500">
            <SelectValue placeholder="Select dice" />
          </SelectTrigger>
          <SelectContent>
            {[...Array(maxDiceOptions)].map((_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
                {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={handleRollClick}
          disabled={isRolling}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          {isRolling ? 'Rolling...' : 'Roll Dice'}
        </Button>
        {finalResult !== null && !isRolling && (
          <div className="ml-4 p-2 bg-blue-100 dark:bg-blue-900/50 border border-blue-300 dark:border-blue-700 rounded">
            <span className="font-bold text-blue-700 dark:text-blue-300">{finalResult} Rounds</span>
          </div>
        )}
      </div>

      <div className="flex justify-center items-center min-h-[120px] py-4">
        {diceValues.map((value, index) => (
          <Die3D key={index} value={value} isRolling={isRolling} />
        ))}
      </div>
    </div>
  );
};

export default DiceSelection;
