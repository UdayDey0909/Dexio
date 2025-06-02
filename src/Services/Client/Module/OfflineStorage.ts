import { BaseService } from "../MainClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface StorageItem<T> {
   data: T;
   timestamp: number;
   ttl: number;
}

export class OfflineStorage {
   private static readonly PREFIX = "pokemon_cache_";
   private static readonly MAX_STORAGE_SIZE = 50 * 1024 * 1024; // 50MB

   static async store<T>(
      key: string,
      data: T,
      ttl: number = 300000
   ): Promise<void> {
      try {
         const item: StorageItem<T> = {
            data,
            timestamp: Date.now(),
            ttl,
         };

         const serialized = JSON.stringify(item);

         // Check storage size before storing
         if (await this.checkStorageSize(serialized.length)) {
            await AsyncStorage.setItem(this.PREFIX + key, serialized);
         }
      } catch (error) {
         console.warn("Failed to store offline data:", error);
      }
   }

   static async retrieve<T>(key: string): Promise<T | null> {
      try {
         const stored = await AsyncStorage.getItem(this.PREFIX + key);
         if (!stored) return null;

         const item: StorageItem<T> = JSON.parse(stored);

         // Check if expired
         if (Date.now() - item.timestamp > item.ttl) {
            await this.remove(key);
            return null;
         }

         return item.data;
      } catch (error) {
         console.warn("Failed to retrieve offline data:", error);
         return null;
      }
   }

   static async remove(key: string): Promise<void> {
      try {
         await AsyncStorage.removeItem(this.PREFIX + key);
      } catch (error) {
         console.warn("Failed to remove offline data:", error);
      }
   }

   static async clear(): Promise<void> {
      try {
         const keys = await AsyncStorage.getAllKeys();
         const pokemonKeys = keys.filter((key) => key.startsWith(this.PREFIX));
         await AsyncStorage.multiRemove(pokemonKeys);
      } catch (error) {
         console.warn("Failed to clear offline storage:", error);
      }
   }

   private static async checkStorageSize(
      newDataSize: number
   ): Promise<boolean> {
      try {
         const keys = await AsyncStorage.getAllKeys();
         const items = await AsyncStorage.multiGet(keys);

         const currentSize = items.reduce(
            (size, [, value]) => size + (value?.length || 0),
            0
         );

         if (currentSize + newDataSize > this.MAX_STORAGE_SIZE) {
            // Remove oldest items
            await this.cleanupOldestItems(0.2); // Remove 20% of items
            return true;
         }

         return true;
      } catch (error) {
         console.warn("Storage size check failed:", error);
         return false;
      }
   }

   private static async cleanupOldestItems(percentage: number): Promise<void> {
      try {
         const keys = await AsyncStorage.getAllKeys();
         const pokemonKeys = keys.filter((key) => key.startsWith(this.PREFIX));

         const items = await AsyncStorage.multiGet(pokemonKeys);
         const parsedItems = items
            .map(([key, value]) => ({
               key,
               timestamp: value ? JSON.parse(value).timestamp : 0,
            }))
            .sort((a, b) => a.timestamp - b.timestamp);

         const itemsToRemove = Math.floor(parsedItems.length * percentage);
         const keysToRemove = parsedItems
            .slice(0, itemsToRemove)
            .map((item) => item.key);

         await AsyncStorage.multiRemove(keysToRemove);
      } catch (error) {
         console.warn("Cleanup failed:", error);
      }
   }
}

// Enhanced BaseService with offline support
export class OfflineAwareBaseService extends BaseService {
   protected async executeWithOfflineSupport<T>(
      operation: () => Promise<T>,
      cacheKey: string,
      errorMessage: string
   ): Promise<T> {
      try {
         // Try online first
         const result = await this.executeWithErrorHandling(
            operation,
            errorMessage
         );

         // Store for offline use
         await OfflineStorage.store(cacheKey, result);

         return result;
      } catch (error) {
         // Fallback to offline data
         const cached = await OfflineStorage.retrieve<T>(cacheKey);
         if (cached) {
            console.log(`Using offline data for ${cacheKey}`);
            return cached;
         }

         throw error;
      }
   }
}
