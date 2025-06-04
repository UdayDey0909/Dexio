import { useState, useEffect, useCallback } from "react";
import { GameService } from "../../API/Game";
import type { Generation, Pokedex, Version, VersionGroup } from "pokenode-ts";

interface GameHookState<T> {
   data: T | null;
   loading: boolean;
   error: string | null;
}

interface UseGameReturn {
   // Generations
   generation: GameHookState<Generation>;
   generationList: GameHookState<any>;
   getGeneration: (identifier: string | number) => Promise<void>;
   getGenerationList: (offset?: number, limit?: number) => Promise<void>;
   getPokemonByGeneration: (generationName: string) => Promise<void>;

   // Pokedex
   pokedex: GameHookState<Pokedex>;
   pokedexList: GameHookState<any>;
   getPokedex: (identifier: string | number) => Promise<void>;
   getPokedexList: (offset?: number, limit?: number) => Promise<void>;
   getPokedexEntries: (pokedexName: string) => Promise<void>;

   // Versions
   version: GameHookState<Version>;
   versionList: GameHookState<any>;
   getVersion: (identifier: string | number) => Promise<void>;
   getVersionList: (offset?: number, limit?: number) => Promise<void>;

   // Version Groups
   versionGroup: GameHookState<VersionGroup>;
   versionGroupList: GameHookState<any>;
   getVersionGroup: (identifier: string | number) => Promise<void>;
   getVersionGroupList: (offset?: number, limit?: number) => Promise<void>;

   // Special data states
   pokemonByGeneration: GameHookState<any>;
   pokedexEntries: GameHookState<any>;

   // Utilities
   clearAll: () => void;
   isOnline: boolean;
}

