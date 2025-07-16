import { useRef, useCallback } from "react";

/**
 * useDebouncedCallback
 * Returns a debounced version of a callback that only executes after the specified delay.
 * Useful for infinite scroll, search, etc.
 */
export function useDebouncedCallback<T extends (...args: any[]) => void>(
   callback: T,
   delay: number
): T {
   const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

   const debouncedCallback = useCallback(
      (...args: any[]) => {
         if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
         }
         timeoutRef.current = setTimeout(() => {
            callback(...args);
         }, delay);
      },
      [callback, delay]
   );

   // @ts-ignore
   return debouncedCallback;
}
