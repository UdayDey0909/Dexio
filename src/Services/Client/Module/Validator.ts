import { BatchOperationOptions } from "../Types";

/**
 * A utility class providing validation methods for various data types and constraints.
 * Used throughout the application to ensure data integrity and prevent invalid operations.
 */
export class Validator {
   /** Maximum allowed Pokemon ID value */
   private static readonly MAX_POKEMON_ID = 1010;

   /**
    * Validates an identifier (string or number) according to specific rules.
    *
    * For strings:
    * - Cannot be null, undefined, or empty after trimming
    * - Maximum length of 50 characters
    *
    * For numbers:
    * - Must be an integer between 1 and MAX_POKEMON_ID (inclusive)
    *
    * @param identifier - The identifier to validate (string or number)
    * @param name - The name of the field being validated (used in error messages)
    * @throws {Error} When the identifier fails validation
    *
    * @example
    * ```typescript
    * Validator.validateIdentifier("pikachu", "Pokemon");
    * Validator.validateIdentifier(25, "Pokemon ID");
    * Validator.validateIdentifier("", "Pokemon"); // throws Error
    * ```
    */
   static validateIdentifier(identifier: string | number, name: string): void {
      if (identifier === null || identifier === undefined) {
         throw new Error(`${name} identifier cannot be null or undefined`);
      }

      if (typeof identifier === "string") {
         const trimmed = identifier.trim();
         if (trimmed.length === 0) {
            throw new Error(`${name} identifier cannot be empty`);
         }
         if (trimmed.length > 50) {
            throw new Error(`${name} identifier too long (max 50 characters)`);
         }
      }

      if (typeof identifier === "number") {
         if (
            identifier < 1 ||
            !Number.isInteger(identifier) ||
            identifier > this.MAX_POKEMON_ID
         ) {
            throw new Error(
               `${name} ID must be between 1 and ${this.MAX_POKEMON_ID}`
            );
         }
      }
   }

   /**
    * Validates pagination parameters for API requests.
    *
    * @param offset - The starting position for pagination (must be non-negative integer)
    * @param limit - The maximum number of items to return (must be between 1 and 100)
    * @throws {Error} When pagination parameters are invalid
    *
    * @example
    * ```typescript
    * Validator.validatePaginationParams(0, 20); // valid
    * Validator.validatePaginationParams(10, 50); // valid
    * Validator.validatePaginationParams(-1, 20); // throws Error
    * Validator.validatePaginationParams(0, 101); // throws Error
    * ```
    */
   static validatePaginationParams(offset: number, limit: number): void {
      if (!Number.isInteger(offset) || offset < 0) {
         throw new Error("Offset must be non-negative integer");
      }
      if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
         throw new Error("Limit must be between 1 and 100");
      }
   }

   /**
    * Validates an array for type, minimum length, and maximum length constraints.
    *
    * @template T - The type of elements in the array
    * @param array - The array to validate
    * @param name - The name of the field being validated (used in error messages)
    * @param minLength - Minimum required length (default: 1)
    * @param maxLength - Maximum allowed length (default: 20)
    * @throws {Error} When the array fails validation
    *
    * @example
    * ```typescript
    * Validator.validateArray([1, 2, 3], "Numbers"); // valid
    * Validator.validateArray([], "Items"); // throws Error (empty array)
    * Validator.validateArray([...Array(25)], "Items"); // throws Error (too many items)
    * Validator.validateArray(["a", "b"], "Letters", 2, 5); // valid with custom bounds
    * ```
    */
   static validateArray<T>(
      array: T[],
      name: string,
      minLength: number = 1,
      maxLength: number = 20
   ): void {
      if (!Array.isArray(array)) {
         throw new Error(`${name} must be an array`);
      }
      if (array.length < minLength) {
         throw new Error(`${name} must have at least ${minLength} items`);
      }
      if (array.length > maxLength) {
         throw new Error(`${name} cannot exceed ${maxLength} items`);
      }
   }

   /**
    * Validates batch operation options, specifically the concurrency setting.
    *
    * @param options - The batch operation options to validate
    * @throws {Error} When the concurrency value is outside the allowed range (1-10)
    *
    * @example
    * ```typescript
    * Validator.validateBatchOptions({ concurrency: 5 }); // valid
    * Validator.validateBatchOptions({ concurrency: 1 }); // valid
    * Validator.validateBatchOptions({ concurrency: 11 }); // throws Error
    * Validator.validateBatchOptions({}); // valid (no concurrency specified)
    * ```
    */
   static validateBatchOptions(options: BatchOperationOptions): void {
      if (
         options.concurrency &&
         (options.concurrency < 1 || options.concurrency > 10)
      ) {
         throw new Error("Concurrency must be between 1 and 10");
      }
   }
}
