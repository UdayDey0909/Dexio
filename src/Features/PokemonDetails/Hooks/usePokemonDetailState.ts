import { useState, useCallback } from "react";

export const usePokemonDetailState = () => {
   const [useMetric, setUseMetric] = useState(true);

   const toggleMetric = useCallback(() => {
      setUseMetric((prev) => !prev);
   }, []);

   return {
      useMetric,
      setUseMetric,
      toggleMetric,
   };
};
