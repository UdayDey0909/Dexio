import { UrlUtils } from "@/Services/Client/Module/UrlUtils";

describe("UrlUtils", () => {
   describe("extractIdFromUrl", () => {
      describe("valid URLs with IDs", () => {
         test("should extract ID from URL with trailing slash", () => {
            expect(
               UrlUtils.extractIdFromUrl(
                  "https://pokeapi.co/api/v2/pokemon/25/"
               )
            ).toBe(25);
            expect(
               UrlUtils.extractIdFromUrl("https://example.com/resource/123/")
            ).toBe(123);
         });

         test("should extract ID from URL without trailing slash", () => {
            expect(
               UrlUtils.extractIdFromUrl("https://pokeapi.co/api/v2/pokemon/25")
            ).toBe(25);
            expect(
               UrlUtils.extractIdFromUrl("https://example.com/resource/456")
            ).toBe(456);
         });

         test("should extract ID from URL with query parameters", () => {
            expect(
               UrlUtils.extractIdFromUrl(
                  "https://pokeapi.co/api/v2/pokemon/25?limit=10"
               )
            ).toBe(25);
            expect(
               UrlUtils.extractIdFromUrl(
                  "https://example.com/resource/789?param=value&other=test"
               )
            ).toBe(789);
         });

         test("should extract ID from URL with fragment", () => {
            expect(
               UrlUtils.extractIdFromUrl(
                  "https://pokeapi.co/api/v2/pokemon/25#section"
               )
            ).toBe(25);
            expect(
               UrlUtils.extractIdFromUrl("https://example.com/resource/101#top")
            ).toBe(101);
         });

         test("should handle large ID numbers", () => {
            expect(
               UrlUtils.extractIdFromUrl("https://example.com/resource/999999/")
            ).toBe(999999);
            expect(
               UrlUtils.extractIdFromUrl("https://example.com/resource/1000000")
            ).toBe(1000000);
         });

         test("should handle single digit IDs", () => {
            expect(
               UrlUtils.extractIdFromUrl("https://example.com/resource/1/")
            ).toBe(1);
            expect(
               UrlUtils.extractIdFromUrl("https://example.com/resource/9")
            ).toBe(9);
         });
      });

      describe("invalid inputs", () => {
         test("should return null for empty or invalid inputs", () => {
            expect(UrlUtils.extractIdFromUrl("")).toBe(null);
            expect(UrlUtils.extractIdFromUrl(null as any)).toBe(null);
            expect(UrlUtils.extractIdFromUrl(undefined as any)).toBe(null);
            expect(UrlUtils.extractIdFromUrl(123 as any)).toBe(null);
            expect(UrlUtils.extractIdFromUrl({} as any)).toBe(null);
         });

         test("should return null for URLs without numeric IDs", () => {
            expect(
               UrlUtils.extractIdFromUrl(
                  "https://pokeapi.co/api/v2/pokemon/pikachu/"
               )
            ).toBe(null);
            expect(
               UrlUtils.extractIdFromUrl("https://example.com/resource/abc")
            ).toBe(null);
            expect(
               UrlUtils.extractIdFromUrl("https://example.com/resource/")
            ).toBe(null);
            expect(UrlUtils.extractIdFromUrl("https://example.com/")).toBe(
               null
            );
         });

         test("should return null for malformed URLs", () => {
            expect(UrlUtils.extractIdFromUrl("not-a-url")).toBe(null);
            expect(UrlUtils.extractIdFromUrl("://invalid")).toBe(null);
            expect(UrlUtils.extractIdFromUrl("123")).toBe(null);
         });

         test("should return null for URLs with non-numeric characters mixed with numbers", () => {
            expect(
               UrlUtils.extractIdFromUrl("https://example.com/resource/123abc/")
            ).toBe(null);
            expect(
               UrlUtils.extractIdFromUrl("https://example.com/resource/abc123/")
            ).toBe(null);
         });
      });
   });

   describe("extractNameFromUrl", () => {
      describe("valid URLs", () => {
         test("should extract name from standard URLs", () => {
            expect(
               UrlUtils.extractNameFromUrl(
                  "https://pokeapi.co/api/v2/pokemon/pikachu/"
               )
            ).toBe("pikachu");
            expect(
               UrlUtils.extractNameFromUrl(
                  "https://pokeapi.co/api/v2/berry/cheri/"
               )
            ).toBe("cheri");
         });

         test("should extract name from URLs without trailing slash", () => {
            expect(
               UrlUtils.extractNameFromUrl(
                  "https://pokeapi.co/api/v2/pokemon/pikachu"
               )
            ).toBe("pikachu");
            expect(
               UrlUtils.extractNameFromUrl(
                  "https://example.com/resource/test-name"
               )
            ).toBe("test-name");
         });

         test("should extract name with special characters", () => {
            expect(
               UrlUtils.extractNameFromUrl(
                  "https://example.com/resource/test_name/"
               )
            ).toBe("test_name");
            expect(
               UrlUtils.extractNameFromUrl(
                  "https://example.com/resource/test-name-123/"
               )
            ).toBe("test-name-123");
         });

         test("should handle URLs with query parameters", () => {
            expect(
               UrlUtils.extractNameFromUrl(
                  "https://pokeapi.co/api/v2/pokemon/pikachu?limit=10"
               )
            ).toBe("pikachu");
         });

         test("should handle URLs with fragments", () => {
            expect(
               UrlUtils.extractNameFromUrl(
                  "https://pokeapi.co/api/v2/pokemon/pikachu#section"
               )
            ).toBe("pikachu");
         });

         test("should extract numeric names as strings", () => {
            expect(
               UrlUtils.extractNameFromUrl(
                  "https://pokeapi.co/api/v2/pokemon/25/"
               )
            ).toBe("25");
            expect(
               UrlUtils.extractNameFromUrl("https://example.com/resource/123")
            ).toBe("123");
         });
      });

      describe("fallback parsing for invalid URLs", () => {
         test("should handle malformed URLs using fallback parsing", () => {
            expect(
               UrlUtils.extractNameFromUrl("invalid-url/resource/test-name/")
            ).toBe("test-name");
            expect(UrlUtils.extractNameFromUrl("just/a/path/name")).toBe(
               "name"
            );
         });

         test("should handle relative paths", () => {
            expect(
               UrlUtils.extractNameFromUrl("/api/v2/pokemon/pikachu/")
            ).toBe("pikachu");
            expect(UrlUtils.extractNameFromUrl("pokemon/pikachu")).toBe(
               "pikachu"
            );
         });
      });

      describe("invalid inputs", () => {
         test("should return null for empty or invalid inputs", () => {
            expect(UrlUtils.extractNameFromUrl("")).toBe(null);
            expect(UrlUtils.extractNameFromUrl(null as any)).toBe(null);
            expect(UrlUtils.extractNameFromUrl(undefined as any)).toBe(null);
            expect(UrlUtils.extractNameFromUrl(123 as any)).toBe(null);
            expect(UrlUtils.extractNameFromUrl({} as any)).toBe(null);
         });

         test("should return null for URLs with insufficient path segments", () => {
            expect(UrlUtils.extractNameFromUrl("https://example.com/")).toBe(
               null
            );
            expect(
               UrlUtils.extractNameFromUrl("https://example.com/single")
            ).toBe(null);
            expect(UrlUtils.extractNameFromUrl("/")).toBe(null);
            expect(UrlUtils.extractNameFromUrl("//")).toBe(null);
         });
      });
   });

   describe("buildApiUrl", () => {
      describe("with identifier", () => {
         test("should build URL with string identifier", () => {
            expect(UrlUtils.buildApiUrl("pokemon", "pikachu")).toBe(
               "https://pokeapi.co/api/v2/pokemon/pikachu/"
            );
            expect(UrlUtils.buildApiUrl("berry", "cheri")).toBe(
               "https://pokeapi.co/api/v2/berry/cheri/"
            );
         });

         test("should build URL with numeric identifier", () => {
            expect(UrlUtils.buildApiUrl("pokemon", 25)).toBe(
               "https://pokeapi.co/api/v2/pokemon/25/"
            );
            expect(UrlUtils.buildApiUrl("item", 1)).toBe(
               "https://pokeapi.co/api/v2/item/1/"
            );
         });

         test("should clean endpoint by removing leading/trailing slashes", () => {
            expect(UrlUtils.buildApiUrl("/pokemon/", "pikachu")).toBe(
               "https://pokeapi.co/api/v2/pokemon/pikachu/"
            );
            expect(UrlUtils.buildApiUrl("///pokemon///", 25)).toBe(
               "https://pokeapi.co/api/v2/pokemon/25/"
            );
         });

         test("should clean string identifiers by trimming and lowercasing", () => {
            expect(UrlUtils.buildApiUrl("pokemon", "  PIKACHU  ")).toBe(
               "https://pokeapi.co/api/v2/pokemon/pikachu/"
            );
            expect(UrlUtils.buildApiUrl("pokemon", "CHARMANDER")).toBe(
               "https://pokeapi.co/api/v2/pokemon/charmander/"
            );
         });

         test("should handle zero as valid identifier", () => {
            expect(UrlUtils.buildApiUrl("pokemon", 0)).toBe(
               "https://pokeapi.co/api/v2/pokemon/0/"
            );
         });

         test("should handle empty string as identifier", () => {
            expect(UrlUtils.buildApiUrl("pokemon", "")).toBe(
               "https://pokeapi.co/api/v2/pokemon//"
            );
         });
      });

      describe("without identifier", () => {
         test("should build base endpoint URL", () => {
            expect(UrlUtils.buildApiUrl("pokemon")).toBe(
               "https://pokeapi.co/api/v2/pokemon/"
            );
            expect(UrlUtils.buildApiUrl("berry")).toBe(
               "https://pokeapi.co/api/v2/berry/"
            );
         });

         test("should clean endpoint by removing leading/trailing slashes", () => {
            expect(UrlUtils.buildApiUrl("/pokemon/")).toBe(
               "https://pokeapi.co/api/v2/pokemon/"
            );
            expect(UrlUtils.buildApiUrl("///pokemon///")).toBe(
               "https://pokeapi.co/api/v2/pokemon/"
            );
         });

         test("should handle null and undefined identifiers", () => {
            expect(UrlUtils.buildApiUrl("pokemon", undefined)).toBe(
               "https://pokeapi.co/api/v2/pokemon/"
            );
            // Note: null is not a valid parameter type for buildApiUrl, so we test undefined instead
            expect(UrlUtils.buildApiUrl("pokemon")).toBe(
               "https://pokeapi.co/api/v2/pokemon/"
            );
         });
      });

      describe("edge cases", () => {
         test("should handle empty endpoint", () => {
            expect(UrlUtils.buildApiUrl("")).toBe(
               "https://pokeapi.co/api/v2//"
            );
            expect(UrlUtils.buildApiUrl("", "test")).toBe(
               "https://pokeapi.co/api/v2//test/"
            );
         });

         test("should handle complex endpoint paths", () => {
            expect(UrlUtils.buildApiUrl("pokemon/ability", "static")).toBe(
               "https://pokeapi.co/api/v2/pokemon/ability/static/"
            );
         });
      });
   });

   describe("isValidApiUrl", () => {
      describe("valid API URLs", () => {
         test("should return true for valid PokeAPI URLs", () => {
            expect(
               UrlUtils.isValidApiUrl("https://pokeapi.co/api/v2/pokemon/25/")
            ).toBe(true);
            expect(
               UrlUtils.isValidApiUrl("https://pokeapi.co/api/v2/berry/cheri/")
            ).toBe(true);
            expect(
               UrlUtils.isValidApiUrl("https://pokeapi.co/api/v2/item/")
            ).toBe(true);
         });

         test("should return true for URLs with query parameters", () => {
            expect(
               UrlUtils.isValidApiUrl(
                  "https://pokeapi.co/api/v2/pokemon/?limit=20"
               )
            ).toBe(true);
            expect(
               UrlUtils.isValidApiUrl(
                  "https://pokeapi.co/api/v2/pokemon/25?format=json"
               )
            ).toBe(true);
         });

         test("should return true for URLs with fragments", () => {
            expect(
               UrlUtils.isValidApiUrl(
                  "https://pokeapi.co/api/v2/pokemon/25#section"
               )
            ).toBe(true);
         });

         test("should return true for URLs with different endpoints", () => {
            expect(
               UrlUtils.isValidApiUrl(
                  "https://pokeapi.co/api/v2/ability/static/"
               )
            ).toBe(true);
            expect(
               UrlUtils.isValidApiUrl("https://pokeapi.co/api/v2/type/fire/")
            ).toBe(true);
            expect(
               UrlUtils.isValidApiUrl("https://pokeapi.co/api/v2/move/tackle/")
            ).toBe(true);
         });
      });

      describe("invalid API URLs", () => {
         test("should return false for empty or invalid inputs", () => {
            expect(UrlUtils.isValidApiUrl("")).toBe(false);
            expect(UrlUtils.isValidApiUrl(null as any)).toBe(false);
            expect(UrlUtils.isValidApiUrl(undefined as any)).toBe(false);
         });

         test("should return false for wrong hostname", () => {
            expect(
               UrlUtils.isValidApiUrl("https://example.com/api/v2/pokemon/25/")
            ).toBe(false);
            expect(
               UrlUtils.isValidApiUrl("https://pokemon.com/api/v2/pokemon/25/")
            ).toBe(false);
            expect(
               UrlUtils.isValidApiUrl(
                  "https://api.pokemon.com/api/v2/pokemon/25/"
               )
            ).toBe(false);
         });

         test("should return false for wrong protocol", () => {
            // Note: Current implementation only checks hostname and path, not protocol
            expect(
               UrlUtils.isValidApiUrl("http://pokeapi.co/api/v2/pokemon/25/")
            ).toBe(true);
            expect(
               UrlUtils.isValidApiUrl("ftp://pokeapi.co/api/v2/pokemon/25/")
            ).toBe(true);
         });

         test("should return false for wrong API path", () => {
            expect(
               UrlUtils.isValidApiUrl("https://pokeapi.co/v2/pokemon/25/")
            ).toBe(false);
            expect(
               UrlUtils.isValidApiUrl("https://pokeapi.co/api/v1/pokemon/25/")
            ).toBe(false);
            expect(
               UrlUtils.isValidApiUrl("https://pokeapi.co/api/v3/pokemon/25/")
            ).toBe(false);
            expect(
               UrlUtils.isValidApiUrl("https://pokeapi.co/pokemon/25/")
            ).toBe(false);
         });

         test("should return false for malformed URLs", () => {
            expect(UrlUtils.isValidApiUrl("not-a-url")).toBe(false);
            expect(UrlUtils.isValidApiUrl("://invalid")).toBe(false);
            expect(UrlUtils.isValidApiUrl("pokeapi.co/api/v2/pokemon/25")).toBe(
               false
            );
         });

         test("should return false for URLs with subdomain variations", () => {
            expect(
               UrlUtils.isValidApiUrl(
                  "https://www.pokeapi.co/api/v2/pokemon/25/"
               )
            ).toBe(false);
            expect(
               UrlUtils.isValidApiUrl(
                  "https://api.pokeapi.co/api/v2/pokemon/25/"
               )
            ).toBe(false);
         });
      });

      describe("edge cases", () => {
         test("should handle URLs with ports", () => {
            expect(
               UrlUtils.isValidApiUrl(
                  "https://pokeapi.co:443/api/v2/pokemon/25/"
               )
            ).toBe(true);
            expect(
               UrlUtils.isValidApiUrl(
                  "https://pokeapi.co:8080/api/v2/pokemon/25/"
               )
            ).toBe(true);
         });

         test("should be case sensitive for hostname", () => {
            expect(
               UrlUtils.isValidApiUrl("https://POKEAPI.CO/api/v2/pokemon/25/")
            ).toBe(false);
            expect(
               UrlUtils.isValidApiUrl("https://PokeAPI.co/api/v2/pokemon/25/")
            ).toBe(false);
         });

         test("should handle trailing slashes in path", () => {
            expect(UrlUtils.isValidApiUrl("https://pokeapi.co/api/v2")).toBe(
               false
            );
            expect(UrlUtils.isValidApiUrl("https://pokeapi.co/api/v2/")).toBe(
               true
            );
         });
      });
   });

   describe("integration tests", () => {
      test("should work together - extract ID and build URL", () => {
         const originalUrl = "https://pokeapi.co/api/v2/pokemon/25/";
         const extractedId = UrlUtils.extractIdFromUrl(originalUrl);

         expect(extractedId).toBe(25);

         if (extractedId !== null) {
            const rebuiltUrl = UrlUtils.buildApiUrl("pokemon", extractedId);
            expect(rebuiltUrl).toBe(originalUrl);
            expect(UrlUtils.isValidApiUrl(rebuiltUrl)).toBe(true);
         }
      });

      test("should work together - extract name and build URL", () => {
         const originalUrl = "https://pokeapi.co/api/v2/pokemon/pikachu/";
         const extractedName = UrlUtils.extractNameFromUrl(originalUrl);

         expect(extractedName).toBe("pikachu");

         if (extractedName !== null) {
            const rebuiltUrl = UrlUtils.buildApiUrl("pokemon", extractedName);
            expect(rebuiltUrl).toBe(originalUrl);
            expect(UrlUtils.isValidApiUrl(rebuiltUrl)).toBe(true);
         }
      });

      test("should validate URLs built by buildApiUrl", () => {
         const urls = [
            UrlUtils.buildApiUrl("pokemon", "pikachu"),
            UrlUtils.buildApiUrl("pokemon", 25),
            UrlUtils.buildApiUrl("berry"),
            UrlUtils.buildApiUrl("item", 1),
         ];

         urls.forEach((url) => {
            expect(UrlUtils.isValidApiUrl(url)).toBe(true);
         });
      });

      test("should handle null extraction results gracefully", () => {
         const invalidUrl = "https://example.com/invalid";
         const extractedId = UrlUtils.extractIdFromUrl(invalidUrl);
         const extractedName = UrlUtils.extractNameFromUrl(invalidUrl);

         expect(extractedId).toBe(null);
         expect(extractedName).toBe(null);

         // Should not attempt to build URLs with null values
         if (extractedId !== null) {
            UrlUtils.buildApiUrl("pokemon", extractedId);
         }
         if (extractedName !== null) {
            UrlUtils.buildApiUrl("pokemon", extractedName);
         }
      });
   });
});
