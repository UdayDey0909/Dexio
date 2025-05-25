import AsyncStorage from "@react-native-async-storage/async-storage";
import { queryClient, CACHE_CONFIG } from "../Cache";
import { CACHE_KEY } from "../Storage";

/**
 * Utilities related to cache versioning and migration.
 */
export const cacheMigration = {
   /**
    * Get the currently stored cache version from AsyncStorage.
    * @returns {Promise<string | null>} Current version string or null if none.
    */
   async getCurrentVersion(): Promise<string | null> {
      try {
         return await AsyncStorage.getItem("pokemon-cache-version");
      } catch (error) {
         console.warn("Failed to get cache version:", error);
         return null;
      }
   },

   /**
    * Store the current cache version in AsyncStorage.
    * @param {string} version - The version string to store.
    * @returns {Promise<void>}
    */
   async setVersion(version: string): Promise<void> {
      try {
         await AsyncStorage.setItem("pokemon-cache-version", version);
      } catch (error) {
         console.warn("Failed to set cache version:", error);
      }
   },

   /**
    * Check whether the cache data needs migration based on version mismatch.
    * @returns {Promise<boolean>} True if migration is needed.
    */
   async needsMigration(): Promise<boolean> {
      const currentVersion = await this.getCurrentVersion();
      return currentVersion !== CACHE_CONFIG.VERSION;
   },

   /**
    * Perform cache migration:
    * - Clear React Query cache
    * - Remove old cache keys except the current one
    * - Set new cache version
    * If migration fails, fallback by clearing all storage.
    * @returns {Promise<void>}
    */
   async migrate(): Promise<void> {
      if (await this.needsMigration()) {
         console.log("Performing cache migration...");

         try {
            // Clear React Query cache
            await queryClient.clear();

            // Remove old cache keys except current
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
