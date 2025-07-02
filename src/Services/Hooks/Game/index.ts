// ===== GENERATION HOOKS =====
export { useGeneration } from "./useGeneration";
export { useGenerationDetails } from "./useGenerationDetails";
export { useGenerationList } from "./useGenerationList";

// ===== POKEDEX HOOKS =====
export { usePokedex } from "./usePokedex";
export { usePokedexDetails } from "./usePokedexDetails";
export { usePokedexList } from "./usePokedexList";
export { usePokedexEntries } from "./usePokedexEntries";

// ===== VERSION HOOKS =====
export { useVersion } from "./useVersion";
export { useVersionDetails } from "./useVersionDetails";
export { useVersionList } from "./useVersionList";

// ===== VERSION GROUP HOOKS =====
export { useVersionGroup } from "./useVersionGroup";
export { useVersionGroupDetails } from "./useVersionGroupDetails";
export { useVersionGroupList } from "./useVersionGroupList";

// ===== SPECIAL DATA HOOKS =====
export { usePokemonByGeneration } from "./usePokemonByGeneration";

// ===== TYPE EXPORTS =====
// Hook return types
export type {
   UseGenerationReturn,
   UseGenerationDetailsReturn,
   UseGenerationListReturn,
   UsePokedexReturn,
   UsePokedexDetailsReturn,
   UsePokedexListReturn,
   UsePokedexEntriesReturn,
   UseVersionReturn,
   UseVersionDetailsReturn,
   UseVersionListReturn,
   UseVersionGroupReturn,
   UseVersionGroupDetailsReturn,
   UseVersionGroupListReturn,
   UsePokemonByGenerationReturn,
} from "./Shared/Types";

// Enhanced data types
export type {
   GenerationDetails,
   PokedexDetails,
   VersionDetails,
   VersionGroupDetails,
} from "./Shared/Types";

// Hook state types (for advanced usage)
export type {
   BaseHookState,
   UseGenerationState,
   UseGenerationDetailsState,
   UseGenerationListState,
   UsePokedexState,
   UsePokedexDetailsState,
   UsePokedexListState,
   UsePokedexEntriesState,
   UseVersionState,
   UseVersionDetailsState,
   UseVersionListState,
   UseVersionGroupState,
   UseVersionGroupDetailsState,
   UseVersionGroupListState,
   UsePokemonByGenerationState,
} from "./Shared/Types";

// ===== UTILITIES =====
export {
   handleError,
   useMemoizedIdentifier,
   useMemoizedPagination,
} from "./Shared/Types";

/**
 * Re-exports for convenience
 * These allow importing everything from the game hooks module
 */
export * from "./Shared/Types";

/**
 * Hook categories for better organization
 */
export const HOOK_CATEGORIES = {
   GENERATION: ["useGeneration", "useGenerationDetails", "useGenerationList"],
   POKEDEX: [
      "usePokedex",
      "usePokedexDetails",
      "usePokedexList",
      "usePokedexEntries",
   ],
   VERSION: ["useVersion", "useVersionDetails", "useVersionList"],
   VERSION_GROUP: [
      "useVersionGroup",
      "useVersionGroupDetails",
      "useVersionGroupList",
   ],
   SPECIAL: ["usePokemonByGeneration"],
   LEGACY: ["useGame"],
} as const;

/**
 * Hook usage recommendations
 */
export const HOOK_RECOMMENDATIONS = {
   // For single entity fetching
   SINGLE_ENTITY: [
      "useGeneration",
      "usePokedex",
      "useVersion",
      "useVersionGroup",
   ],

   // For enhanced data with computed fields
   ENHANCED_DATA: [
      "useGenerationDetails",
      "usePokedexDetails",
      "useVersionDetails",
      "useVersionGroupDetails",
   ],

   // For listing/pagination
   LISTS: [
      "useGenerationList",
      "usePokedexList",
      "useVersionList",
      "useVersionGroupList",
   ],

   // For cross-entity relationships
   RELATIONSHIPS: ["usePokemonByGeneration", "usePokedexEntries"],

   // Performance optimized
   PERFORMANCE_OPTIMIZED: [
      "useGeneration",
      "usePokedex",
      "useVersion",
      "useVersionGroup",
   ],

   // Feature rich
   FEATURE_RICH: [
      "useGenerationDetails",
      "usePokedexDetails",
      "useVersionDetails",
      "useVersionGroupDetails",
   ],
} as const;
