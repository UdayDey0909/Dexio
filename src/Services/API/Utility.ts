import { BaseService } from "../Client";

export class UtilityService extends BaseService {
   // Generic resource fetcher by URL
   async getResourceByUrl<T = any>(url: string): Promise<T> {
      try {
         return await this.api.utility.getResourceByUrl(url);
      } catch (error) {
         throw new Error(`Failed to fetch resource from URL ${url}: ${error}`);
      }
   }

   // Get resource list by URL (for pagination)
   async getResourceListByUrl<T = any>(url: string) {
      try {
         return await this.api.utility.getResourceByUrl(url);
      } catch (error) {
         throw new Error(
            `Failed to fetch resource list from URL ${url}: ${error}`
         );
      }
   }

   // Extract ID from PokéAPI URL
   extractIdFromUrl(url: string): number | null {
      const match = url.match(/\/(\d+)\/$/);
      return match ? parseInt(match[1], 10) : null;
   }

   // Extract name from PokéAPI URL
   extractNameFromUrl(url: string): string | null {
      const parts = url.split("/");
      return parts[parts.length - 2] || null;
   }

   // Batch fetch resources by URLs
   async batchGetResourcesByUrl<T = any>(urls: string[]): Promise<T[]> {
      const promises = urls.map((url) => this.getResourceByUrl<T>(url));
      return await Promise.all(promises);
   }

   // Helper to get next/previous page URLs from API responses
   getNextPageUrl(apiResponse: { next: string | null }): string | null {
      return apiResponse.next;
   }

   getPreviousPageUrl(apiResponse: { previous: string | null }): string | null {
      return apiResponse.previous;
   }

   // Fetch all pages of a paginated resource
   async getAllPages<T = any>(
      initialUrl: string,
      maxPages: number = 100
   ): Promise<T[]> {
      const allResults: T[] = [];
      let currentUrl: string | null = initialUrl;
      let pageCount = 0;

      while (currentUrl && pageCount < maxPages) {
         try {
            const response: {
               results: T[];
               next: string | null;
               previous: string | null;
            } = await this.getResourceByUrl<{
               results: T[];
               next: string | null;
               previous: string | null;
            }>(currentUrl);

            allResults.push(...response.results);
            currentUrl = response.next;
            pageCount++;
         } catch (error) {
            console.error(`Error fetching page ${pageCount + 1}:`, error);
            break;
         }
      }

      return allResults;
   }

   // Helper to build API URLs
   buildApiUrl(endpoint: string, identifier?: string | number): string {
      const baseUrl = "https://pokeapi.co/api/v2";
      if (identifier) {
         return `${baseUrl}/${endpoint}/${identifier}/`;
      }
      return `${baseUrl}/${endpoint}/`;
   }

   // Validate if URL is a valid PokéAPI URL
   isValidPokeApiUrl(url: string): boolean {
      return url.startsWith("https://pokeapi.co/api/v2/");
   }

   // Get API endpoint from URL
   getEndpointFromUrl(url: string): string | null {
      if (!this.isValidPokeApiUrl(url)) return null;

      const path = url.replace("https://pokeapi.co/api/v2/", "");
      const endpoint = path.split("/")[0];
      return endpoint || null;
   }
}
