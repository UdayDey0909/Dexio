import {
   MemoryManager,
   MobileCacheManager,
} from "@/Services/Client/Module/MemoryManager";

jest.mock("pokenode-ts", () => ({
   MainClient: jest.fn().mockImplementation(() => ({})),
}));

describe("MemoryManager", () => {
   it("should return the same instance (singleton)", () => {
      const instance1 = MemoryManager.getInstance();
      const instance2 = MemoryManager.getInstance();
      expect(instance1).toBe(instance2);
   });

   it("should register and trigger cleanup callbacks", () => {
      const manager = MemoryManager.getInstance();
      const callback = jest.fn();

      manager.addCleanupCallback(callback);
      manager.cleanup();

      expect(callback).toHaveBeenCalled();
   });

   it("should unregister cleanup callback", () => {
      const manager = MemoryManager.getInstance();
      const callback = jest.fn();

      const unregister = manager.addCleanupCallback(callback);
      unregister(); // remove callback

      manager.cleanup();
      expect(callback).not.toHaveBeenCalled();
   });

   it("should handle cleanup with no callbacks gracefully", () => {
      const manager = MemoryManager.getInstance();
      // Manually clear callbacks for a clean test
      manager["cleanupCallbacks"].clear();

      expect(() => manager.cleanup()).not.toThrow();
   });
});

describe("MobileCacheManager", () => {
   it("should apply mobile defaults when no config is passed", () => {
      const cache = new MobileCacheManager();
      const stats = cache.getCacheStats();

      expect(stats.ttlMinutes).toBe(5);
      expect(stats.maxItems).toBe(100);
      expect(stats.message).toBe("Cache configured for mobile usage");
   });

   it("should override mobile defaults when config is provided", () => {
      const cache = new MobileCacheManager({ ttl: 600000, maxItems: 80 }); // 10 min
      const stats = cache.getCacheStats();

      expect(stats.ttlMinutes).toBe(10);
      expect(stats.maxItems).toBe(80);
   });
});
