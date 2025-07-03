import { useState, useEffect, useCallback, useMemo } from "react";
import { typeService } from "../../API";
import {
   UseTypeEffectivenessState,
   UseTypeEffectivenessReturn,
   handleError,
   updateTypeEffectivenessState,
   useMemoizedIdentifier,
} from "./Shared/Types";

export const useTypeEffectiveness = (
   typeName?: string
): UseTypeEffectivenessReturn => {
   const [state, setState] = useState<UseTypeEffectivenessState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized identifier
   const normalizedName = useMemoizedIdentifier(typeName);

   // Fetch function
   const fetchEffectiveness = useCallback(async (name: string) => {
      updateTypeEffectivenessState(setState, { loading: true, error: null });

      try {
         const effectiveness = await typeService.getTypeEffectiveness(name);
         updateTypeEffectivenessState(setState, {
            data: effectiveness,
            loading: false,
         });
      } catch (error) {
         updateTypeEffectivenessState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedName && typeof normalizedName === "string") {
         fetchEffectiveness(normalizedName);
      }
   }, [normalizedName, fetchEffectiveness]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedName && typeof normalizedName === "string") {
         fetchEffectiveness(normalizedName);
      }
   }, [normalizedName, fetchEffectiveness]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
