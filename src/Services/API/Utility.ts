import { BaseService } from "../Client";

interface PaginatedResponse<T> {
   count: number;
   next: string | null;
   previous: string | null;
   results: T[];
}

interface ResourceReference {
   name: string;
   url: string;
}

export class UtilityService extends BaseService {
   // Fetch any resource by URL
   async getResourceByUrl<T = any>(url: string): Promise<T> {
      if (!url?.trim()) {
         throw new Error("URL is required");
      }

      if (!this.isValidUrl(url)) {
         throw new Error("Invalid PokéAPI URL provided");
      }

      return this.executeWithErrorHandling(
         async () => await this.api.utility.getResourceByUrl(url),
         `Failed to fetch resource from URL: ${url}`
      );
   }

   // Extract ID from PokéAPI URL (e.g., "https://pokeapi.co/api/v2/pokemon/25/" -> 25)
   extractIdFromUrl(url: string): number | null {
      if (!url) return null;

      const match = url.match(/\/(\d+)\/?$/);
      return match ? parseInt(match[1], 10) : null;
   }

   // Extract name from PokéAPI URL (e.g., "https://pokeapi.co/api/v2/pokemon/pikachu/" -> "pikachu")
   extractNameFromUrl(url: string): string | null {
      if (!url) return null;

      const parts = url.split("/").filter((part) => part.length > 0);
      return parts.length >= 2 ? parts[parts.length - 1] : null;
   }

   // Batch fetch multiple resources (max 20 at once)
   async batchGetResources<T = any>(urls: string[]): Promise<(T | null)[]> {
      if (!Array.isArray(urls) || urls.length === 0) {
         throw new Error("URLs array cannot be empty");
      }

      if (urls.length > 20) {
         throw new Error("Maximum 20 URLs per batch");
      }

      // Validate all URLs first
      urls.forEach((url, index) => {
         if (!this.isValidUrl(url)) {
            throw new Error(`Invalid URL at index ${index}: ${url}`);
         }
      });

      return this.batchOperation(
         urls,
         async (url) => await this.getResourceByUrl<T>(url),
         3
      );
   }

   // Get all pages from a paginated endpoint
   async getAllPages<T = ResourceReference>(
      initialUrl: string,
      maxPages: number = 20
   ): Promise<T[]> {
      if (!initialUrl?.trim()) {
         throw new Error("Initial URL is required");
      }

      if (!this.isValidUrl(initialUrl)) {
         throw new Error("Invalid initial URL provided");
      }

      if (maxPages < 1 || maxPages > 50) {
         throw new Error("Max pages must be between 1 and 50");
      }

      return this.executeWithErrorHandling(async () => {
         const allResults: T[] = [];
         let currentUrl: string | null = initialUrl;
         let pageCount = 0;

         while (currentUrl && pageCount < maxPages) {
            const response: PaginatedResponse<T> =
               await this.api.utility.getResourceByUrl(currentUrl);

            if (response.results) {
               allResults.push(...response.results);
            }

            currentUrl = response.next;
            pageCount++;

            // Small delay to be nice to the API
            if (currentUrl && pageCount < maxPages) {
               await new Promise((resolve) => setTimeout(resolve, 100));
            }
         }

         return allResults;
      }, `Failed to fetch all pages from: ${initialUrl}`);
   }

   // Build PokéAPI URL (e.g., buildUrl('pokemon', 'pikachu') -> "https://pokeapi.co/api/v2/pokemon/pikachu/")
   buildUrl(endpoint: string, identifier?: string | number): string {
      if (!endpoint?.trim()) {
         throw new Error("Endpoint is required");
      }

      const baseUrl = "https://pokeapi.co/api/v2";
      const cleanEndpoint = endpoint.replace(/^\/+|\/+$/g, "");

      if (identifier !== undefined && identifier !== null) {
         const cleanId =
            typeof identifier === "string"
               ? identifier.trim().toLowerCase()
               : identifier;
         return `${baseUrl}/${cleanEndpoint}/${cleanId}/`;
      }

      return `${baseUrl}/${cleanEndpoint}/`;
   }

