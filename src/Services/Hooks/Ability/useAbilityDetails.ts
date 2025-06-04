import { useState, useEffect, useCallback } from "react";
import { abilityService } from "../../API";
import type {
   UseAbilityDetailsState,
   UseAbilityDetailsReturn,
} from "./Shared/Types";
import { handleError, updateAbilityDetailsState } from "./Shared/Types";

export const useAbilityDetails = (
   abilityName?: string
): UseAbilityDetailsReturn => {
   const [state, setState] = useState<UseAbilityDetailsState>({
      data: null,
      loading: false,
      error: null,
   });

   const fetchAbilityDetails = useCallback(async (name: string) => {
      updateAbilityDetailsState(setState, { loading: true, error: null });

      try {
         const details = await abilityService.getAbilityDetails(name);
         updateAbilityDetailsState(setState, { data: details, loading: false });
      } catch (error) {
         updateAbilityDetailsState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   const refetch = useCallback(() => {
      if (abilityName) {
         fetchAbilityDetails(abilityName);
      }
   }, [abilityName, fetchAbilityDetails]);

   useEffect(() => {
      if (abilityName) {
         fetchAbilityDetails(abilityName);
      }
   }, [abilityName, fetchAbilityDetails]);

   return {
      ...state,
      refetch,
   };
};
