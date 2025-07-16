import { useRef, useCallback } from "react";

/**
 * useDelayedPress
 * Returns a handler that only triggers the callback if enough time has passed since the last press.
 * Useful for preventing double-tap or accidental rapid presses.
 */
export function useDelayedPress(callback: () => void, delay: number) {
   const lastPressRef = useRef(0);

   return useCallback(() => {
      const currentTime = Date.now();
      if (currentTime - lastPressRef.current > delay) {
         lastPressRef.current = currentTime;
         callback();
      }
   }, [callback, delay]);
}
