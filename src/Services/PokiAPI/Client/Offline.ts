// shared/services/api/client/offline.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { queryClient, CACHE_CONFIG, CACHE_KEY } from "./Cache";

// Types for offline storage
interface StorageInfo {
   totalKeys: number;
   offlineKeys: number;
   estimatedSize: number; // Size in bytes (approximate)
}

interface CriticalPokemonData {
   id: number;
   name: string;
   sprite: string;
   types: string[];
   stats: Record<string, number>;
}

interface UserPreferences {
   theme?: "light" | "dark" | "auto";
   language?: string;
   favoriteType?: string;
   notifications?: boolean;
   cachePreference?: "aggressive" | "normal" | "minimal";
   [key: string]: any;
}

// Allowed offline storage keys for type safety
export const OFFLINE_STORAGE_KEYS = {
   CRITICAL_POKEMON_DATA: "critical_pokemon_data",
   CRITICAL_DATA_TIMESTAMP: "critical_data_timestamp",
   USER_PREFERENCES: "user_preferences",
   SEARCH_HISTORY: "search_history",
   FAVORITES: "favorites",
   TEAM: "team",
   APP_STATE: "app_state",
} as const;

export type OfflineStorageKey =
   (typeof OFFLINE_STORAGE_KEYS)[keyof typeof OFFLINE_STORAGE_KEYS];

/**
 * AsyncStorage persister with enhanced error handling and versioning
 * Handles cache persistence across app sessions with graceful error recovery
 * Throttles writes to prevent excessive I/O operations
 */
const asyncStoragePersister = createAsyncStoragePersister({
   storage: AsyncStorage,
   key: CACHE_KEY, // Uses consistent versioned cache key
   serialize: (data) => {
      try {
         return JSON.stringify(data);
      } catch (error) {
         console.warn("Cache serialization failed:", error);
         return "{}";
      }
   },
   deserialize: (data) => {
      try {
         return JSON.parse(data);
      } catch (error) {
         console.warn("Cache deserialization failed:", error);
         return {};
      }
   },
   throttleTime: 1000, // Throttle writes to AsyncStorage (prevents excessive I/O)
});

/**
 * Cache migration utilities for handling version changes
 * Provides a framework for future cache structure changes
 */
export const cacheMigration = {
   /**
    * Get current cache version from AsyncStorage
    * @returns Promise resolving to current version or null
    */
   getCurrentVersion: async (): Promise<string | null> => {
      try {
         return await AsyncStorage.getItem(
            `${CACHE_CONFIG.CACHE_KEY_PREFIX}-version`
         );
      } catch (error) {
         console.warn("Failed to get cache version:", error);
         return null;
      }
   },

   /**
    * Set cache version in AsyncStorage
    * @param version - Version string to set
    */
   setVersion: async (version: string): Promise<void> => {
      try {
         await AsyncStorage.setItem(
            `${CACHE_CONFIG.CACHE_KEY_PREFIX}-version`,
            version
         );
      } catch (error) {
         console.warn("Failed to set cache version:", error);
      }
   },

   /**
    * Check if cache migration is needed
    * @returns Promise resolving to boolean indicating if migration is needed
    */
   needsMigration: async (): Promise<boolean> => {
      const currentVersion = await cacheMigration.getCurrentVersion();
      return currentVersion !== CACHE_CONFIG.VERSION;
   },

   /**
    * Get all legacy cache keys that need to be removed
    * @returns Array of legacy cache key patterns
    */
   getLegacyCacheKeys: async (): Promise<string[]> => {
      try {
         const allKeys = await AsyncStorage.getAllKeys();
         return allKeys.filter(
            (key) =>
               key.startsWith(CACHE_CONFIG.CACHE_KEY_PREFIX) &&
               key !== CACHE_KEY &&
               key !== `${CACHE_CONFIG.CACHE_KEY_PREFIX}-version`
         );
      } catch (error) {
         console.warn("Failed to get legacy cache keys:", error);
         return [];
      }
   },

   /**
    * Perform cache migration if needed
    * Clears old cache and sets new version
    */
   migrate: async (): Promise<void> => {
      if (await cacheMigration.needsMigration()) {
         console.log("Performing cache migration...");

         try {
            // Clear React Query cache
            await queryClient.clear();

            // Remove all legacy cache keys
            const legacyKeys = await cacheMigration.getLegacyCacheKeys();
            if (legacyKeys.length > 0) {
               await AsyncStorage.multiRemove(legacyKeys);
               console.log(`Removed ${legacyKeys.length} legacy cache keys`);
            }

            // Optionally clear offline storage during major migrations
            // Uncomment if needed for breaking changes
            // await offlineStorage.clearAll();

            // Set new version
            await cacheMigration.setVersion(CACHE_CONFIG.VERSION);
            console.log(
               `Cache migration completed to version ${CACHE_CONFIG.VERSION}`
            );
         } catch (error) {
            console.error("Cache migration failed:", error);
            // Fallback: clear everything
            await AsyncStorage.clear();
            await cacheMigration.setVersion(CACHE_CONFIG.VERSION);
         }
      }
   },
};

