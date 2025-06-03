import { RetryManager } from "@/Services/Client/Module/RetryManager";
import { ErrorHandler } from "@/Services/Client/Module/ErrorHandler";

jest.mock("@/Services/Client/Module/ErrorHandler");

describe("RetryManager", () => {
   let retryManager: RetryManager;
   let mockErrorHandler: jest.Mocked<typeof ErrorHandler>;

   beforeEach(() => {
      jest.clearAllMocks();
      mockErrorHandler = ErrorHandler as jest.Mocked<typeof ErrorHandler>;
      retryManager = new RetryManager(3, 1000);
   });

   afterEach(() => {
      jest.clearAllTimers();
      jest.useRealTimers();
   });

   describe("Constructor", () => {
      it("should initialize with default values", () => {
         const defaultManager = new RetryManager();
         expect(defaultManager).toBeInstanceOf(RetryManager);
      });

      it("should initialize with custom values", () => {
         const customManager = new RetryManager(5, 2000);
         expect(customManager).toBeInstanceOf(RetryManager);
      });
   });

   describe("executeWithRetry - Success scenarios", () => {
      it("should return result on first successful attempt", async () => {
         const operation = jest.fn().mockResolvedValue("success");

         const result = await retryManager.executeWithRetry(operation);

         expect(result).toBe("success");
         expect(operation).toHaveBeenCalledTimes(1);
      });

      it("should succeed after retryable failure", async () => {
         jest.useFakeTimers();

         const operation = jest
            .fn()
            .mockRejectedValueOnce(new Error("Network error"))
            .mockResolvedValue("success");

         mockErrorHandler.handle.mockReturnValue({
            message: "Network error",
            isRetryable: true,
            userMessage: "Connection issue",
         });

         const resultPromise = retryManager.executeWithRetry(operation);

         // Fast-forward timer for retry delay
         jest.advanceTimersByTime(1000);

         // Wait for all promises to resolve
         await jest.runAllTimersAsync();

         const result = await resultPromise;

         expect(result).toBe("success");
         expect(operation).toHaveBeenCalledTimes(2);
         expect(mockErrorHandler.handle).toHaveBeenCalledWith(
            expect.any(Error),
            undefined
         );
      });

      it("should succeed on last attempt", async () => {
         jest.useFakeTimers();

         const operation = jest
            .fn()
            .mockRejectedValueOnce(new Error("Error 1"))
            .mockRejectedValueOnce(new Error("Error 2"))
            .mockResolvedValue("success");

         mockErrorHandler.handle.mockReturnValue({
            message: "Retryable error",
            isRetryable: true,
            userMessage: "Try again",
         });

         const resultPromise = retryManager.executeWithRetry(operation);

         // Advance all timers and let all promises resolve
         await jest.runAllTimersAsync();

         const result = await resultPromise;

         expect(result).toBe("success");
         expect(operation).toHaveBeenCalledTimes(3);
      });
   });

   describe("executeWithRetry - Failure scenarios", () => {
      it("should throw error after max attempts with retryable error", async () => {
         jest.useFakeTimers();

         const operation = jest
            .fn()
            .mockRejectedValue(new Error("Persistent network error"));

         mockErrorHandler.handle.mockReturnValue({
            message: "Network error",
            isRetryable: true,
            userMessage: "Connection issue",
         });

         const resultPromise = retryManager.executeWithRetry(operation);

         // Let all timers run and promises resolve
         await jest.runAllTimersAsync();

         await expect(resultPromise).rejects.toThrow(
            "Persistent network error"
         );
         expect(operation).toHaveBeenCalledTimes(3);
      });

      it("should not retry non-retryable errors", async () => {
         const operation = jest
            .fn()
            .mockRejectedValue(new Error("404 Not Found"));

         mockErrorHandler.handle.mockReturnValue({
            message: "404 Not Found",
            isRetryable: false,
            userMessage: "Pokemon not found",
         });

         await expect(retryManager.executeWithRetry(operation)).rejects.toThrow(
            "404 Not Found"
         );
         expect(operation).toHaveBeenCalledTimes(1);
         expect(mockErrorHandler.handle).toHaveBeenCalledWith(
            expect.any(Error),
            undefined
         );
      });

      it("should handle non-Error objects", async () => {
         const operation = jest.fn().mockRejectedValue("string error");

         mockErrorHandler.handle.mockReturnValue({
            message: "string error",
            isRetryable: false,
            userMessage: "Something went wrong",
         });

         await expect(retryManager.executeWithRetry(operation)).rejects.toThrow(
            "string error"
         );
         expect(operation).toHaveBeenCalledTimes(1);
      });
   });

   describe("executeWithRetry - Exponential backoff", () => {
      it("should implement exponential backoff correctly", async () => {
         jest.useFakeTimers();

         const operation = jest
            .fn()
            .mockRejectedValue(new Error("Network error"));

         mockErrorHandler.handle.mockReturnValue({
            message: "Network error",
            isRetryable: true,
            userMessage: "Connection issue",
         });

         const resultPromise = retryManager.executeWithRetry(operation);

         // Check that operation is called immediately
         expect(operation).toHaveBeenCalledTimes(1);

         // After first retry delay (1000ms)
         jest.advanceTimersByTime(1000);
         await Promise.resolve(); // Allow promise to resolve
         expect(operation).toHaveBeenCalledTimes(2);

         // After second retry delay (2000ms - exponential backoff)
         jest.advanceTimersByTime(2000);
         await Promise.resolve(); // Allow promise to resolve
         expect(operation).toHaveBeenCalledTimes(3);

         await expect(resultPromise).rejects.toThrow();
      });

      it("should calculate correct delays for different base delays", async () => {
         jest.useFakeTimers();

         const customManager = new RetryManager(3, 500);
         const operation = jest.fn().mockRejectedValue(new Error("Error"));

         mockErrorHandler.handle.mockReturnValue({
            message: "Error",
            isRetryable: true,
            userMessage: "Try again",
         });

         const resultPromise = customManager.executeWithRetry(operation);

         expect(operation).toHaveBeenCalledTimes(1);

         // First retry: 500ms
         jest.advanceTimersByTime(500);
         await Promise.resolve();
         expect(operation).toHaveBeenCalledTimes(2);

         // Second retry: 1000ms (500 * 2^1)
         jest.advanceTimersByTime(1000);
         await Promise.resolve();
         expect(operation).toHaveBeenCalledTimes(3);

         await expect(resultPromise).rejects.toThrow();
      });
   });

   describe("executeWithRetry - Error context", () => {
      it("should pass error context to ErrorHandler", async () => {
         const operation = jest.fn().mockRejectedValue(new Error("Test error"));
         const errorContext = "Fetching Pokemon data";

         mockErrorHandler.handle.mockReturnValue({
            message: "Test error",
            isRetryable: false,
            userMessage: "Failed to fetch Pokemon",
         });

         await expect(
            retryManager.executeWithRetry(operation, errorContext)
         ).rejects.toThrow();

         expect(mockErrorHandler.handle).toHaveBeenCalledWith(
            expect.any(Error),
            errorContext
         );
      });

      it("should handle undefined error context", async () => {
         const operation = jest.fn().mockRejectedValue(new Error("Test error"));

         mockErrorHandler.handle.mockReturnValue({
            message: "Test error",
            isRetryable: false,
            userMessage: "Something went wrong",
         });

         await expect(
            retryManager.executeWithRetry(operation)
         ).rejects.toThrow();

         expect(mockErrorHandler.handle).toHaveBeenCalledWith(
            expect.any(Error),
            undefined
         );
      });
   });

   describe("executeWithRetry - Mixed retry scenarios", () => {
      it("should handle mix of retryable and non-retryable errors", async () => {
         jest.useFakeTimers();

         const operation = jest
            .fn()
            .mockRejectedValueOnce(new Error("Network timeout"))
            .mockRejectedValueOnce(new Error("404 Not Found"));

         mockErrorHandler.handle
            .mockReturnValueOnce({
               message: "Network timeout",
               isRetryable: true,
               userMessage: "Connection issue",
            })
            .mockReturnValueOnce({
               message: "404 Not Found",
               isRetryable: false,
               userMessage: "Pokemon not found",
            });

         const resultPromise = retryManager.executeWithRetry(operation);

         // Wait for first retry delay
         jest.advanceTimersByTime(1000);
         await Promise.resolve();

         await expect(resultPromise).rejects.toThrow("404 Not Found");
         expect(operation).toHaveBeenCalledTimes(2);
      });

      it("should handle operation that throws during execution", async () => {
         jest.useFakeTimers();

         const operation = jest.fn().mockImplementation(() => {
            throw new Error("Synchronous error");
         });

         mockErrorHandler.handle.mockReturnValue({
            message: "Synchronous error",
            isRetryable: true,
            userMessage: "Try again",
         });

         const resultPromise = retryManager.executeWithRetry(operation);

         // Run all timers to completion
         await jest.runAllTimersAsync();

         await expect(resultPromise).rejects.toThrow("Synchronous error");
         expect(operation).toHaveBeenCalledTimes(3);
      });
   });

   describe("executeWithRetry - Edge cases", () => {
      it("should handle zero max attempts", async () => {
         const zeroAttemptsManager = new RetryManager(0, 1000);
         const operation = jest.fn().mockResolvedValue("success");

         // With 0 max attempts, it should still try once (constructor ensures min 1)
         const result = await zeroAttemptsManager.executeWithRetry(operation);

         expect(result).toBe("success");
         expect(operation).toHaveBeenCalledTimes(1);
      });

      it("should handle negative delays gracefully", async () => {
         jest.useFakeTimers();

         const negativeDelayManager = new RetryManager(2, -100);
         const operation = jest
            .fn()
            .mockRejectedValueOnce(new Error("Error"))
            .mockResolvedValue("success");

         mockErrorHandler.handle.mockReturnValue({
            message: "Error",
            isRetryable: true,
            userMessage: "Try again",
         });

         const resultPromise = negativeDelayManager.executeWithRetry(operation);

         // Run all timers (negative delay should be treated as 0)
         await jest.runAllTimersAsync();

         const result = await resultPromise;

         expect(result).toBe("success");
         expect(operation).toHaveBeenCalledTimes(2);
      });

      it("should handle very large delays", async () => {
         jest.useFakeTimers();

         const largeDelayManager = new RetryManager(2, 10000);
         const operation = jest
            .fn()
            .mockRejectedValueOnce(new Error("Error"))
            .mockResolvedValue("success");

         mockErrorHandler.handle.mockReturnValue({
            message: "Error",
            isRetryable: true,
            userMessage: "Try again",
         });

         const resultPromise = largeDelayManager.executeWithRetry(operation);

         // Fast forward through the large delay
         await jest.runAllTimersAsync();

         const result = await resultPromise;

         expect(result).toBe("success");
         expect(operation).toHaveBeenCalledTimes(2);
      });
   });
});
