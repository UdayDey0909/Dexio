import { BatchOperationOptions } from "../Types";

export class Validator {
   private static readonly MAX_POKEMON_ID = 1010;

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

   static validatePaginationParams(offset: number, limit: number): void {
      if (!Number.isInteger(offset) || offset < 0) {
         throw new Error("Offset must be non-negative integer");
      }
      if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
         throw new Error("Limit must be between 1 and 100");
      }
   }

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

   static validateBatchOptions(options: BatchOperationOptions): void {
      if (
         options.concurrency &&
         (options.concurrency < 1 || options.concurrency > 10)
      ) {
         throw new Error("Concurrency must be between 1 and 10");
      }
   }
}
