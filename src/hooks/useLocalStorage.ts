// Purpose: Reusable generic hook to sync state with localStorage safely.

import { useState, useEffect } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Pass initial state to useState so we don't cause hydration mismatch on first render
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Once mounted, check if there's a stored value
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let rafId: number | null = null;

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsedValue = JSON.parse(item) as T;
        // Schedule after paint to avoid synchronous setState in effect body.
        rafId = window.requestAnimationFrame(() => {
          setStoredValue(parsedValue);
        });
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [key]);

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
