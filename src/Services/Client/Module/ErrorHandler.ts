import { BaseService } from "./../MainClient";

export enum ErrorType {
   NETWORK = "NETWORK",
   RATE_LIMIT = "RATE_LIMIT",
   NOT_FOUND = "NOT_FOUND",
   VALIDATION = "VALIDATION",
   UNKNOWN = "UNKNOWN",
}

export interface PokemonError {
   type: ErrorType;
   message: string;
   originalError?: Error;
   retryable: boolean;
   userMessage: string;
   timestamp: number;
}

export class ErrorHandler {
   static createError(
      error: unknown,
      context: string = "API call"
   ): PokemonError {
      const timestamp = Date.now();

      if (error instanceof Error) {
         const errorMessage = error.message.toLowerCase();

         // Network errors
         if (this.isNetworkError(errorMessage)) {
            return {
               type: ErrorType.NETWORK,
               message: error.message,
               originalError: error,
               retryable: true,
               userMessage:
                  "Connection issue. Please check your internet and try again.",
               timestamp,
            };
         }

         // Rate limit errors
         if (this.isRateLimitError(errorMessage)) {
            return {
               type: ErrorType.RATE_LIMIT,
               message: error.message,
               originalError: error,
               retryable: true,
               userMessage:
                  "Too many requests. Please wait a moment and try again.",
               timestamp,
            };
         }

         // Not found errors
         if (this.isNotFoundError(errorMessage)) {
            return {
               type: ErrorType.NOT_FOUND,
               message: error.message,
               originalError: error,
               retryable: false,
               userMessage: "Pokemon not found. Please check the name or ID.",
               timestamp,
            };
         }

         // Validation errors
         if (this.isValidationError(errorMessage)) {
            return {
               type: ErrorType.VALIDATION,
               message: error.message,
               originalError: error,
               retryable: false,
               userMessage: "Invalid input. Please check your search terms.",
               timestamp,
            };
         }
      }

      // Unknown error
      return {
         type: ErrorType.UNKNOWN,
         message: String(error),
         originalError: error instanceof Error ? error : undefined,
         retryable: false,
         userMessage: "Something went wrong. Please try again later.",
         timestamp,
      };
   }

   private static isNetworkError(message: string): boolean {
      const networkKeywords = [
         "network",
         "connection",
         "timeout",
         "offline",
         "econnreset",
         "etimedout",
      ];
      return networkKeywords.some((keyword) => message.includes(keyword));
   }

   private static isRateLimitError(message: string): boolean {
      return message.includes("rate limit") || message.includes("429");
   }

   private static isNotFoundError(message: string): boolean {
      return message.includes("404") || message.includes("not found");
   }

   private static isValidationError(message: string): boolean {
      const validationKeywords = [
         "identifier cannot be",
         "must be",
         "invalid",
         "validation",
      ];
      return validationKeywords.some((keyword) => message.includes(keyword));
   }
}

// Usage in services
export class PokemonService extends BaseService {
   async getPokemon(identifier: string | number) {
      try {
         return await this.executeWithErrorHandling(async () => {
            return typeof identifier === "string"
               ? await this.api.pokemon.getPokemonByName(
                    identifier.toLowerCase().trim()
                 )
               : await this.api.pokemon.getPokemonById(identifier);
         }, `Failed to fetch pokemon: ${identifier}`);
      } catch (error) {
         const pokemonError = ErrorHandler.createError(error, "getPokemon");

         // Log for debugging
         console.error("Pokemon fetch error:", pokemonError);

         // You can emit this to a global error handler for toast notifications
         // EventEmitter.emit('pokemon-error', pokemonError);

         throw pokemonError;
      }
   }
}
