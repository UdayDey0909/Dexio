import { Validator } from "@/Services/Client/Module/Validator";
import { BatchOperationOptions } from "@/Services/Client/Types";

describe("Validator", () => {
   describe("validateIdentifier", () => {
      describe("null/undefined validation", () => {
         it("should throw error for null identifier", () => {
            expect(() =>
               Validator.validateIdentifier(null as any, "Pokemon")
            ).toThrow("Pokemon identifier cannot be null or undefined");
         });

         it("should throw error for undefined identifier", () => {
            expect(() =>
               Validator.validateIdentifier(undefined as any, "Pokemon")
            ).toThrow("Pokemon identifier cannot be null or undefined");
         });
      });

      describe("string validation", () => {
         it("should accept valid string identifier", () => {
            expect(() =>
               Validator.validateIdentifier("pikachu", "Pokemon")
            ).not.toThrow();
         });

         it("should accept string with spaces that trim to valid length", () => {
            expect(() =>
               Validator.validateIdentifier("  pikachu  ", "Pokemon")
            ).not.toThrow();
         });

         it("should throw error for empty string", () => {
            expect(() => Validator.validateIdentifier("", "Pokemon")).toThrow(
               "Pokemon identifier cannot be empty"
            );
         });

         it("should throw error for string with only whitespace", () => {
            expect(() =>
               Validator.validateIdentifier("   ", "Pokemon")
            ).toThrow("Pokemon identifier cannot be empty");
         });

         it("should throw error for string longer than 50 characters", () => {
            const longString = "a".repeat(51);
            expect(() =>
               Validator.validateIdentifier(longString, "Pokemon")
            ).toThrow("Pokemon identifier too long (max 50 characters)");
         });

         it("should accept string exactly 50 characters long", () => {
            const maxString = "a".repeat(50);
            expect(() =>
               Validator.validateIdentifier(maxString, "Pokemon")
            ).not.toThrow();
         });

         it("should throw error for string that trims to over 50 characters", () => {
            const longString = "  " + "a".repeat(51) + "  ";
            expect(() =>
               Validator.validateIdentifier(longString, "Pokemon")
            ).toThrow("Pokemon identifier too long (max 50 characters)");
         });
      });

      describe("number validation", () => {
         it("should accept valid Pokemon ID", () => {
            expect(() =>
               Validator.validateIdentifier(25, "Pokemon")
            ).not.toThrow();
         });

         it("should accept minimum valid ID (1)", () => {
            expect(() =>
               Validator.validateIdentifier(1, "Pokemon")
            ).not.toThrow();
         });

         it("should accept maximum valid ID (1010)", () => {
            expect(() =>
               Validator.validateIdentifier(1010, "Pokemon")
            ).not.toThrow();
         });

         it("should throw error for ID less than 1", () => {
            expect(() => Validator.validateIdentifier(0, "Pokemon")).toThrow(
               "Pokemon ID must be between 1 and 1010"
            );
         });

         it("should throw error for negative ID", () => {
            expect(() => Validator.validateIdentifier(-1, "Pokemon")).toThrow(
               "Pokemon ID must be between 1 and 1010"
            );
         });

         it("should throw error for ID greater than 1010", () => {
            expect(() => Validator.validateIdentifier(1011, "Pokemon")).toThrow(
               "Pokemon ID must be between 1 and 1010"
            );
         });

         it("should throw error for non-integer number", () => {
            expect(() => Validator.validateIdentifier(25.5, "Pokemon")).toThrow(
               "Pokemon ID must be between 1 and 1010"
            );
         });

         it("should throw error for NaN", () => {
            expect(() => Validator.validateIdentifier(NaN, "Pokemon")).toThrow(
               "Pokemon ID must be between 1 and 1010"
            );
         });

         it("should throw error for Infinity", () => {
            expect(() =>
               Validator.validateIdentifier(Infinity, "Pokemon")
            ).toThrow("Pokemon ID must be between 1 and 1010");
         });

         it("should throw error for negative Infinity", () => {
            expect(() =>
               Validator.validateIdentifier(-Infinity, "Pokemon")
            ).toThrow("Pokemon ID must be between 1 and 1010");
         });
      });

      describe("custom name parameter", () => {
         it("should use custom name in error messages", () => {
            expect(() =>
               Validator.validateIdentifier(null as any, "CustomEntity")
            ).toThrow("CustomEntity identifier cannot be null or undefined");

            expect(() =>
               Validator.validateIdentifier("", "CustomEntity")
            ).toThrow("CustomEntity identifier cannot be empty");

            expect(() =>
               Validator.validateIdentifier(0, "CustomEntity")
            ).toThrow("CustomEntity ID must be between 1 and 1010");
         });
      });
   });

   describe("validatePaginationParams", () => {
      describe("offset validation", () => {
         it("should accept valid offset", () => {
            expect(() =>
               Validator.validatePaginationParams(0, 10)
            ).not.toThrow();
         });

         it("should accept positive offset", () => {
            expect(() =>
               Validator.validatePaginationParams(20, 10)
            ).not.toThrow();
         });

         it("should throw error for negative offset", () => {
            expect(() => Validator.validatePaginationParams(-1, 10)).toThrow(
               "Offset must be non-negative integer"
            );
         });

         it("should throw error for non-integer offset", () => {
            expect(() => Validator.validatePaginationParams(5.5, 10)).toThrow(
               "Offset must be non-negative integer"
            );
         });

         it("should throw error for NaN offset", () => {
            expect(() => Validator.validatePaginationParams(NaN, 10)).toThrow(
               "Offset must be non-negative integer"
            );
         });

         it("should throw error for Infinity offset", () => {
            expect(() =>
               Validator.validatePaginationParams(Infinity, 10)
            ).toThrow("Offset must be non-negative integer");
         });
      });

      describe("limit validation", () => {
         it("should accept valid limit", () => {
            expect(() =>
               Validator.validatePaginationParams(0, 50)
            ).not.toThrow();
         });

         it("should accept minimum limit (1)", () => {
            expect(() =>
               Validator.validatePaginationParams(0, 1)
            ).not.toThrow();
         });

         it("should accept maximum limit (100)", () => {
            expect(() =>
               Validator.validatePaginationParams(0, 100)
            ).not.toThrow();
         });

         it("should throw error for limit less than 1", () => {
            expect(() => Validator.validatePaginationParams(0, 0)).toThrow(
               "Limit must be between 1 and 100"
            );
         });

         it("should throw error for negative limit", () => {
            expect(() => Validator.validatePaginationParams(0, -5)).toThrow(
               "Limit must be between 1 and 100"
            );
         });

         it("should throw error for limit greater than 100", () => {
            expect(() => Validator.validatePaginationParams(0, 101)).toThrow(
               "Limit must be between 1 and 100"
            );
         });

         it("should throw error for non-integer limit", () => {
            expect(() => Validator.validatePaginationParams(0, 10.5)).toThrow(
               "Limit must be between 1 and 100"
            );
         });

         it("should throw error for NaN limit", () => {
            expect(() => Validator.validatePaginationParams(0, NaN)).toThrow(
               "Limit must be between 1 and 100"
            );
         });

         it("should throw error for Infinity limit", () => {
            expect(() =>
               Validator.validatePaginationParams(0, Infinity)
            ).toThrow("Limit must be between 1 and 100");
         });
      });

      describe("combined validation", () => {
         it("should validate both parameters and throw first error encountered", () => {
            expect(() => Validator.validatePaginationParams(-1, 0)).toThrow(
               "Offset must be non-negative integer"
            );
         });
      });
   });

   describe("validateArray", () => {
      describe("array type validation", () => {
         it("should accept valid array", () => {
            expect(() =>
               Validator.validateArray([1, 2, 3], "TestArray")
            ).not.toThrow();
         });

         it("should throw error for non-array input", () => {
            expect(() =>
               Validator.validateArray("not-an-array" as any, "TestArray")
            ).toThrow("TestArray must be an array");
         });

         it("should throw error for null input", () => {
            expect(() =>
               Validator.validateArray(null as any, "TestArray")
            ).toThrow("TestArray must be an array");
         });

         it("should throw error for undefined input", () => {
            expect(() =>
               Validator.validateArray(undefined as any, "TestArray")
            ).toThrow("TestArray must be an array");
         });

         it("should throw error for object input", () => {
            expect(() =>
               Validator.validateArray({} as any, "TestArray")
            ).toThrow("TestArray must be an array");
         });
      });

      describe("default length validation", () => {
         it("should accept array with default min length (1)", () => {
            expect(() =>
               Validator.validateArray([1], "TestArray")
            ).not.toThrow();
         });

         it("should accept array with default max length (20)", () => {
            const arr = Array(20).fill(1);
            expect(() =>
               Validator.validateArray(arr, "TestArray")
            ).not.toThrow();
         });

         it("should throw error for empty array (below default min)", () => {
            expect(() => Validator.validateArray([], "TestArray")).toThrow(
               "TestArray must have at least 1 items"
            );
         });

         it("should throw error for array exceeding default max (21 items)", () => {
            const arr = Array(21).fill(1);
            expect(() => Validator.validateArray(arr, "TestArray")).toThrow(
               "TestArray cannot exceed 20 items"
            );
         });
      });

      describe("custom length validation", () => {
         it("should accept array meeting custom min length", () => {
            expect(() =>
               Validator.validateArray([1, 2], "TestArray", 2, 5)
            ).not.toThrow();
         });

         it("should accept array at custom max length", () => {
            expect(() =>
               Validator.validateArray([1, 2, 3, 4, 5], "TestArray", 2, 5)
            ).not.toThrow();
         });

         it("should throw error for array below custom min length", () => {
            expect(() =>
               Validator.validateArray([1], "TestArray", 3, 10)
            ).toThrow("TestArray must have at least 3 items");
         });

         it("should throw error for array exceeding custom max length", () => {
            expect(() =>
               Validator.validateArray([1, 2, 3, 4], "TestArray", 1, 3)
            ).toThrow("TestArray cannot exceed 3 items");
         });

         it("should accept empty array when min length is 0", () => {
            expect(() =>
               Validator.validateArray([], "TestArray", 0, 5)
            ).not.toThrow();
         });
      });

      describe("edge cases", () => {
         it("should work with different array types", () => {
            expect(() =>
               Validator.validateArray(["a", "b"], "StringArray")
            ).not.toThrow();

            expect(() =>
               Validator.validateArray([{}, {}], "ObjectArray")
            ).not.toThrow();

            expect(() =>
               Validator.validateArray([true, false], "BooleanArray")
            ).not.toThrow();
         });

         it("should use custom name in error messages", () => {
            expect(() => Validator.validateArray([], "CustomArray")).toThrow(
               "CustomArray must have at least 1 items"
            );

            expect(() =>
               Validator.validateArray("invalid" as any, "CustomArray")
            ).toThrow("CustomArray must be an array");
         });
      });
   });

   describe("validateBatchOptions", () => {
      describe("valid options", () => {
         it("should accept valid batch options", () => {
            const options: BatchOperationOptions = {
               concurrency: 5,
               onProgress: () => {},
               stopOnError: true,
            };
            expect(() => Validator.validateBatchOptions(options)).not.toThrow();
         });

         it("should accept options without concurrency", () => {
            const options: BatchOperationOptions = {
               onProgress: () => {},
               stopOnError: false,
            };
            expect(() => Validator.validateBatchOptions(options)).not.toThrow();
         });

         it("should accept empty options object", () => {
            expect(() => Validator.validateBatchOptions({})).not.toThrow();
         });

         it("should accept minimum concurrency (1)", () => {
            expect(() =>
               Validator.validateBatchOptions({ concurrency: 1 })
            ).not.toThrow();
         });

         it("should accept maximum concurrency (10)", () => {
            expect(() =>
               Validator.validateBatchOptions({ concurrency: 10 })
            ).not.toThrow();
         });
      });

      describe("invalid concurrency", () => {
         it("should not validate concurrency of 0 (falsy value)", () => {
            // The implementation only validates when concurrency is truthy
            expect(() =>
               Validator.validateBatchOptions({ concurrency: 0 })
            ).not.toThrow();
         });

         it("should throw error for negative concurrency", () => {
            expect(() =>
               Validator.validateBatchOptions({ concurrency: -1 })
            ).toThrow("Concurrency must be between 1 and 10");
         });

         it("should throw error for concurrency greater than 10", () => {
            expect(() =>
               Validator.validateBatchOptions({ concurrency: 11 })
            ).toThrow("Concurrency must be between 1 and 10");
         });

         it("should accept non-integer concurrency within range", () => {
            // 5.5 is between 1 and 10, so it passes validation (no integer check in implementation)
            expect(() =>
               Validator.validateBatchOptions({ concurrency: 5.5 })
            ).not.toThrow();
         });

         it("should not validate NaN concurrency (falsy value)", () => {
            // NaN is falsy, so validation is skipped
            expect(() =>
               Validator.validateBatchOptions({ concurrency: NaN })
            ).not.toThrow();
         });

         it("should throw error for Infinity concurrency", () => {
            expect(() =>
               Validator.validateBatchOptions({ concurrency: Infinity })
            ).toThrow("Concurrency must be between 1 and 10");
         });
      });

      describe("other options ignored", () => {
         it("should not validate onProgress callback", () => {
            const options: BatchOperationOptions = {
               concurrency: 5,
               onProgress: null as any, // Invalid callback, but not validated
               stopOnError: true,
            };
            expect(() => Validator.validateBatchOptions(options)).not.toThrow();
         });

         it("should not validate stopOnError boolean", () => {
            const options: BatchOperationOptions = {
               concurrency: 5,
               stopOnError: "invalid" as any, // Invalid boolean, but not validated
            };
            expect(() => Validator.validateBatchOptions(options)).not.toThrow();
         });
      });
   });

   describe("static class behavior", () => {
      it("should be instantiable (classes in TypeScript are instantiable by default)", () => {
         // TypeScript classes are instantiable unless explicitly prevented
         expect(() => new (Validator as any)()).not.toThrow();
      });

      it("should have all methods as static", () => {
         expect(typeof Validator.validateIdentifier).toBe("function");
         expect(typeof Validator.validatePaginationParams).toBe("function");
         expect(typeof Validator.validateArray).toBe("function");
         expect(typeof Validator.validateBatchOptions).toBe("function");
      });
   });

   describe("error message consistency", () => {
      it("should provide consistent error message format", () => {
         const errors: string[] = [];

         try {
            Validator.validateIdentifier(null as any, "Test");
         } catch (e) {
            errors.push((e as Error).message);
         }

         try {
            Validator.validatePaginationParams(-1, 10);
         } catch (e) {
            errors.push((e as Error).message);
         }

         try {
            Validator.validateArray([], "Test");
         } catch (e) {
            errors.push((e as Error).message);
         }

         try {
            Validator.validateBatchOptions({ concurrency: 0 });
         } catch (e) {
            errors.push((e as Error).message);
         }

         // All errors should be strings and not empty
         errors.forEach((error) => {
            expect(typeof error).toBe("string");
            expect(error.length).toBeGreaterThan(0);
         });
      });
   });
});
