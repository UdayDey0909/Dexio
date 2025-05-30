import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CACHE_CONFIG, queryClient } from "./Cache";
import { UserPreferences } from "./Types";

/**
 * Storage keys
 */
export const CACHE_KEY = `pokemon-cache-${CACHE_CONFIG.VERSION}`;
const USER_PREFERENCES_KEY = "user_preferences";

/**
 * AsyncStorage persister for React Query - simplified configuration
 */
export const asyncStoragePersister = createAsyncStoragePersister({
   storage: AsyncStorage,
   key: CACHE_KEY,
   throttleTime: 1000,
});

/**
 * Simple storage utilities
 */
export const storage = {
   /**
    * Store any data
    */
   async store<T>(key: string, data: T): Promise<void> {
      try {
         await AsyncStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
         console.warn(`Failed to store data for key ${key}:`, error);
         throw new Error(`Storage failed for key: ${key}`);
      }
   },

   /**
    * Retrieve any data
    */
   async retrieve<T>(key: string): Promise<T | null> {
      try {
         const data = await AsyncStorage.getItem(key);
         return data ? JSON.parse(data) : null;
      } catch (error) {
         console.warn(`Failed to retrieve data for key ${key}:`, error);
         return null;
      }
   },

   /**
    * Remove data
    */
   async remove(key: string): Promise<void> {
      try {
         await AsyncStorage.removeItem(key);
      } catch (error) {
         console.warn(`Failed to remove data for key ${key}:`, error);
      }
   },

   /**
    * Clear all storage
    */
   async clear(): Promise<void> {
      try {
         await AsyncStorage.clear();
      } catch (error) {
         console.warn("Failed to clear storage:", error);
      }
   },

   /**
    * User preferences helpers
    */
   async storeUserPreferences(preferences: UserPreferences): Promise<void> {
      await this.store(USER_PREFERENCES_KEY, preferences);
   },

   async getUserPreferences(): Promise<UserPreferences> {
      const preferences = await this.retrieve<UserPreferences>(
         USER_PREFERENCES_KEY
      );
      return {
         theme: "auto",
         language: "en",
         ...preferences,
      };
   },
};

/**
 * Simple cache migration utilities
 */
export const cacheMigration = {
   /**
    * Check if migration is needed
    */
   async needsMigration(): Promise<boolean> {
      try {
         const version = await AsyncStorage.getItem("pokemon-cache-version");
         return version !== CACHE_CONFIG.VERSION;
      } catch {
         return true; // Assume migration needed if we can't read version
      }
   },

   /**
    * Simple migration - just clear old cache and set new version
    */
   async migrate(): Promise<void> {
      if (await this.needsMigration()) {
         console.log("Migrating cache to version", CACHE_CONFIG.VERSION);

         try {
            // Clear React Query cache
            await queryClient.clear();

            // Remove old cache keys
            const allKeys = await AsyncStorage.getAllKeys();
            const oldCacheKeys = allKeys.filter(
               (key) => key.startsWith("pokemon-cache") && key !== CACHE_KEY
            );

            if (oldCacheKeys.length > 0) {
               await AsyncStorage.multiRemove(oldCacheKeys);
            }

            // Set new version
            await AsyncStorage.setItem(
               "pokemon-cache-version",
               CACHE_CONFIG.VERSION
            );
            console.log("Cache migration completed");
         } catch (error) {
            console.error("Cache migration failed, clearing all:", error);
            // Fallback: clear everything
            await AsyncStorage.clear();
            await AsyncStorage.setItem(
               "pokemon-cache-version",
               CACHE_CONFIG.VERSION
            );
         }
      }
   },
};
