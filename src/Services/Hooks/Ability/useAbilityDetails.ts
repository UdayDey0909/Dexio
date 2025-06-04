import { useState, useEffect, useCallback, useMemo } from "react";
import { abilityService } from "../../API";
import type {
   UseAbilityDetailsState,
   UseAbilityDetailsReturn,
} from "./Shared/Types";
import { handleError, updateAbilityDetailsState } from "./Shared/Types";

/**
 * Custom hook for fetching detailed Pokemon ability information
 * Includes additional processed data like pokemonWithAbility, effectEntries, etc.
 *
 * @param abilityName - The name of the ability to fetch details for
 * @returns {UseAbilityDetailsReturn} Object containing detailed ability data, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * const { data: abilityDetails, loading, error, refetch } = useAbilityDetails("overgrow");
 *
 * if (abilityDetails) {
 *   console.log(abilityDetails.pokemonWithAbility); // Pokemon that have this ability
 *   console.log(abilityDetails.effectEntries); // Effect descriptions
 * }
 * ```
 */
export const useAbilityDetails = (
   abilityName?: string
): UseAbilityDetailsReturn => {
   const [state, setState] = useState<UseAbilityDetailsState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized ability name to prevent unnecessary re-renders
   const normalizedAbilityName = useMemo(() => {
      return abilityName?.toLowerCase().trim() || null;
   }, [abilityName]);

   /**
    * Fetches detailed ability data from the API
    * @param name - The ability name to fetch details for
    */
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
   }, []); // No dependencies as abilityService is stable

   /**
    * Refetches the current ability details
    */
   const refetch = useCallback(() => {
      if (normalizedAbilityName) {
         fetchAbilityDetails(normalizedAbilityName);
      }
   }, [normalizedAbilityName, fetchAbilityDetails]);

   useEffect(() => {
      if (normalizedAbilityName) {
         fetchAbilityDetails(normalizedAbilityName);
      }
   }, [normalizedAbilityName, fetchAbilityDetails]);

   // Memoize the return object to prevent unnecessary re-renders of consuming components
   return useMemo(
      () => ({
         ...state,
         refetch,
      }),
      [state, refetch]
   );
};
