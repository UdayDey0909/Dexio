/**
 * Represents a structured API error object
 */
export interface APIError {
   code: string;
   message: string;
   details?: string;
   retryable: boolean;
}

/**
 * Filter options for querying Pokémon lists
 */
export interface PokemonFilters {
   type?: string;
   generation?: number;
   limit?: number;
   offset?: number;
}

/**
 * Search options for querying Pokémon search endpoints
 */
export interface SearchOptions {
   query: string;
   limit?: number;
}

/**
 * User preferences interface stored in AsyncStorage.
 */
export interface UserPreferences {
   theme?: "light" | "dark" | "auto";
   language?: string;
}
