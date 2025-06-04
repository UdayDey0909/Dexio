import { useState, useEffect, useCallback, useMemo } from "react";
import { abilityService } from "../../../API";
import type {
   UseAbilityState,
   UseAbilityReturn,
   UseAbilityDetailsReturn,
   UseAbilityDetailsState,
   UseAbilityListReturn,
   UseAbilityListState,
} from "./Types";
import {
   handleError,
   updateAbilityState,
   updateAbilityDetailsState,
   updateAbilityListState,
} from "./Types";

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

   // Memoize the fetch function to prevent recreation on every render
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

   // Memoize refetch function
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

// Enhanced useAbilityDetails with memoization
export const useAbilityDetails = (
   abilityName?: string
): UseAbilityDetailsReturn => {
   const [state, setState] = useState<UseAbilityDetailsState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized ability name
   const normalizedAbilityName = useMemo(() => {
      return abilityName?.toLowerCase().trim() || null;
   }, [abilityName]);

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
      if (normalizedAbilityName) {
         fetchAbilityDetails(normalizedAbilityName);
      }
   }, [normalizedAbilityName, fetchAbilityDetails]);

   useEffect(() => {
      if (normalizedAbilityName) {
         fetchAbilityDetails(normalizedAbilityName);
      }
   }, [normalizedAbilityName, fetchAbilityDetails]);

   return useMemo(
      () => ({
         ...state,
         refetch,
      }),
      [state, refetch]
   );
};

// Enhanced useAbilityList with memoization for pagination
export const useAbilityList = (
   offset: number = 0,
   limit: number = 20
): UseAbilityListReturn => {
   const [state, setState] = useState<UseAbilityListState>({
      data: [],
      loading: false,
      error: null,
   });

   // Memoize pagination params to prevent unnecessary API calls
   const paginationParams = useMemo(
      () => ({
         offset: Math.max(0, offset),
         limit: Math.min(Math.max(1, limit), 1000), // Reasonable limits
      }),
      [offset, limit]
   );

   const fetchAbilityList = useCallback(async () => {
      updateAbilityListState(setState, { loading: true, error: null });

      try {
         const list = await abilityService.getAbilityList(
            paginationParams.offset,
            paginationParams.limit
         );
         updateAbilityListState(setState, {
            data: list.results || [],
            loading: false,
         });
      } catch (error) {
         updateAbilityListState(setState, {
            data: [],
            loading: false,
            error: handleError(error),
         });
      }
   }, [paginationParams.offset, paginationParams.limit]);

   const refetch = useCallback(() => {
      fetchAbilityList();
   }, [fetchAbilityList]);

   useEffect(() => {
      fetchAbilityList();
   }, [fetchAbilityList]);

   return useMemo(
      () => ({
         ...state,
         refetch,
      }),
      [state, refetch]
   );
};