/**
 * Enhanced offline storage utilities for handling persistent data
 * Provides type-safe methods for managing offline-specific data storage
 */
export const offlineStorage = {
   /**
    * Store data for offline access with type safety
    * @param key - Storage key from OFFLINE_STORAGE_KEYS
    * @param data - Data to store
    */
   store: async <T = any>(key: OfflineStorageKey, data: T): Promise<void> => {
      try {
         const serializedData = JSON.stringify(data);
         await AsyncStorage.setItem(`offline_${key}`, serializedData);
      } catch (error) {
         console.warn(`Failed to store offline data for key ${key}:`, error);
         throw new Error(`Offline storage failed for key: ${key}`);
      }
   },

   /**
    * Retrieve data from offline storage with type safety
    * @param key - Storage key from OFFLINE_STORAGE_KEYS
    * @returns Promise resolving to stored data or null
    */
   retrieve: async <T = any>(key: OfflineStorageKey): Promise<T | null> => {
      try {
         const serializedData = await AsyncStorage.getItem(`offline_${key}`);
         return serializedData ? JSON.parse(serializedData) : null;
      } catch (error) {
         console.warn(`Failed to retrieve offline data for key ${key}:`, error);
         return null;
      }
   },

   /**
    * Remove data from offline storage
    * @param key - Storage key from OFFLINE_STORAGE_KEYS
    */
   remove: async (key: OfflineStorageKey): Promise<void> => {
      try {
         await AsyncStorage.removeItem(`offline_${key}`);
      } catch (error) {
         console.warn(`Failed to remove offline data for key ${key}:`, error);
      }
   },

   /**
    * Clear all offline storage data
    */
   clearAll: async (): Promise<void> => {
      try {
         const keys = await AsyncStorage.getAllKeys();
         const offlineKeys = keys.filter((key) => key.startsWith("offline_"));
         if (offlineKeys.length > 0) {
            await AsyncStorage.multiRemove(offlineKeys);
            console.log(`Cleared ${offlineKeys.length} offline storage keys`);
         }
      } catch (error) {
         console.warn("Failed to clear offline storage:", error);
      }
   },

   /**
    * Get all stored offline keys (without 'offline_' prefix)
    * @returns Promise resolving to array of offline storage keys
    */
   getAllKeys: async (): Promise<string[]> => {
      try {
         const keys = await AsyncStorage.getAllKeys();
         return keys
            .filter((key) => key.startsWith("offline_"))
            .map((key) => key.replace("offline_", ""));
      } catch (error) {
         console.warn("Failed to get offline storage keys:", error);
         return [];
      }
   },

   /**
    * Check if data exists in offline storage
    * @param key - Storage key from OFFLINE_STORAGE_KEYS
    * @returns Promise resolving to boolean
    */
   exists: async (key: OfflineStorageKey): Promise<boolean> => {
      try {
         const data = await AsyncStorage.getItem(`offline_${key}`);
         return data !== null;
      } catch (error) {
         console.warn(`Failed to check existence for key ${key}:`, error);
         return false;
      }
   },

   /**
    * Get storage size information
    * Note: Size is estimated based on string length and may vary by platform
    * @returns Promise resolving to storage statistics
    */
   getStorageInfo: async (): Promise<StorageInfo> => {
      try {
         const allKeys = await AsyncStorage.getAllKeys();
         const offlineKeys = allKeys.filter((key) =>
            key.startsWith("offline_")
         );

         // Estimate size by sampling data (for performance with large datasets)
         let estimatedSize = 0;
         const sampleSize = Math.min(offlineKeys.length, 10);

         for (let i = 0; i < sampleSize; i++) {
            const key = offlineKeys[i];
            const data = await AsyncStorage.getItem(key);
            if (data) {
               // Rough estimate: string length ≈ bytes (may vary by encoding)
               estimatedSize += data.length;
            }
         }

         // Extrapolate for all keys
         const avgKeySize = sampleSize > 0 ? estimatedSize / sampleSize : 0;
         const totalEstimatedSize = avgKeySize * offlineKeys.length;

         return {
            totalKeys: allKeys.length,
            offlineKeys: offlineKeys.length,
            estimatedSize: Math.round(totalEstimatedSize),
         };
      } catch (error) {
         console.warn("Failed to get storage info:", error);
         return {
            totalKeys: 0,
            offlineKeys: 0,
            estimatedSize: 0,
         };
      }
   },

   /**
    * Batch store multiple key-value pairs
    * @param entries - Array of [key, data] tuples
    */
   batchStore: async <T = any>(
      entries: Array<[OfflineStorageKey, T]>
   ): Promise<void> => {
      try {
         const operations = entries.map(([key, data]) => [
            `offline_${key}`,
            JSON.stringify(data),
         ]) as Array<[string, string]>;

         await AsyncStorage.multiSet(operations);
      } catch (error) {
         console.warn("Failed to batch store offline data:", error);
         throw new Error("Batch offline storage failed");
      }
   },

   /**
    * Batch retrieve multiple keys
    * @param keys - Array of storage keys
    * @returns Promise resolving to array of [key, data] tuples
    */
   batchRetrieve: async <T = any>(
      keys: OfflineStorageKey[]
   ): Promise<Array<[OfflineStorageKey, T | null]>> => {
      try {
         const prefixedKeys = keys.map((key) => `offline_${key}`);
         const results = await AsyncStorage.multiGet(prefixedKeys);

         return results.map(([prefixedKey, value], index) => {
            const originalKey = keys[index];
            const parsedValue = value ? JSON.parse(value) : null;
            return [originalKey, parsedValue] as [OfflineStorageKey, T | null];
         });
      } catch (error) {
         console.warn("Failed to batch retrieve offline data:", error);
         return keys.map((key) => [key, null]);
      }
   },
};

