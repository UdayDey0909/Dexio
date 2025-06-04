import { useState, useEffect, useCallback, useMemo } from "react";
import { abilityService } from "../../API";
import { handleError, updateAbilityState } from "./Shared/Types";
import type { UseAbilityState, UseAbilityReturn } from "./Shared/Types";

/**
 * Custom hook for fetching a single Pokemon ability
 *
 * @param identifier - The ability name (string) or ID (number) to fetch
 * @returns {UseAbilityReturn} Object containing ability data, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * const { data: ability, loading, error, refetch } = useAbility("overgrow");
 * const { data: ability2, loading, error, refetch } = useAbility(65);
 * ```
 */
export const useAbility = (identifier?: string | number): UseAbilityReturn => {
   const [state, setState] = useState<UseAbilityState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize the normalized identifier to prevent unnecessary re-renders
   const normalizedIdentifier = useMemo(() => {
      if (!identifier) return null;
      return typeof identifier === "string"
         ? identifier.toLowerCase().trim()
         : identifier;
   }, [identifier]);

   /**
    * Fetches ability data from the API
    * @param id - The ability identifier (name or ID)
    */
   const fetchAbility = useCallback(async (id: string | number) => {
      updateAbilityState(setState, { loading: true, error: null });

      try {
         const ability = await abilityService.getAbility(id);
         updateAbilityState(setState, { data: ability, loading: false });
      } catch (error) {
         updateAbilityState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []); // No dependencies as abilityService is stable

   /**
    * Refetches the current ability data
    */
   const refetch = useCallback(() => {
      if (normalizedIdentifier) {
         fetchAbility(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchAbility]);

   useEffect(() => {
      if (normalizedIdentifier) {
         fetchAbility(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchAbility]);

   // Memoize the return object to prevent unnecessary re-renders of consuming components
   return useMemo(
      () => ({
         ...state,
         refetch,
      }),
      [state, refetch]
   );
};
