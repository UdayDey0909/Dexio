// __tests__/Services/Client/Module/ErrorHandler.test.ts
import {
   ErrorHandler,
   PokemonError,
} from "@/Services/Client/Module/ErrorHandler";

describe("ErrorHandler", () => {
   describe("handle", () => {
      describe("Network errors", () => {
         const networkErrors = [
            "Network error occurred",
            "CONNECTION_FAILED",
            "Request timeout",
            "Fetch failed",
         ];

         networkErrors.forEach((errorMessage) => {
            it(`should handle network error: "${errorMessage}"`, () => {
               const error = new Error(errorMessage);
               const result = ErrorHandler.handle(error);

               expect(result).toEqual({
                  message: errorMessage,
                  isRetryable: true,
                  userMessage: "Connection issue. Please try again.",
               });
            });
         });

         it("should handle network errors case-insensitively", () => {
            const error = new Error("NETWORK ERROR");
            const result = ErrorHandler.handle(error);

            expect(result.isRetryable).toBe(true);
            expect(result.userMessage).toBe(
               "Connection issue. Please try again."
            );
         });
      });

      describe("404 errors", () => {
         const notFoundErrors = [
            "404 Not Found",
            "Resource not found",
            "Pokemon not found",
            "NOT FOUND",
         ];

         notFoundErrors.forEach((errorMessage) => {
            it(`should handle 404 error: "${errorMessage}"`, () => {
               const error = new Error(errorMessage);
               const result = ErrorHandler.handle(error);

               expect(result).toEqual({
                  message: errorMessage,
                  isRetryable: false,
                  userMessage: "Pokemon not found. Check the name or ID.",
               });
            });
         });
      });

      describe("Rate limit errors", () => {
         const rateLimitErrors = [
            "429 Too Many Requests",
            "Rate limit exceeded",
            "RATE LIMIT",
         ];

         rateLimitErrors.forEach((errorMessage) => {
            it(`should handle rate limit error: "${errorMessage}"`, () => {
               const error = new Error(errorMessage);
               const result = ErrorHandler.handle(error);

               expect(result).toEqual({
                  message: errorMessage,
                  isRetryable: true,
                  userMessage: "Too many requests. Please wait and try again.",
               });
            });
         });
      });

      describe("Server errors", () => {
         const serverErrors = [
            "500 Internal Server Error",
            "502 Bad Gateway",
            "503 Service Unavailable",
         ];

         serverErrors.forEach((errorMessage) => {
            it(`should handle server error: "${errorMessage}"`, () => {
               const error = new Error(errorMessage);
               const result = ErrorHandler.handle(error);

               expect(result).toEqual({
                  message: errorMessage,
                  isRetryable: true,
                  userMessage:
                     "Server temporarily unavailable. Please try again.",
               });
            });
         });
      });

      describe("Default errors", () => {
         it("should handle unknown error without context", () => {
            const error = new Error("Unknown error");
            const result = ErrorHandler.handle(error);

            expect(result).toEqual({
               message: "Unknown error",
               isRetryable: false,
               userMessage: "Something went wrong. Please try again.",
            });
         });

         it("should handle unknown error with context", () => {
            const error = new Error("Unknown error");
            const context = "Fetching Pokemon data";
            const result = ErrorHandler.handle(error, context);

            expect(result).toEqual({
               message: "Unknown error",
               isRetryable: false,
               userMessage: "Fetching Pokemon data: Something went wrong.",
            });
         });

         it("should handle non-Error objects", () => {
            const error = "String error";
            const result = ErrorHandler.handle(error);

            expect(result).toEqual({
               message: "String error",
               isRetryable: false,
               userMessage: "Something went wrong. Please try again.",
            });
         });

         it("should handle null/undefined errors", () => {
            const result = ErrorHandler.handle(null);

            expect(result).toEqual({
               message: "null",
               isRetryable: false,
               userMessage: "Something went wrong. Please try again.",
            });
         });

         it("should handle object errors", () => {
            const error = {
               code: "CUSTOM_ERROR",
               message: "Custom error occurred",
            };
            const result = ErrorHandler.handle(error);

            expect(result.message).toBe("[object Object]");
            expect(result.isRetryable).toBe(false);
         });
      });

      describe("Priority handling", () => {
         it("should prioritize network errors over 404", () => {
            const error = new Error("Network 404 not found");
            const result = ErrorHandler.handle(error);

            // Should be treated as network error since "network" appears first
            expect(result.isRetryable).toBe(true);
            expect(result.userMessage).toBe(
               "Connection issue. Please try again."
            );
         });

         it("should handle multiple error indicators", () => {
            const error = new Error("Network timeout 429 rate limit");
            const result = ErrorHandler.handle(error);

            // Should be treated as network error since it appears first in the logic
            expect(result.isRetryable).toBe(true);
            expect(result.userMessage).toBe(
               "Connection issue. Please try again."
            );
         });
      });

      describe("Case sensitivity", () => {
         it("should handle mixed case errors", () => {
            const testCases = [
               {
                  input: "Network Error",
                  expected: "Connection issue. Please try again.",
               },
               {
                  input: "Not Found",
                  expected: "Pokemon not found. Check the name or ID.",
               },
               {
                  input: "Rate Limit",
                  expected: "Too many requests. Please wait and try again.",
               },
               {
                  input: "500 Server Error",
                  expected: "Server temporarily unavailable. Please try again.",
               },
            ];

            testCases.forEach(({ input, expected }) => {
               const result = ErrorHandler.handle(new Error(input));
               expect(result.userMessage).toBe(expected);
            });
         });
      });

      describe("Edge cases", () => {
         it("should handle empty error message", () => {
            const error = new Error("");
            const result = ErrorHandler.handle(error);

            expect(result.message).toBe("");
            expect(result.isRetryable).toBe(false);
            expect(result.userMessage).toBe(
               "Something went wrong. Please try again."
            );
         });

         it("should handle error with only whitespace", () => {
            const error = new Error("   ");
            const result = ErrorHandler.handle(error);

            expect(result.message).toBe("   ");
            expect(result.isRetryable).toBe(false);
         });

         it("should handle very long error messages", () => {
            const longMessage = "network ".repeat(100) + "error";
            const error = new Error(longMessage);
            const result = ErrorHandler.handle(error);

            expect(result.isRetryable).toBe(true);
            expect(result.message).toBe(longMessage);
         });
      });
   });
});
