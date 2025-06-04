import { useState, useEffect, useCallback } from "react";
import { berryService } from "../../API";
import type { Berry, BerryFlavor, BerryFirmness } from "pokenode-ts";

interface UseBerryState<T> {
   data: T | null;
   loading: boolean;
   error: string | null;
}

interface UseBerryListState<T> {
   data: T[];
   loading: boolean;
   error: string | null;
   hasMore: boolean;
}

export const useBerry = (identifier?: string | number) => {
   const [state, setState] = useState<UseBerryState<Berry>>({
      data: null,
      loading: false,
      error: null,
   });

   const fetchBerry = useCallback(async (id: string | number) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const berry = await berryService.getBerry(id);
         setState({ data: berry, loading: false, error: null });
      } catch (err) {
         setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : "Failed to fetch berry",
         });
      }
   }, []);

   useEffect(() => {
      if (identifier) {
         fetchBerry(identifier);
      }
   }, [identifier, fetchBerry]);

   return {
      ...state,
      refetch: identifier ? () => fetchBerry(identifier) : undefined,
   };
};

export const useBerryList = (initialOffset: number = 0, limit: number = 20) => {
   const [state, setState] = useState<UseBerryListState<any>>({
      data: [],
      loading: false,
      error: null,
      hasMore: true,
   });
   const [offset, setOffset] = useState(initialOffset);

   const fetchBerries = useCallback(
      async (currentOffset: number, reset: boolean = false) => {
         setState((prev) => ({ ...prev, loading: true, error: null }));

         try {
            const response = await berryService.getBerryList(
               currentOffset,
               limit
            );

            setState((prev) => ({
               data: reset
                  ? response.results
                  : [...prev.data, ...response.results],
               loading: false,
               error: null,
               hasMore: !!response.next,
            }));
         } catch (err) {
            setState((prev) => ({
               ...prev,
               loading: false,
               error:
                  err instanceof Error
                     ? err.message
                     : "Failed to fetch berries",
            }));
         }
      },
      [limit]
   );

   const loadMore = useCallback(() => {
      if (!state.loading && state.hasMore) {
         const nextOffset = offset + limit;
         setOffset(nextOffset);
         fetchBerries(nextOffset, false);
      }
   }, [offset, limit, state.loading, state.hasMore, fetchBerries]);

   const refresh = useCallback(() => {
      setOffset(0);
      fetchBerries(0, true);
   }, [fetchBerries]);

   useEffect(() => {
      fetchBerries(offset, true);
   }, []);

   return {
      ...state,
      loadMore,
      refresh,
   };
};

export const useBerryFlavor = (identifier?: string | number) => {
   const [state, setState] = useState<UseBerryState<BerryFlavor>>({
      data: null,
      loading: false,
      error: null,
   });

   const fetchBerryFlavor = useCallback(async (id: string | number) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const flavor = await berryService.getBerryFlavor(id);
         setState({ data: flavor, loading: false, error: null });
      } catch (err) {
         setState({
            data: null,
            loading: false,
            error:
               err instanceof Error
                  ? err.message
                  : "Failed to fetch berry flavor",
         });
      }
   }, []);

   useEffect(() => {
      if (identifier) {
         fetchBerryFlavor(identifier);
      }
   }, [identifier, fetchBerryFlavor]);

   return {
      ...state,
      refetch: identifier ? () => fetchBerryFlavor(identifier) : undefined,
   };
};

export const useBerryFirmness = (identifier?: string | number) => {
   const [state, setState] = useState<UseBerryState<BerryFirmness>>({
      data: null,
      loading: false,
      error: null,
   });

   const fetchBerryFirmness = useCallback(async (id: string | number) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const firmness = await berryService.getBerryFirmness(id);
         setState({ data: firmness, loading: false, error: null });
      } catch (err) {
         setState({
            data: null,
            loading: false,
            error:
               err instanceof Error
                  ? err.message
                  : "Failed to fetch berry firmness",
         });
      }
   }, []);

   useEffect(() => {
      if (identifier) {
         fetchBerryFirmness(identifier);
      }
   }, [identifier, fetchBerryFirmness]);

   return {
      ...state,
      refetch: identifier ? () => fetchBerryFirmness(identifier) : undefined,
   };
};

export const useBerriesByFlavor = (flavorName?: string) => {
   const [state, setState] = useState<UseBerryListState<any>>({
      data: [],
      loading: false,
      error: null,
      hasMore: false,
   });

   const fetchBerriesByFlavor = useCallback(async (flavor: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const berries = await berryService.getBerriesByFlavor(flavor);
         setState({
            data: berries,
            loading: false,
            error: null,
            hasMore: false,
         });
      } catch (err) {
         setState({
            data: [],
            loading: false,
            error:
               err instanceof Error
                  ? err.message
                  : "Failed to fetch berries by flavor",
            hasMore: false,
         });
      }
   }, []);

   useEffect(() => {
      if (flavorName) {
         fetchBerriesByFlavor(flavorName);
      }
   }, [flavorName, fetchBerriesByFlavor]);

   return {
      ...state,
      refetch: flavorName ? () => fetchBerriesByFlavor(flavorName) : undefined,
   };
};
