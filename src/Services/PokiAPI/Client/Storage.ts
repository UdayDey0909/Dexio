// src/services/pokemon-api/client/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { queryClient, CACHE_CONFIG } from "./Cache";

export interface UserPreferences {
   theme?: "light" | "dark" | "auto";
   language?: string;
}

// Storage configuration
const CACHE_KEY = `pokemon-cache-${CACHE_CONFIG.VERSION}`;
const STORAGE_KEYS = {
   USER_PREFERENCES: "user_preferences",
} as const;

// AsyncStorage persister for React Query
export const asyncStoragePersister = createAsyncStoragePersister({
   storage: AsyncStorage,
   key: CACHE_KEY,
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
   throttleTime: 1000,
});

// Storage utilities
export const storage = {
   // Generic storage methods
   async store<T>(key: string, data: T): Promise<void> {
      try {
         const serializedData = JSON.stringify(data);
         await AsyncStorage.setItem(key, serializedData);
      } catch (error) {
         console.warn(`Failed to store data for key ${key}:`, error);
         throw new Error(`Storage failed for key: ${key}`);
      }
   },

   async retrieve<T>(key: string): Promise<T | null> {
      try {
         const serializedData = await AsyncStorage.getItem(key);
         return serializedData ? JSON.parse(serializedData) : null;
      } catch (error) {
         console.warn(`Failed to retrieve data for key ${key}:`, error);
         return null;
      }
   },

   async remove(key: string): Promise<void> {
      try {
         await AsyncStorage.removeItem(key);
      } catch (error) {
         console.warn(`Failed to remove data for key ${key}:`, error);
      }
   },

   async clear(): Promise<void> {
      try {
         await AsyncStorage.clear();
      } catch (error) {
         console.warn("Failed to clear storage:", error);
      }
   },

   // User preferences
   async storeUserPreferences(preferences: UserPreferences): Promise<void> {
      await this.store(STORAGE_KEYS.USER_PREFERENCES, preferences);
   },

   async getUserPreferences(): Promise<UserPreferences> {
      const preferences = await this.retrieve<UserPreferences>(
         STORAGE_KEYS.USER_PREFERENCES
      );

      return {
         theme: "auto",
         language: "en",
         ...preferences,
      };
   },
};

// Cache migration utilities
export const cacheMigration = {
   async getCurrentVersion(): Promise<string | null> {
      try {
         return await AsyncStorage.getItem("pokemon-cache-version");
      } catch (error) {
         console.warn("Failed to get cache version:", error);
         return null;
      }
   },

   async setVersion(version: string): Promise<void> {
      try {
         await AsyncStorage.setItem("pokemon-cache-version", version);
      } catch (error) {
         console.warn("Failed to set cache version:", error);
      }
   },

   async needsMigration(): Promise<boolean> {
      const currentVersion = await this.getCurrentVersion();
      return currentVersion !== CACHE_CONFIG.VERSION;
   },

   async migrate(): Promise<void> {
      if (await this.needsMigration()) {
         console.log("Performing cache migration...");

         try {
            // Clear React Query cache
            await queryClient.clear();

            // Clear old cache data
            const allKeys = await AsyncStorage.getAllKeys();
            const cacheKeys = allKeys.filter(
               (key) => key.startsWith("pokemon-cache") && key !== CACHE_KEY
            );

            if (cacheKeys.length > 0) {
               await AsyncStorage.multiRemove(cacheKeys);
               console.log(`Removed ${cacheKeys.length} old cache keys`);
            }

            // Set new version
            await this.setVersion(CACHE_CONFIG.VERSION);
            console.log(
               `Cache migration completed to version ${CACHE_CONFIG.VERSION}`
            );
         } catch (error) {
            console.error("Cache migration failed:", error);
            // Fallback: clear everything
            await AsyncStorage.clear();
            await this.setVersion(CACHE_CONFIG.VERSION);
         }
      }
   },
};
