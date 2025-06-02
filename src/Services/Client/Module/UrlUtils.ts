export class UrlUtils {
   private static readonly BASE_URL = "https://pokeapi.co/api/v2";

   static extractIdFromUrl(url: string): number | null {
      if (!url || typeof url !== "string") return null;

      const patterns = [
         /\/(\d+)\/$/, // Standard: /123/
         /\/(\d+)$/, // Without trailing slash: /123
         /\/(\d+)\?/, // With query params: /123?param=value
         /\/(\d+)#/, // With fragment: /123#section
      ];

      for (const pattern of patterns) {
         const match = url.match(pattern);
         if (match) {
            return parseInt(match[1], 10);
         }
      }

      return null;
   }

   static extractNameFromUrl(url: string): string | null {
      if (!url || typeof url !== "string") return null;

      try {
         const urlObj = new URL(url);
         const pathParts = urlObj.pathname
            .split("/")
            .filter((part) => part.length > 0);
         return pathParts.length >= 2 ? pathParts[pathParts.length - 1] : null;
      } catch {
         const parts = url.split("/").filter((part) => part.length > 0);
         return parts.length >= 1 ? parts[parts.length - 1] : null;
      }
   }

   static buildApiUrl(endpoint: string, identifier?: string | number): string {
      const cleanEndpoint = endpoint.replace(/^\/+|\/+$/g, "");

      if (identifier !== undefined && identifier !== null) {
         const cleanId =
            typeof identifier === "string"
               ? identifier.trim().toLowerCase()
               : identifier;
         return `${this.BASE_URL}/${cleanEndpoint}/${cleanId}/`;
      }

      return `${this.BASE_URL}/${cleanEndpoint}/`;
   }

   static isValidApiUrl(url: string): boolean {
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
}