export const useGame = (): UseGameReturn => {
   const [service] = useState(() => new GameService());

   // State for generations
   const [generation, setGeneration] = useState<GameHookState<Generation>>({
      data: null,
      loading: false,
      error: null,
   });

   const [generationList, setGenerationList] = useState<GameHookState<any>>({
      data: null,
      loading: false,
      error: null,
   });

   // State for pokedex
   const [pokedex, setPokedex] = useState<GameHookState<Pokedex>>({
      data: null,
      loading: false,
      error: null,
   });

   const [pokedexList, setPokedexList] = useState<GameHookState<any>>({
      data: null,
      loading: false,
      error: null,
   });

   // State for versions
   const [version, setVersion] = useState<GameHookState<Version>>({
      data: null,
      loading: false,
      error: null,
   });

   const [versionList, setVersionList] = useState<GameHookState<any>>({
      data: null,
      loading: false,
      error: null,
   });

   // State for version groups
   const [versionGroup, setVersionGroup] = useState<
      GameHookState<VersionGroup>
   >({
      data: null,
      loading: false,
      error: null,
   });

   const [versionGroupList, setVersionGroupList] = useState<GameHookState<any>>(
      {
         data: null,
         loading: false,
         error: null,
      }
   );

   // State for special data
   const [pokemonByGeneration, setPokemonByGeneration] = useState<
      GameHookState<any>
   >({
      data: null,
      loading: false,
      error: null,
   });

   const [pokedexEntries, setPokedexEntries] = useState<GameHookState<any>>({
      data: null,
      loading: false,
      error: null,
   });

   const [isOnline, setIsOnline] = useState(true);

   // Check connection status
   useEffect(() => {
      const checkConnection = async () => {
         const online = await service.checkConnection();
         setIsOnline(online);
      };

      checkConnection();
      const interval = setInterval(checkConnection, 30000);

      return () => clearInterval(interval);
   }, [service]);

   // Generation functions
   const getGeneration = useCallback(
      async (identifier: string | number) => {
         setGeneration((prev) => ({ ...prev, loading: true, error: null }));

         try {
            const data = await service.getGeneration(identifier);
            setGeneration({ data, loading: false, error: null });
         } catch (error) {
            const errorMessage =
               error instanceof Error
                  ? error.message
                  : "Failed to fetch generation";
            setGeneration({ data: null, loading: false, error: errorMessage });
         }
      },
      [service]
   );

   const getGenerationList = useCallback(
      async (offset = 0, limit = 20) => {
         setGenerationList((prev) => ({ ...prev, loading: true, error: null }));

         try {
            const data = await service.getGenerationList(offset, limit);
            setGenerationList({ data, loading: false, error: null });
         } catch (error) {
            const errorMessage =
               error instanceof Error
                  ? error.message
                  : "Failed to fetch generation list";
            setGenerationList({
               data: null,
               loading: false,
               error: errorMessage,
            });
         }
      },
      [service]
   );

   const getPokemonByGeneration = useCallback(
      async (generationName: string) => {
         setPokemonByGeneration((prev) => ({
            ...prev,
            loading: true,
            error: null,
         }));

         try {
            const data = await service.getPokemonByGeneration(generationName);
            setPokemonByGeneration({ data, loading: false, error: null });
         } catch (error) {
            const errorMessage =
               error instanceof Error
                  ? error.message
                  : "Failed to fetch pokemon by generation";
            setPokemonByGeneration({
               data: null,
               loading: false,
               error: errorMessage,
            });
         }
      },
      [service]
   );

   // Pokedex functions
   const getPokedex = useCallback(
      async (identifier: string | number) => {
         setPokedex((prev) => ({ ...prev, loading: true, error: null }));

         try {
            const data = await service.getPokedex(identifier);
            setPokedex({ data, loading: false, error: null });
         } catch (error) {
            const errorMessage =
               error instanceof Error
                  ? error.message
                  : "Failed to fetch pokedex";
            setPokedex({ data: null, loading: false, error: errorMessage });
         }
      },
      [service]
   );

   const getPokedexList = useCallback(
      async (offset = 0, limit = 20) => {
         setPokedexList((prev) => ({ ...prev, loading: true, error: null }));

         try {
            const data = await service.getPokedexList(offset, limit);
            setPokedexList({ data, loading: false, error: null });
         } catch (error) {
            const errorMessage =
               error instanceof Error
                  ? error.message
                  : "Failed to fetch pokedex list";
            setPokedexList({ data: null, loading: false, error: errorMessage });
         }
      },
      [service]
   );

   const getPokedexEntries = useCallback(
      async (pokedexName: string) => {
         setPokedexEntries((prev) => ({ ...prev, loading: true, error: null }));

         try {
            const data = await service.getPokedexEntries(pokedexName);
            setPokedexEntries({ data, loading: false, error: null });
         } catch (error) {
            const errorMessage =
               error instanceof Error
                  ? error.message
                  : "Failed to fetch pokedex entries";
            setPokedexEntries({
               data: null,
               loading: false,
               error: errorMessage,
            });
         }
      },
      [service]
   );

   // Version functions
   const getVersion = useCallback(
      async (identifier: string | number) => {
         setVersion((prev) => ({ ...prev, loading: true, error: null }));

         try {
            const data = await service.getVersion(identifier);
            setVersion({ data, loading: false, error: null });
         } catch (error) {
            const errorMessage =
               error instanceof Error
                  ? error.message
                  : "Failed to fetch version";
            setVersion({ data: null, loading: false, error: errorMessage });
         }
      },
      [service]
   );

   const getVersionList = useCallback(
      async (offset = 0, limit = 20) => {
         setVersionList((prev) => ({ ...prev, loading: true, error: null }));

         try {
            const data = await service.getVersionList(offset, limit);
            setVersionList({ data, loading: false, error: null });
         } catch (error) {
            const errorMessage =
               error instanceof Error
                  ? error.message
                  : "Failed to fetch version list";
            setVersionList({ data: null, loading: false, error: errorMessage });
         }
      },
      [service]
   );

   // Version Group functions
   const getVersionGroup = useCallback(
      async (identifier: string | number) => {
         setVersionGroup((prev) => ({ ...prev, loading: true, error: null }));

         try {
            const data = await service.getVersionGroup(identifier);
            setVersionGroup({ data, loading: false, error: null });
         } catch (error) {
            const errorMessage =
               error instanceof Error
                  ? error.message
                  : "Failed to fetch version group";
            setVersionGroup({
               data: null,
               loading: false,
               error: errorMessage,
            });
         }
      },
      [service]
   );

   const getVersionGroupList = useCallback(
      async (offset = 0, limit = 20) => {
         setVersionGroupList((prev) => ({
            ...prev,
            loading: true,
            error: null,
         }));

         try {
            const data = await service.getVersionGroupList(offset, limit);
            setVersionGroupList({ data, loading: false, error: null });
         } catch (error) {
            const errorMessage =
               error instanceof Error
                  ? error.message
                  : "Failed to fetch version group list";
            setVersionGroupList({
               data: null,
               loading: false,
               error: errorMessage,
            });
         }
      },
      [service]
   );

   // Utility function to clear all states
   const clearAll = useCallback(() => {
      setGeneration({ data: null, loading: false, error: null });
      setGenerationList({ data: null, loading: false, error: null });
      setPokedex({ data: null, loading: false, error: null });
      setPokedexList({ data: null, loading: false, error: null });
      setVersion({ data: null, loading: false, error: null });
      setVersionList({ data: null, loading: false, error: null });
      setVersionGroup({ data: null, loading: false, error: null });
      setVersionGroupList({ data: null, loading: false, error: null });
      setPokemonByGeneration({ data: null, loading: false, error: null });
      setPokedexEntries({ data: null, loading: false, error: null });
   }, []);

   // Cleanup on unmount
   useEffect(() => {
      return () => {
         service.cleanup();
      };
   }, [service]);

   return {
      // Generations
      generation,
      generationList,
      getGeneration,
      getGenerationList,
      getPokemonByGeneration,

      // Pokedex
      pokedex,
      pokedexList,
      getPokedex,
      getPokedexList,
      getPokedexEntries,

      // Versions
      version,
      versionList,
      getVersion,
      getVersionList,

      // Version Groups
      versionGroup,
      versionGroupList,
      getVersionGroup,
      getVersionGroupList,

      // Special data
      pokemonByGeneration,
      pokedexEntries,

      // Utilities
      clearAll,
      isOnline,
   };
};
