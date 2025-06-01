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

      try {
         return await this.api.utility.getResourceByUrl(url);
      } catch (error) {
         throw new Error(`Failed to fetch resource: ${error}`);
      }
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
      if (!urls?.length) return [];
      if (urls.length > 20) {
         throw new Error("Maximum 20 URLs per batch");
      }

      const promises = urls.map(async (url) => {
         try {
            return await this.getResourceByUrl<T>(url);
         } catch (error) {
            console.warn(`Failed to fetch ${url}:`, error);
            return null;
         }
      });

      return Promise.all(promises);
   }

   // Get all pages from a paginated endpoint
   async getAllPages<T = ResourceReference>(
      initialUrl: string,
      maxPages: number = 20
   ): Promise<T[]> {
      if (!initialUrl?.trim()) {
         throw new Error("Initial URL is required");
      }

      const allResults: T[] = [];
      let currentUrl: string | null = initialUrl;
      let pageCount = 0;

      while (currentUrl && pageCount < maxPages) {
         try {
            const response: PaginatedResponse<T> = await this.getResourceByUrl<
               PaginatedResponse<T>
            >(currentUrl);

            if (response.results) {
               allResults.push(...response.results);
            }

            currentUrl = response.next;
            pageCount++;

            // Small delay to be nice to the API
            if (currentUrl) {
               await new Promise((resolve) => setTimeout(resolve, 100));
            }
         } catch (error) {
            console.error(`Error fetching page ${pageCount + 1}:`, error);
            break;
         }
      }

      return allResults;
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
      return {
         total: response.count,
         hasNext: !!response.next,
         hasPrevious: !!response.previous,
         currentResults: response.results.length,
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
         "super-contest-effect",
         "type",
         "version",
         "version-group",
      ];
   }
}