   // Check if URL is valid PokéAPI URL
   isValidUrl(url: string): boolean {
      if (!url) return false;

      try {
         const urlObj = new URL(url);
         return (
            urlObj.hostname === "pokeapi.co" &&
            urlObj.pathname.startsWith("/api/v2/")
         );
      } catch {
         return false;
      }
   }

   // Get pagination helpers
   getNextUrl(response: { next: string | null }): string | null {
      return response?.next || null;
   }

   getPreviousUrl(response: { previous: string | null }): string | null {
      return response?.previous || null;
   }

   // Get endpoint name from URL (e.g., "https://pokeapi.co/api/v2/pokemon/25/" -> "pokemon")
   getEndpointFromUrl(url: string): string | null {
      if (!this.isValidUrl(url)) return null;

      try {
         const urlObj = new URL(url);
         const pathParts = urlObj.pathname
            .replace("/api/v2/", "")
            .split("/")
            .filter((part) => part.length > 0);

         return pathParts[0] || null;
      } catch {
         return null;
      }
   }

   // Get basic pagination info
   getPaginationInfo<T>(response: PaginatedResponse<T>) {
      if (!response) {
         throw new Error("Response is required");
      }

      return {
         total: response.count || 0,
         hasNext: !!response.next,
         hasPrevious: !!response.previous,
         currentResults: response.results?.length || 0,
         nextUrl: response.next,
         previousUrl: response.previous,
      };
   }

   // Get resource info from URL
   getResourceInfo(url: string) {
      if (!this.isValidUrl(url)) {
         throw new Error("Invalid PokéAPI URL");
      }

      return {
         endpoint: this.getEndpointFromUrl(url),
         id: this.extractIdFromUrl(url),
         name: this.extractNameFromUrl(url),
         isValid: true,
      };
   }

   // Common endpoints list
   getEndpoints(): string[] {
      return [
         "ability",
         "berry",
         "berry-firmness",
         "berry-flavor",
         "characteristic",
         "contest-type",
         "contest-effect",
         "super-contest-effect",
         "encounter-method",
         "encounter-condition",
         "encounter-condition-value",
         "evolution-chain",
         "evolution-trigger",
         "generation",
         "gender",
         "growth-rate",
         "item",
         "item-attribute",
         "item-category",
         "item-fling-effect",
         "item-pocket",
         "language",
         "location",
         "location-area",
         "machine",
         "move",
         "move-ailment",
         "move-battle-style",
         "move-category",
         "move-damage-class",
         "move-learn-method",
         "move-target",
         "nature",
         "pal-park-area",
         "pokemon",
         "pokemon-color",
         "pokemon-form",
         "pokemon-habitat",
         "pokemon-shape",
         "pokemon-species",
         "pokedex",
         "region",
         "stat",
         "type",
         "version",
         "version-group",
      ];
   }

   // Validate endpoint
   isValidEndpoint(endpoint: string): boolean {
      return this.getEndpoints().includes(endpoint.toLowerCase());
   }

   // Get random resource from endpoint
   async getRandomResource<T = any>(endpoint: string): Promise<T> {
      if (!this.isValidEndpoint(endpoint)) {
         throw new Error(`Invalid endpoint: ${endpoint}`);
      }

      return this.executeWithErrorHandling(async () => {
         // Get list to find count
         const listUrl = this.buildUrl(endpoint);
         const list: PaginatedResponse<ResourceReference> =
            await this.api.utility.getResourceByUrl(listUrl);

         if (!list.count || list.count === 0) {
            throw new Error(`No resources found for endpoint: ${endpoint}`);
         }

         // Get random ID (1-based indexing)
         const randomId = Math.floor(Math.random() * list.count) + 1;
         const resourceUrl = this.buildUrl(endpoint, randomId);

         return await this.api.utility.getResourceByUrl<T>(resourceUrl);
      }, `Failed to get random resource from endpoint: ${endpoint}`);
   }
}
