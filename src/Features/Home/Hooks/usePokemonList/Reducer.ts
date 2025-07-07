import { PokemonListState, PokemonListAction } from "./Types";

export const pokemonListReducer = (
   state: PokemonListState,
   action: PokemonListAction
): PokemonListState => {
   switch (action.type) {
      case "FETCH_START":
         return {
            ...state,
            loading:
               !action.payload.isRefresh &&
               !action.payload.isLoadMore &&
               state.pokemonData.length === 0,
            refreshing: action.payload.isRefresh,
            loadingMore: action.payload.isLoadMore,
            error: null,
         };
      case "FETCH_SUCCESS":
         return {
            ...state,
            pokemonData: action.payload.isRefresh
               ? action.payload.data
               : [...state.pokemonData, ...action.payload.data],
            hasMore: action.payload.hasMore,
            offset: action.payload.offset,
            loading: false,
            refreshing: false,
            loadingMore: false,
            error: null,
         };
      case "FETCH_ERROR":
         return {
            ...state,
            loading: false,
            refreshing: false,
            loadingMore: false,
            error: action.payload.error,
         };
      case "RESET":
         return {
            ...state,
            pokemonData: [],
            offset: 0,
            hasMore: true,
            error: null,
            loading: false,
            refreshing: false,
            loadingMore: false,
         };
      case "SET_HAS_MORE":
         return {
            ...state,
            hasMore: action.payload.hasMore,
         };
      default:
         return state;
   }
};
