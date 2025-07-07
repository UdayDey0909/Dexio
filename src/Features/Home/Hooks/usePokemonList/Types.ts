import { PokemonCardData } from "../../Types";

export interface PokemonListState {
   pokemonData: PokemonCardData[];
   loading: boolean;
   error: string | null;
   refreshing: boolean;
   hasMore: boolean;
   offset: number;
   loadingMore: boolean;
}

export interface UsePokemonListReturn extends PokemonListState {
   refetch: () => void;
   onRefresh: () => void;
   loadMore: () => void;
}

export type PokemonListAction =
   | {
        type: "FETCH_START";
        payload: { isRefresh: boolean; isLoadMore: boolean };
     }
   | {
        type: "FETCH_SUCCESS";
        payload: {
           data: PokemonCardData[];
           hasMore: boolean;
           offset: number;
           isRefresh: boolean;
        };
     }
   | { type: "FETCH_ERROR"; payload: { error: string } }
   | { type: "RESET" }
   | { type: "SET_HAS_MORE"; payload: { hasMore: boolean } };
