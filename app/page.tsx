"use client";
import React, { useState, useEffect, useCallback } from 'react';
import PromoSetupPage from './pages/PromoSetupPage';
import ResultsSummaryPage from './pages/ResultsSummaryPage';
import PromoHistoryPage from './pages/PromoHistoryPage';
import './App.css'; // Global styles

// Define the structure for a promotion result
export interface Result {
  id: string;
  promoName: string;
  rounds: number;
  rankedList: string[];
  winners: string[];
  timestamp: string;
}

// Custom hook for managing state with localStorage
function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Get from local storage then
  // parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading localStorage key \""+key+"\":", error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue: React.Dispatch<React.SetStateAction<T>> = useCallback((value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
       console.error("Error setting localStorage key \""+key+"\":", error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}


function App() {
  const [currentView, setCurrentView] = useState<'setup' | 'results' | 'history'>('setup');
  const [promoHistory, setPromoHistory] = useLocalStorage<Result[]>('promoHistoryData', []);
  const [currentPromoResult, setCurrentPromoResult] = useState<Result | null>(null);

  const handlePromoComplete = (result: Result) => {
    // Add to history (most recent first)
    setPromoHistory(prevHistory => [result, ...prevHistory]);
    setCurrentPromoResult(result);
    setCurrentView('results');
  };

  const navigateToSetup = () => {
    setCurrentPromoResult(null); // Clear current result when going back to setup
    setCurrentView('setup');
  };

  const navigateToHistory = () => {
    setCurrentPromoResult(null); // Clear current result when going to history
    setCurrentView('history');
  };

  // Function to clear a specific history item (optional, can be added later)
  const clearHistoryItem = (id: string) => {
      setPromoHistory(prevHistory => prevHistory.filter(item => item.id !== id));
  };

  // Function to clear all history (optional)
  const clearAllHistory = () => {
      setPromoHistory([]);
  };

  return (
    <div className="app-container">
      {currentView === 'setup' && (
        <PromoSetupPage onPromoComplete={handlePromoComplete} />
      )}
      {currentView === 'results' && currentPromoResult && (
        <ResultsSummaryPage
          result={currentPromoResult}
          onProceed={navigateToHistory}
          onClear={navigateToSetup} // Changed 'Clear' to navigate back to setup
        />
      )}
      {currentView === 'history' && (
        <PromoHistoryPage
          history={promoHistory}
          onNavigateBack={navigateToSetup}
          // Pass clear functions if needed later
          // onClearItem={clearHistoryItem}
          // onClearAll={clearAllHistory}
        />
      )}
    </div>
  );
}

export default App;

