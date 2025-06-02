export interface PokemonError {
   message: string;
   isRetryable: boolean;
   userMessage: string;
}

export class ErrorHandler {
   static handle(error: unknown, context?: string): PokemonError {
      const message = error instanceof Error ? error.message : String(error);
      const lowerMessage = message.toLowerCase();

      // Network errors - retryable
      if (
         lowerMessage.includes("network") ||
         lowerMessage.includes("connection") ||
         lowerMessage.includes("timeout")
      ) {
         return {
            message,
            isRetryable: true,
            userMessage: "Connection issue. Please try again.",
         };
      }

      // 404 errors - not retryable
      if (lowerMessage.includes("404") || lowerMessage.includes("not found")) {
         return {
            message,
            isRetryable: false,
            userMessage: "Pokemon not found. Check the name or ID.",
         };
      }

      // Rate limit - retryable
      if (lowerMessage.includes("429") || lowerMessage.includes("rate limit")) {
         return {
            message,
            isRetryable: true,
            userMessage: "Too many requests. Please wait and try again.",
         };
      }

      // Default error
      return {
         message,
         isRetryable: false,
         userMessage: "Something went wrong. Please try again.",
      };
   }
}
