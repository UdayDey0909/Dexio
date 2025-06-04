import { useState, useEffect, useCallback } from "react";
import { contestService } from "../../API";
import type {
   ContestType,
   ContestEffect,
   SuperContestEffect,
} from "pokenode-ts";

interface UseContestState<T> {
   data: T | null;
   loading: boolean;
   error: string | null;
}

interface UseContestListState<T> {
   data: T[];
   loading: boolean;
   error: string | null;
   hasMore: boolean;
}

export const useContestType = (identifier?: string | number) => {
   const [state, setState] = useState<UseContestState<ContestType>>({
      data: null,
      loading: false,
      error: null,
   });

   const fetchContestType = useCallback(async (id: string | number) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const contestType = await contestService.getContestType(id);
         setState({ data: contestType, loading: false, error: null });
      } catch (err) {
         setState({
            data: null,
            loading: false,
            error:
               err instanceof Error
                  ? err.message
                  : "Failed to fetch contest type",
         });
      }
   }, []);

   useEffect(() => {
      if (identifier) {
         fetchContestType(identifier);
      }
   }, [identifier, fetchContestType]);

   return {
      ...state,
      refetch: identifier ? () => fetchContestType(identifier) : undefined,
   };
};

export const useContestTypeList = (
   initialOffset: number = 0,
   limit: number = 20
) => {
   const [state, setState] = useState<UseContestListState<any>>({
      data: [],
      loading: false,
      error: null,
      hasMore: true,
   });
   const [offset, setOffset] = useState(initialOffset);

   const fetchContestTypes = useCallback(
      async (currentOffset: number, reset: boolean = false) => {
         setState((prev) => ({ ...prev, loading: true, error: null }));

         try {
            const response = await contestService.getContestTypeList(
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
                     : "Failed to fetch contest types",
            }));
         }
      },
      [limit]
   );

   const loadMore = useCallback(() => {
      if (!state.loading && state.hasMore) {
         const nextOffset = offset + limit;
         setOffset(nextOffset);
         fetchContestTypes(nextOffset, false);
      }
   }, [offset, limit, state.loading, state.hasMore, fetchContestTypes]);

   const refresh = useCallback(() => {
      setOffset(0);
      fetchContestTypes(0, true);
   }, [fetchContestTypes]);

   useEffect(() => {
      fetchContestTypes(offset, true);
   }, []);

   return {
      ...state,
      loadMore,
      refresh,
   };
};

export const useContestEffect = (id?: number) => {
   const [state, setState] = useState<UseContestState<ContestEffect>>({
      data: null,
      loading: false,
      error: null,
   });

   const fetchContestEffect = useCallback(async (effectId: number) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const effect = await contestService.getContestEffect(effectId);
         setState({ data: effect, loading: false, error: null });
      } catch (err) {
         setState({
            data: null,
            loading: false,
            error:
               err instanceof Error
                  ? err.message
                  : "Failed to fetch contest effect",
         });
      }
   }, []);

   useEffect(() => {
      if (id) {
         fetchContestEffect(id);
      }
   }, [id, fetchContestEffect]);

   return {
      ...state,
      refetch: id ? () => fetchContestEffect(id) : undefined,
   };
};

export const useSuperContestEffect = (id?: number) => {
   const [state, setState] = useState<UseContestState<SuperContestEffect>>({
      data: null,
      loading: false,
      error: null,
   });

   const fetchSuperContestEffect = useCallback(async (effectId: number) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const effect = await contestService.getSuperContestEffect(effectId);
         setState({ data: effect, loading: false, error: null });
      } catch (err) {
         setState({
            data: null,
            loading: false,
            error:
               err instanceof Error
                  ? err.message
                  : "Failed to fetch super contest effect",
         });
      }
   }, []);

   useEffect(() => {
      if (id) {
         fetchSuperContestEffect(id);
      }
   }, [id, fetchSuperContestEffect]);

   return {
      ...state,
      refetch: id ? () => fetchSuperContestEffect(id) : undefined,
   };
};

export const useAllContestTypes = () => {
   const [state, setState] = useState<UseContestListState<ContestType>>({
      data: [],
      loading: false,
      error: null,
      hasMore: false,
   });

   const fetchAllContestTypes = useCallback(async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const contestTypes = await contestService.getAllContestTypes();
         setState({
            data: contestTypes,
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
                  : "Failed to fetch all contest types",
            hasMore: false,
         });
      }
   }, []);

   useEffect(() => {
      fetchAllContestTypes();
   }, [fetchAllContestTypes]);

   return {
      ...state,
      refetch: fetchAllContestTypes,
   };
};

export const useBatchContestEffects = (ids?: number[]) => {
   const [state, setState] = useState<UseContestListState<ContestEffect>>({
      data: [],
      loading: false,
      error: null,
      hasMore: false,
   });

   const fetchBatchEffects = useCallback(async (effectIds: number[]) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const effects = await contestService.batchGetContestEffects(effectIds);
         setState({
            data: effects,
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
                  : "Failed to fetch contest effects",
            hasMore: false,
         });
      }
   }, []);

   useEffect(() => {
      if (ids && ids.length > 0) {
         fetchBatchEffects(ids);
      }
   }, [ids, fetchBatchEffects]);

   return {
      ...state,
      refetch: ids ? () => fetchBatchEffects(ids) : undefined,
   };
};
