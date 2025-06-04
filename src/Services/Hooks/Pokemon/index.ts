// Export all Pokemon hooks
export { usePokemon } from "./usePokemon";
export { usePokemonDetails } from "./usePokemonDetails";
export { usePokemonList } from "./usePokemonList";
export { usePokemonSpecies } from "./usePokemonSpecies";
export { usePokemonStats } from "./usePokemonStats";
export { usePokemonSearch } from "./usePokemonSearch";
export { useRandomPokemon } from "./useRandomPokemon";

// Export all types
export type {
   // Return types
   UsePokemonReturn,
   UsePokemonDetailsReturn,
   UsePokemonListReturn,
   UsePokemonSpeciesReturn,
   UsePokemonStatsReturn,
   UsePokemonSearchReturn,
   UseRandomPokemonReturn,

   // Data types
   PokemonDetails,
   PokemonSearchResult,
   PokemonStatsData,

   // State types (for advanced use cases)
   UsePokemonState,
   UsePokemonDetailsState,
   UsePokemonListState,
   UsePokemonSpeciesState,
   UsePokemonStatsState,
   UsePokemonSearchState,

   // Base types
   BaseHookState,
} from "./Shared/Types";
