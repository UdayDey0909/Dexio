import { CacheManager, CacheOptions } from "./CacheManager";

export class MemoryManager {
   private static instance: MemoryManager;
   private memoryWarningListeners: Set<() => void> = new Set();
   private isLowMemory: boolean = false;

   static getInstance(): MemoryManager {
      if (!MemoryManager.instance) {
         MemoryManager.instance = new MemoryManager();
      }
      return MemoryManager.instance;
   }

   constructor() {
      this.setupMemoryWarning();
   }

   private setupMemoryWarning() {
      // React Native memory warning handling
      if ((global as any).__DEV__) {
         console.log("Memory manager initialized");
      }
   }

   addMemoryWarningListener(callback: () => void) {
      this.memoryWarningListeners.add(callback);
      return () => this.memoryWarningListeners.delete(callback);
   }

   triggerMemoryCleanup() {
      this.isLowMemory = true;
      this.memoryWarningListeners.forEach((listener) => listener());
   }

   isMemoryLow(): boolean {
      return this.isLowMemory;
   }

   resetMemoryStatus() {
      this.isLowMemory = false;
   }
}

// Enhanced CacheManager with memory awareness
export class EnhancedCacheManager extends CacheManager {
   private memoryManager: MemoryManager;
   private memoryCleanupListener?: () => void;

   constructor(config: CacheOptions = {}) {
      // Reduce default cache size for mobile
      const mobileConfig = {
         ttl: config.ttl || 5 * 60 * 1000, // 5 minutes instead of 10
         maxItems: config.maxItems || 200, // 200 instead of 500
      };

      super(mobileConfig);
      this.memoryManager = MemoryManager.getInstance();
      this.setupMemoryWarning();
   }

   private setupMemoryWarning() {
      this.memoryCleanupListener = this.memoryManager.addMemoryWarningListener(
         () => {
            console.warn("Memory warning - clearing cache");
            this.clear();
         }
      );
   }

   // Override with memory-conscious clearing
   clear(): void {
      super.clear();
      if (this.memoryManager.isMemoryLow()) {
         // Force garbage collection hints
         if (global.gc) {
            global.gc();
         }
         this.memoryManager.resetMemoryStatus();
      }
   }

   destroy() {
      if (this.memoryCleanupListener) {
         this.memoryCleanupListener();
      }
   }
}
