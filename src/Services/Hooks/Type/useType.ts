import { useState, useEffect, useCallback } from "react";
import { TypeService } from "../../API/Type";
import type { Type } from "pokenode-ts";

interface UseTypeState {
   data: Type | null;
   loading: boolean;
   error: string | null;
}

interface UseTypesState {
   data: Type[];
   loading: boolean;
   error: string | null;
}

interface UseTypeEffectivenessState {
   data: {
      doubleDamageTo: any[];
      doubleDamageFrom: any[];
      halfDamageTo: any[];
      halfDamageFrom: any[];
      noDamageTo: any[];
      noDamageFrom: any[];
   } | null;
   loading: boolean;
   error: string | null;
}

interface UseTypeMatchupState {
   data: {
      attackingType: string;
      defendingType: string;
      multiplier: number;
      effectiveness: string;
   } | null;
   loading: boolean;
   error: string | null;
}

// Single type hook
export const useType = (identifier?: string | number) => {
   const [state, setState] = useState<UseTypeState>({
      data: null,
      loading: false,
      error: null,
   });

   const typeService = new TypeService();

   const fetchType = useCallback(async (id: string | number) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const type = await typeService.getType(id);
         setState({ data: type, loading: false, error: null });
      } catch (error) {
         setState({
            data: null,
            loading: false,
            error:
               error instanceof Error ? error.message : "Failed to fetch type",
         });
      }
   }, []);

   const refetch = useCallback(() => {
      if (identifier) {
         fetchType(identifier);
      }
   }, [identifier, fetchType]);

   useEffect(() => {
      if (identifier) {
         fetchType(identifier);
      }
   }, [identifier, fetchType]);

   return {
      ...state,
      refetch,
   };
};

// All types hook
export const useAllTypes = () => {
   const [state, setState] = useState<UseTypesState>({
      data: [],
      loading: false,
      error: null,
   });

   const typeService = new TypeService();

   const fetchAllTypes = useCallback(async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const types = await typeService.getAllTypes();
         setState({ data: types, loading: false, error: null });
      } catch (error) {
         setState({
            data: [],
            loading: false,
            error:
               error instanceof Error ? error.message : "Failed to fetch types",
         });
      }
   }, []);

   useEffect(() => {
      fetchAllTypes();
   }, [fetchAllTypes]);

   return {
      ...state,
      refetch: fetchAllTypes,
   };
};

// Type effectiveness hook
export const useTypeEffectiveness = (typeName?: string) => {
   const [state, setState] = useState<UseTypeEffectivenessState>({
      data: null,
      loading: false,
      error: null,
   });

   const typeService = new TypeService();

   const fetchEffectiveness = useCallback(async (name: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const effectiveness = await typeService.getTypeEffectiveness(name);
         setState({ data: effectiveness, loading: false, error: null });
      } catch (error) {
         setState({
            data: null,
            loading: false,
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to fetch type effectiveness",
         });
      }
   }, []);

   const refetch = useCallback(() => {
      if (typeName) {
         fetchEffectiveness(typeName);
      }
   }, [typeName, fetchEffectiveness]);

   useEffect(() => {
      if (typeName) {
         fetchEffectiveness(typeName);
      }
   }, [typeName, fetchEffectiveness]);

   return {
      ...state,
      refetch,
   };
};

// Type matchup hook
export const useTypeMatchup = (
   attackingType?: string,
   defendingType?: string
) => {
   const [state, setState] = useState<UseTypeMatchupState>({
      data: null,
      loading: false,
      error: null,
   });

   const typeService = new TypeService();

   const fetchMatchup = useCallback(
      async (attacking: string, defending: string) => {
         setState((prev) => ({ ...prev, loading: true, error: null }));

         try {
            const matchup = await typeService.getTypeMatchups(
               attacking,
               defending
            );
            setState({ data: matchup, loading: false, error: null });
         } catch (error) {
            setState({
               data: null,
               loading: false,
               error:
                  error instanceof Error
                     ? error.message
                     : "Failed to fetch type matchup",
            });
         }
      },
      []
   );

   const refetch = useCallback(() => {
      if (attackingType && defendingType) {
         fetchMatchup(attackingType, defendingType);
      }
   }, [attackingType, defendingType, fetchMatchup]);

   useEffect(() => {
      if (attackingType && defendingType) {
         fetchMatchup(attackingType, defendingType);
      }
   }, [attackingType, defendingType, fetchMatchup]);

   return {
      ...state,
      refetch,
   };
};

// Pokemon by type hook
export const usePokemonByType = (typeName?: string) => {
   const [state, setState] = useState<{
      data: any[];
      loading: boolean;
      error: string | null;
   }>({
      data: [],
      loading: false,
      error: null,
   });

   const typeService = new TypeService();

   const fetchPokemonByType = useCallback(async (name: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const pokemon = await typeService.getPokemonByType(name);
         setState({ data: pokemon, loading: false, error: null });
      } catch (error) {
         setState({
            data: [],
            loading: false,
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to fetch Pokemon by type",
         });
      }
   }, []);

   const refetch = useCallback(() => {
      if (typeName) {
         fetchPokemonByType(typeName);
      }
   }, [typeName, fetchPokemonByType]);

   useEffect(() => {
      if (typeName) {
         fetchPokemonByType(typeName);
      }
   }, [typeName, fetchPokemonByType]);

   return {
      ...state,
      refetch,
   };
};
