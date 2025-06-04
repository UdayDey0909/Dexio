import { useState, useEffect, useCallback } from "react";
import { abilityService } from "../../API";
import type { UseAbilityState, UseAbilityReturn } from "./Shared/Types";
import { handleError, updateAbilityState } from "./Shared/Types";

export const useAbility = (identifier?: string | number): UseAbilityReturn => {
   const [state, setState] = useState<UseAbilityState>({
      data: null,
      loading: false,
      error: null,
   });

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
