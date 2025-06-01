import { MainClient } from "pokenode-ts";

export class BaseService {
   protected api: MainClient;

   constructor() {
      this.api = new MainClient({
         cacheOptions: {
            ttl: 10 * 60 * 1000, // 10 minutes cache
         },
      });
   }

   protected extractIdFromUrl(url: string): number | null {
      const match = url.match(/\/(\d+)\/$/);
      return match ? parseInt(match[1], 10) : null;
   }

   clearCache() {
      console.log("Cache cleared by reinitializing service");
      this.api = new MainClient({
         cacheOptions: {
            ttl: 10 * 60 * 1000,
         },
      });
   }

   getCacheInfo() {
      return {
         ttl: "10 minutes",
         maxItems: 500,
         logLevel:
            typeof __DEV__ !== "undefined" && __DEV__ ? "debug" : "error",
      };
   }
}
