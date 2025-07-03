import { useState, useEffect, useCallback, useMemo } from "react";
import { typeService } from "../../API";
import {
   UseTypeDetailsState,
   UseTypeDetailsReturn,
   handleError,
   updateTypeDetailsState,
   useMemoizedIdentifier,
   transformTypeToDetails,
} from "./Shared/Types";

export const useTypeDetails = (name?: string): UseTypeDetailsReturn => {
   const [state, setState] = useState<UseTypeDetailsState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized identifier (only string names for details)
   const normalizedName = useMemoizedIdentifier(name);

   // Fetch function
   const fetchTypeDetails = useCallback(async (typeName: string) => {
      updateTypeDetailsState(setState, { loading: true, error: null });

      try {
         const type = await typeService.getType(typeName);
         const typeDetails = transformTypeToDetails(type);
         updateTypeDetailsState(setState, {
            data: typeDetails,
            loading: false,
         });
      } catch (error) {
         updateTypeDetailsState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedName && typeof normalizedName === "string") {
         fetchTypeDetails(normalizedName);
      }
   }, [normalizedName, fetchTypeDetails]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedName && typeof normalizedName === "string") {
         fetchTypeDetails(normalizedName);
      }
   }, [normalizedName, fetchTypeDetails]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
