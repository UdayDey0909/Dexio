import { BatchOperationOptions } from "../Types";

export class Validator {
   static validateIdentifier(identifier: string | number, name: string): void {
      if (identifier === null || identifier === undefined) {
         throw new Error(`${name} identifier cannot be null or undefined`);
      }
      if (typeof identifier === "string") {
         const trimmed = identifier.trim();
         if (trimmed.length === 0) {
            throw new Error(`${name} identifier cannot be empty string`);
         }
         if (trimmed.length > 100) {
            throw new Error(`${name} identifier too long (max 100 characters)`);
         }
      }
      if (typeof identifier === "number") {
         if (
            identifier < 1 ||
            !Number.isInteger(identifier) ||
            identifier > 100000
         ) {
            throw new Error(
               `${name} identifier must be a positive integer between 1 and 100000`
            );
         }
      }
   }

   static validatePaginationParams(offset: number, limit: number): void {
      if (!Number.isInteger(offset) || offset < 0) {
         throw new Error("Offset must be a non-negative integer");
      }
      if (!Number.isInteger(limit) || limit < 1 || limit > 1000) {
         throw new Error("Limit must be between 1 and 1000");
      }
   }

   static validateArray<T>(
      array: T[],
      name: string,
      minLength: number = 1,
      maxLength: number = 500 // Increased from 100 to 500 since no rate limiting
   ): void {
      if (!Array.isArray(array)) {
         throw new Error(`${name} must be an array`);
      }
      if (array.length < minLength) {
         throw new Error(`${name} must have at least ${minLength} items`);
      }
      if (array.length > maxLength) {
         throw new Error(`${name} cannot have more than ${maxLength} items`);
      }
   }

   static validateBatchOptions(options: BatchOperationOptions): void {
      if (
         options.concurrency &&
         (options.concurrency < 1 || options.concurrency > 50) // Increased from 20 to 50
      ) {
         throw new Error("Concurrency must be between 1 and 50");
      }
   }
}
