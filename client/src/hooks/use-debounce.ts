import { useState, useEffect } from 'react';

/**
 * A hook that provides a debounced value from a rapidly changing value.
 * 
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced value that updates only after the delay has passed without new values
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear the timeout if the value changes or the component unmounts
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}