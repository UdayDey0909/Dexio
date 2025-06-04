import { useState, useEffect, useCallback } from "react";
import { abilityService } from "../../API";
import type { UseAbilityListState, UseAbilityListReturn } from "./Shared/Types";
import { handleError, updateAbilityListState } from "./Shared/Types";

export const useAbilityList = (
   offset: number = 0,
   limit: number = 20
): UseAbilityListReturn => {
   const [state, setState] = useState<UseAbilityListState>({
      data: [],
      loading: false,
      error: null,
   });

   const fetchAbilityList = useCallback(async () => {
      updateAbilityListState(setState, { loading: true, error: null });

      try {
         const list = await abilityService.getAbilityList(offset, limit);
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
