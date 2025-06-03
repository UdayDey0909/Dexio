import { useState, useEffect, useCallback } from "react";
import { AbilityService } from "../../API/Ability";
import type { Ability } from "pokenode-ts";

interface UseAbilityState {
   data: Ability | null;
   loading: boolean;
   error: string | null;
}

interface UseAbilityDetailsState {
   data: {
      id: number;
      name: string;
      is_main_series: boolean;
      generation: any;
      names: any[];
      effect_entries: any[];
      flavor_text_entries: any[];
      pokemon: any[];
      pokemonWithAbility: any[];
      effectEntries: any[];
      flavorTextEntries: any[];
   } | null;
   loading: boolean;
   error: string | null;
}

interface UseAbilityListState {
   data: any[];
   loading: boolean;
   error: string | null;
}

// Single ability hook
export const useAbility = (identifier?: string | number) => {
   const [state, setState] = useState<UseAbilityState>({
      data: null,
      loading: false,
      error: null,
   });

   const abilityService = new AbilityService();

   const fetchAbility = useCallback(async (id: string | number) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const ability = await abilityService.getAbility(id);
         setState({ data: ability, loading: false, error: null });
      } catch (error) {
         setState({
            data: null,
            loading: false,
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to fetch ability",
         });
      }
   }, []);

   const refetch = useCallback(() => {
      if (identifier) {
         fetchAbility(identifier);
      }
   }, [identifier, fetchAbility]);

   useEffect(() => {
      if (identifier) {
         fetchAbility(identifier);
      }
   }, [identifier, fetchAbility]);

   return {
      ...state,
      refetch,
   };
};

// Ability details hook (with enhanced data)
export const useAbilityDetails = (abilityName?: string) => {
   const [state, setState] = useState<UseAbilityDetailsState>({
      data: null,
      loading: false,
      error: null,
   });

   const abilityService = new AbilityService();

   const fetchAbilityDetails = useCallback(async (name: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const details = await abilityService.getAbilityDetails(name);
         setState({ data: details, loading: false, error: null });
      } catch (error) {
         setState({
            data: null,
            loading: false,
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to fetch ability details",
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

// Ability list hook with pagination
export const useAbilityList = (offset: number = 0, limit: number = 20) => {
   const [state, setState] = useState<UseAbilityListState>({
      data: [],
      loading: false,
      error: null,
   });

   const abilityService = new AbilityService();

   const fetchAbilityList = useCallback(async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const list = await abilityService.getAbilityList(offset, limit);
         setState({ data: list.results || [], loading: false, error: null });
      } catch (error) {
         setState({
            data: [],
            loading: false,
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to fetch ability list",
         });
      }
   }, [offset, limit]);

   const refetch = useCallback(() => {
      fetchAbilityList();
   }, [fetchAbilityList]);

   useEffect(() => {
      fetchAbilityList();
   }, [fetchAbilityList]);

   return {
      ...state,
      refetch,
   };
};
