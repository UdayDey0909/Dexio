// src/Services/Hooks/Utility/useUtilityHelpers.ts
import { useMemo } from "react";
import { utilityService } from "../../API";
import { UseUtilityHelpersReturn } from "./Shared/Types";

export const useUtilityHelpers = (): UseUtilityHelpersReturn => {
   return useMemo(
      () => ({
         // URL utilities
         extractIdFromUrl: (url: string) =>
            utilityService.extractIdFromUrl(url),
         extractNameFromUrl: (url: string) =>
            utilityService.extractNameFromUrl(url),
         buildUrl: (endpoint: string, identifier?: string | number) =>
            utilityService.buildUrl(endpoint, identifier),
         isValidUrl: (url: string) => utilityService.isValidUrl(url),

         // Resource info
         getResourceInfo: (url: string) => utilityService.getResourceInfo(url),
         getEndpointFromUrl: (url: string) =>
            utilityService.getEndpointFromUrl(url),

         // Pagination helpers
         getNextUrl: (response: { next: string | null }) =>
            utilityService.getNextUrl(response),
         getPreviousUrl: (response: { previous: string | null }) =>
            utilityService.getPreviousUrl(response),
         getPaginationInfo: <T>(response: any) =>
            utilityService.getPaginationInfo<T>(response),

         // Endpoint validation
         getEndpoints: () => utilityService.getEndpoints(),
         isValidEndpoint: (endpoint: string) =>
            utilityService.isValidEndpoint(endpoint),
      }),
      []
   );
};