/**
 * Network status and offline handling utilities
 * Specialized functions for Pokemon app offline functionality
 */
export const offlineUtils = {
   /**
    * Store critical Pokemon data for offline access
    * @param pokemonList - Array of Pokemon data to store
    */
   storeCriticalPokemonData: async (
      pokemonList: CriticalPokemonData[]
   ): Promise<void> => {
      try {
         await offlineStorage.store(
            OFFLINE_STORAGE_KEYS.CRITICAL_POKEMON_DATA,
            pokemonList
         );
         await offlineStorage.store(
            OFFLINE_STORAGE_KEYS.CRITICAL_DATA_TIMESTAMP,
            Date.now()
         );
         console.log(`Stored ${pokemonList.length} critical Pokemon records`);
      } catch (error) {
         console.warn("Failed to store critical Pokemon data:", error);
      }
   },

   /**
    * Retrieve critical Pokemon data for offline access
    * @returns Promise resolving to stored Pokemon data or null
    */
   getCriticalPokemonData: async (): Promise<CriticalPokemonData[] | null> => {
      try {
         return await offlineStorage.retrieve<CriticalPokemonData[]>(
            OFFLINE_STORAGE_KEYS.CRITICAL_POKEMON_DATA
         );
      } catch (error) {
         console.warn("Failed to retrieve critical Pokemon data:", error);
         return null;
      }
   },

   /**
    * Check if critical data is stale and needs refresh
    * @param maxAge - Maximum age in milliseconds (default: 24 hours)
    * @returns Promise resolving to boolean
    */
   isCriticalDataStale: async (
      maxAge: number = 24 * 60 * 60 * 1000
   ): Promise<boolean> => {
      try {
         const timestamp = await offlineStorage.retrieve<number>(
            OFFLINE_STORAGE_KEYS.CRITICAL_DATA_TIMESTAMP
         );
         if (!timestamp) return true;
         return Date.now() - timestamp > maxAge;
      } catch (error) {
         console.warn("Failed to check critical data staleness:", error);
         return true;
      }
   },

   /**
    * Store user preferences for offline access
    * @param preferences - User preferences object
    */
   storeUserPreferences: async (
      preferences: UserPreferences
   ): Promise<void> => {
      await offlineStorage.store(
         OFFLINE_STORAGE_KEYS.USER_PREFERENCES,
         preferences
      );
   },

   /**
    * Retrieve user preferences with defaults
    * @returns Promise resolving to user preferences
    */
   getUserPreferences: async (): Promise<UserPreferences> => {
      const preferences = await offlineStorage.retrieve<UserPreferences>(
         OFFLINE_STORAGE_KEYS.USER_PREFERENCES
      );

      // Return with sensible defaults
      return {
         theme: "auto",
         language: "en",
         notifications: true,
         cachePreference: "normal",
         ...preferences,
      };
   },

   /**
    * Store search history for offline access with deduplication
    * @param searchHistory - Array of recent searches
    */
   storeSearchHistory: async (searchHistory: string[]): Promise<void> => {
      // Normalize and deduplicate search terms
      const normalizedHistory = searchHistory
         .map((term) => term.trim().toLowerCase())
         .filter((term) => term.length > 0)
         .filter((term, index, arr) => arr.indexOf(term) === index) // Remove duplicates
         .slice(-20); // Limit to last 20 searches

      await offlineStorage.store(
         OFFLINE_STORAGE_KEYS.SEARCH_HISTORY,
         normalizedHistory
      );
   },

   /**
    * Retrieve search history
    * @returns Promise resolving to search history array
    */
   getSearchHistory: async (): Promise<string[]> => {
      const history = await offlineStorage.retrieve<string[]>(
         OFFLINE_STORAGE_KEYS.SEARCH_HISTORY
      );
      return history || [];
   },

   /**
    * Add a search term to history with smart deduplication
    * @param searchTerm - Search term to add
    */
   addToSearchHistory: async (searchTerm: string): Promise<void> => {
      const normalizedTerm = searchTerm.trim().toLowerCase();
      if (!normalizedTerm) return;

      const currentHistory = await offlineUtils.getSearchHistory();
      const updatedHistory = [
         normalizedTerm,
         ...currentHistory.filter((term) => term !== normalizedTerm),
      ];

      await offlineUtils.storeSearchHistory(updatedHistory);
   },

   /**
    * Clear search history
    */
   clearSearchHistory: async (): Promise<void> => {
      await offlineStorage.remove(OFFLINE_STORAGE_KEYS.SEARCH_HISTORY);
   },

   /**
    * Store user's favorite Pokemon
    * @param favorites - Array of Pokemon IDs or names
    */
   storeFavorites: async (favorites: Array<string | number>): Promise<void> => {
      await offlineStorage.store(OFFLINE_STORAGE_KEYS.FAVORITES, favorites);
   },

   /**
    * Retrieve user's favorite Pokemon
    * @returns Promise resolving to favorites array
    */
   getFavorites: async (): Promise<Array<string | number>> => {
      const favorites = await offlineStorage.retrieve<Array<string | number>>(
         OFFLINE_STORAGE_KEYS.FAVORITES
      );
      return favorites || [];
   },

   /**
    * Add Pokemon to favorites
    * @param pokemonId - Pokemon ID or name to add
    */
   addToFavorites: async (pokemonId: string | number): Promise<void> => {
      const currentFavorites = await offlineUtils.getFavorites();
      if (!currentFavorites.includes(pokemonId)) {
         const updatedFavorites = [...currentFavorites, pokemonId];
         await offlineUtils.storeFavorites(updatedFavorites);
      }
   },

   /**
    * Remove Pokemon from favorites
    * @param pokemonId - Pokemon ID or name to remove
    */
   removeFromFavorites: async (pokemonId: string | number): Promise<void> => {
      const currentFavorites = await offlineUtils.getFavorites();
      const updatedFavorites = currentFavorites.filter(
         (id) => id !== pokemonId
      );
      await offlineUtils.storeFavorites(updatedFavorites);
   },

   /**
    * Check if Pokemon is in favorites
    * @param pokemonId - Pokemon ID or name to check
    * @returns Promise resolving to boolean
    */
   isFavorite: async (pokemonId: string | number): Promise<boolean> => {
      const favorites = await offlineUtils.getFavorites();
      return favorites.includes(pokemonId);
   },

   /**
    * Store user's Pokemon team
    * @param team - Array of Pokemon team data
    */
   storeTeam: async (team: CriticalPokemonData[]): Promise<void> => {
      // Limit team size to 6 Pokemon (standard Pokemon team size)
      const limitedTeam = team.slice(0, 6);
      await offlineStorage.store(OFFLINE_STORAGE_KEYS.TEAM, limitedTeam);
   },

   /**
    * Retrieve user's Pokemon team
    * @returns Promise resolving to team array
    */
   getTeam: async (): Promise<CriticalPokemonData[]> => {
      const team = await offlineStorage.retrieve<CriticalPokemonData[]>(
         OFFLINE_STORAGE_KEYS.TEAM
      );
      return team || [];
   },

   /**
    * Add Pokemon to team
    * @param pokemon - Pokemon data to add to team
    */
   addToTeam: async (pokemon: CriticalPokemonData): Promise<void> => {
      const currentTeam = await offlineUtils.getTeam();

      // Check if Pokemon is already in team
      const existingIndex = currentTeam.findIndex((p) => p.id === pokemon.id);
      if (existingIndex !== -1) {
         // Update existing Pokemon data
         currentTeam[existingIndex] = pokemon;
      } else if (currentTeam.length < 6) {
         // Add new Pokemon if team isn't full
         currentTeam.push(pokemon);
      } else {
         // Team is full, replace oldest member (first in array)
         currentTeam.shift();
         currentTeam.push(pokemon);
      }

      await offlineUtils.storeTeam(currentTeam);
   },

   /**
    * Remove Pokemon from team
    * @param pokemonId - Pokemon ID to remove from team
    */
   removeFromTeam: async (pokemonId: number): Promise<void> => {
      const currentTeam = await offlineUtils.getTeam();
      const updatedTeam = currentTeam.filter(
         (pokemon) => pokemon.id !== pokemonId
      );
      await offlineUtils.storeTeam(updatedTeam);
   },

   /**
    * Clear entire Pokemon team
    */
   clearTeam: async (): Promise<void> => {
      await offlineStorage.store(OFFLINE_STORAGE_KEYS.TEAM, []);
   },

   /**
    * Store application state for offline recovery
    * @param appState - Application state object
    */
   storeAppState: async (appState: Record<string, any>): Promise<void> => {
      await offlineStorage.store(OFFLINE_STORAGE_KEYS.APP_STATE, {
         ...appState,
         timestamp: Date.now(),
      });
   },

   /**
    * Retrieve application state
    * @returns Promise resolving to app state or null
    */
   getAppState: async (): Promise<Record<string, any> | null> => {
      return await offlineStorage.retrieve<Record<string, any>>(
         OFFLINE_STORAGE_KEYS.APP_STATE
      );
   },

   /**
    * Comprehensive cleanup of stale offline data
    * @param maxAge - Maximum age for data in milliseconds (default: 7 days)
    */
   cleanupStaleData: async (
      maxAge: number = 7 * 24 * 60 * 60 * 1000
   ): Promise<void> => {
      try {
         const cutoffTime = Date.now() - maxAge;

         // Check critical data timestamp
         const criticalTimestamp = await offlineStorage.retrieve<number>(
            OFFLINE_STORAGE_KEYS.CRITICAL_DATA_TIMESTAMP
         );

         if (criticalTimestamp && criticalTimestamp < cutoffTime) {
            await offlineStorage.remove(
               OFFLINE_STORAGE_KEYS.CRITICAL_POKEMON_DATA
            );
            await offlineStorage.remove(
               OFFLINE_STORAGE_KEYS.CRITICAL_DATA_TIMESTAMP
            );
            console.log("Cleaned up stale critical Pokemon data");
         }

         // Check app state timestamp
         const appState = await offlineUtils.getAppState();
         if (appState?.timestamp && appState.timestamp < cutoffTime) {
            await offlineStorage.remove(OFFLINE_STORAGE_KEYS.APP_STATE);
            console.log("Cleaned up stale app state");
         }
      } catch (error) {
         console.warn("Failed to cleanup stale data:", error);
      }
   },

   /**
    * Export all offline data for backup purposes
    * @returns Promise resolving to complete offline data backup
    */
   exportOfflineData: async (): Promise<Record<string, any>> => {
      try {
         const allKeys = Object.values(OFFLINE_STORAGE_KEYS);
         const results = await offlineStorage.batchRetrieve(allKeys);

         const exportData: Record<string, any> = {
            exportTimestamp: Date.now(),
            version: CACHE_CONFIG.VERSION,
         };

         results.forEach(([key, data]) => {
            if (data !== null) {
               exportData[key] = data;
            }
         });

         return exportData;
      } catch (error) {
         console.warn("Failed to export offline data:", error);
         return { exportTimestamp: Date.now(), version: CACHE_CONFIG.VERSION };
      }
   },

   /**
    * Import offline data from backup
    * @param backupData - Backup data to import
    * @param overwrite - Whether to overwrite existing data (default: false)
    */
   importOfflineData: async (
      backupData: Record<string, any>,
      overwrite: boolean = false
   ): Promise<void> => {
      try {
         const allowedKeys = Object.values(OFFLINE_STORAGE_KEYS);
         const entriesToImport: Array<[OfflineStorageKey, any]> = [];

         for (const key of allowedKeys) {
            if (key in backupData) {
               // Check if we should overwrite existing data
               if (overwrite || !(await offlineStorage.exists(key))) {
                  entriesToImport.push([key, backupData[key]]);
               }
            }
         }

         if (entriesToImport.length > 0) {
            await offlineStorage.batchStore(entriesToImport);
            console.log(
               `Imported ${entriesToImport.length} offline data entries`
            );
         }
      } catch (error) {
         console.warn("Failed to import offline data:", error);
         throw new Error("Offline data import failed");
      }
   },
};

export { asyncStoragePersister };

// Export additional types for external use
export type { StorageInfo, CriticalPokemonData, UserPreferences };
