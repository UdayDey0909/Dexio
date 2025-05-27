import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { CACHE_CONFIG } from "./Cache";
import { UserPreferences } from "./Types";

/**
 * Storage configuration constants
 * Key for React Query cache storage
 *
 */
export const CACHE_KEY = `pokemon-cache-${CACHE_CONFIG.VERSION}`;

/** Keys for other stored data in AsyncStorage */
const STORAGE_KEYS = {
   USER_PREFERENCES: "user_preferences",
} as const;

/**
 * AsyncStorage persister adapter for React Query cache,
 * configured with serialization, deserialization, and throttling.
 */
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

/**
 * Storage utility methods for AsyncStorage data management.
 */
export const storage = {
   /**
    * Store a generic object in AsyncStorage under the given key.
    * @template T
    * @param {string} key - The key to store the data under.
    * @param {T} data - The data object to serialize and store.
    * @returns {Promise<void>}
    * @throws Throws error if storing fails.
    */
   async store<T>(key: string, data: T): Promise<void> {
      try {
         const serializedData = JSON.stringify(data);
         await AsyncStorage.setItem(key, serializedData);
      } catch (error) {
         console.warn(`Failed to store data for key ${key}:`, error);
         throw new Error(`Storage failed for key: ${key}`);
      }
   },

   /**
    * Retrieve a generic object from AsyncStorage by key.
    * @template T
    * @param {string} key - The key to retrieve data from.
    * @returns {Promise<T | null>} Parsed object or null if not found/error.
    */
   async retrieve<T>(key: string): Promise<T | null> {
      try {
         const serializedData = await AsyncStorage.getItem(key);
         return serializedData ? JSON.parse(serializedData) : null;
      } catch (error) {
         console.warn(`Failed to retrieve data for key ${key}:`, error);
         return null;
      }
   },

   /**
    * Remove an item from AsyncStorage by key.
    * @param {string} key - The key to remove.
    * @returns {Promise<void>}
    */
   async remove(key: string): Promise<void> {
      try {
         await AsyncStorage.removeItem(key);
      } catch (error) {
         console.warn(`Failed to remove data for key ${key}:`, error);
      }
   },

   /**
    * Clear all AsyncStorage data.
    * @returns {Promise<void>}
    */
   async clear(): Promise<void> {
      try {
         await AsyncStorage.clear();
      } catch (error) {
         console.warn("Failed to clear storage:", error);
      }
   },

   /**
    * Store user preferences such as theme and language.
    * @param {UserPreferences} preferences - The user preferences to store.
    * @returns {Promise<void>}
    */
   async storeUserPreferences(preferences: UserPreferences): Promise<void> {
      await this.store(STORAGE_KEYS.USER_PREFERENCES, preferences);
   },

   /**
    * Retrieve stored user preferences.
    * Defaults to theme "auto" and language "en" if no preferences found.
    * @returns {Promise<UserPreferences>} The user preferences object.
    */
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
