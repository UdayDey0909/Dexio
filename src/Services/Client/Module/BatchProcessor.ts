import { BatchOperationOptions } from "../Types";
import { Validator } from "./Validator";

export class BatchProcessor {
   async processBatch<T, R>(
      items: T[],
      operation: (item: T, index: number) => Promise<R>,
      options: BatchOperationOptions = {}
   ): Promise<R[]> {
      const { concurrency = 10, onProgress, stopOnError = false } = options; // Increased default concurrency

      Validator.validateArray(items, "Items");
      Validator.validateBatchOptions(options);

      const results: R[] = [];
      let completed = 0;

      for (let i = 0; i < items.length; i += concurrency) {
         const batch = items.slice(i, i + concurrency);
         const batchPromises = batch.map((item, batchIndex) =>
            operation(item, i + batchIndex)
         );

         const batchResults = await Promise.allSettled(batchPromises);

         for (let j = 0; j < batchResults.length; j++) {
            const result = batchResults[j];
            const itemIndex = i + j;

            if (result.status === "fulfilled") {
               results.push(result.value);
            } else {
               console.error(
                  `Batch operation failed for item ${itemIndex}:`,
                  result.reason
               );

               if (stopOnError) {
                  throw new Error(
                     `Batch operation failed at item ${itemIndex}: ${result.reason}`
                  );
               }
            }

            completed++;
            onProgress?.(completed, items.length);
         }

         // Shorter delay between batches since no rate limiting
         if (i + concurrency < items.length) {
            await this.delay(50); // Reduced from 100ms to 50ms
         }
      }

      return results;
   }

   private async delay(ms: number): Promise<void> {
      return new Promise((resolve) => setTimeout(resolve, ms));
   }
}
