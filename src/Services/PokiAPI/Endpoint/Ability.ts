import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { httpClient, cacheKeys, CACHE_CONFIG } from "../Client";
import { Ability } from "../Model";
import { APIError } from "../Client/Types";
import {
   NamedAPIResource,
   APIListResponse,
   QueryHookOptions,
   validateId,
   transformListResponse,
} from "./Types/Types";

/**
 * Type alias for ability list response
 */
export type AbilityListResponse = APIListResponse<NamedAPIResource>;

/**
 * Ability endpoints for fetching ability data from PokeAPI
 */
export class AbilityEndpoints {
   /**
    * Fetch a single ability by ID or name
    * @param id - Ability ID (number) or name (string)
    * @returns Promise<Ability>
    * @throws APIError if id is invalid or request fails
    */
   static async getAbility(id: number | string): Promise<Ability> {
      // Use shared validation utility
      validateId(id, "Ability");

      try {
         // Use pokenode-ts client for type-safe API calls
         const ability = await httpClient.client.getAbilityByName(String(id));
         return ability as Ability;
      } catch (error: any) {
         // Convert to our standard APIError format
         throw {
            code: error.response?.status?.toString() || "FETCH_ERROR",
            message: `Failed to fetch ability: ${error.message}`,
            details: error.response?.data?.message,
            retryable: error.response?.status >= 500 || !error.response,
         } as APIError;
      }
   }

   /**
    * Fetch list of all abilities with pagination
    * @param limit - Number of abilities to fetch (default: 20)
    * @param offset - Offset for pagination (default: 0)
    * @returns Promise<AbilityListResponse> with abilities list and metadata
    */
   static async getAbilitiesList(
      limit: number = 20,
      offset: number = 0
   ): Promise<AbilityListResponse> {
      try {
         const response = await httpClient.axios.get("/ability", {
            params: { limit, offset },
         });

         // Use shared response transformer
         return transformListResponse(response.data);
      } catch (error: any) {
         throw {
            code: error.response?.status?.toString() || "FETCH_ERROR",
            message: `Failed to fetch abilities list: ${error.message}`,
            details: error.response?.data?.message,
            retryable: error.response?.status >= 500 || !error.response,
         } as APIError;
      }
   }
}

/**
 * React Query hook for fetching a single ability
 * @param id - Ability ID or name
 * @param options - Additional query options
 */
export const useAbility = (
   id: number | string,
   options?: QueryHookOptions
): UseQueryResult<Ability, APIError> => {
   // Destructure options for cleaner usage
   const {
      enabled = id !== null && id !== undefined && id !== "",
      staleTime = CACHE_CONFIG.STALE_TIME.LONG,
   } = options || {};

   return useQuery({
      queryKey: cacheKeys.abilities.detail(id),
      queryFn: () => AbilityEndpoints.getAbility(id),
      enabled,
      staleTime,
   });
};

/**
 * React Query hook for fetching abilities list
 * @param limit - Number of abilities to fetch
 * @param offset - Offset for pagination
 * @param options - Additional query options
 */
export const useAbilitiesList = (
   limit: number = 20,
   offset: number = 0,
   options?: QueryHookOptions
): UseQueryResult<AbilityListResponse, APIError> => {
   // Destructure options for cleaner usage
   const { enabled = true, staleTime = CACHE_CONFIG.STALE_TIME.MEDIUM } =
      options || {};

   return useQuery({
      queryKey: [...cacheKeys.abilities.list(), { limit, offset }],
      queryFn: () => AbilityEndpoints.getAbilitiesList(limit, offset),
      enabled,
      staleTime,
   });
};
