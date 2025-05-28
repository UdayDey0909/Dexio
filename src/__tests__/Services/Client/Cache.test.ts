import { CACHE_CONFIG } from "@/Services/Client/Cache";

describe("CACHE_CONFIG", () => {
   it("should have valid CACHE_TIME and STALE_TIME objects", () => {
      expect(CACHE_CONFIG).toHaveProperty("CACHE_TIME");
      expect(CACHE_CONFIG).toHaveProperty("STALE_TIME");

      expect(typeof CACHE_CONFIG.CACHE_TIME).toBe("object");
      expect(typeof CACHE_CONFIG.STALE_TIME).toBe("object");

      expect(CACHE_CONFIG.CACHE_TIME).toHaveProperty("SHORT");
      expect(typeof CACHE_CONFIG.CACHE_TIME.SHORT).toBe("number");

      expect(CACHE_CONFIG.STALE_TIME).toHaveProperty("SHORT");
      expect(typeof CACHE_CONFIG.STALE_TIME.SHORT).toBe("number");
   });

   it("should have RETRY config object", () => {
      expect(CACHE_CONFIG).toHaveProperty("RETRY");
      expect(typeof CACHE_CONFIG.RETRY).toBe("object");
   });

   it("should have correct RETRY config values", () => {
      expect(CACHE_CONFIG.RETRY).toHaveProperty("MAX_ATTEMPTS");
      expect(CACHE_CONFIG.RETRY).toHaveProperty("DELAY_BASE");
      expect(CACHE_CONFIG.RETRY).toHaveProperty("DELAY_MAX");

      expect(typeof CACHE_CONFIG.RETRY.MAX_ATTEMPTS).toBe("number");
      expect(typeof CACHE_CONFIG.RETRY.DELAY_BASE).toBe("number");
      expect(typeof CACHE_CONFIG.RETRY.DELAY_MAX).toBe("number");
   });

   it("should include a version string", () => {
      expect(CACHE_CONFIG).toHaveProperty("VERSION");
      expect(typeof CACHE_CONFIG.VERSION).toBe("string");
   });
});
