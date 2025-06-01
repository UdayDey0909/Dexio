export class RateLimiter {
   private requestCount: number = 0;
   private lastRequestTime: number = 0;
   private readonly rateLimit: number;

   constructor(rateLimit: number = 100) {
      this.rateLimit = rateLimit;
   }

   async checkLimit(): Promise<void> {
      const now = Date.now();
      const timeWindow = 60000; // 1 minute

      if (now - this.lastRequestTime < timeWindow) {
         if (this.requestCount >= this.rateLimit) {
            const waitTime = timeWindow - (now - this.lastRequestTime);
            console.warn(`Rate limit reached. Waiting ${waitTime}ms`);
            await this.delay(waitTime);
            this.reset();
         }
      } else {
         this.reset();
      }
   }

   incrementCount(): void {
      this.requestCount++;
   }

   reset(): void {
      this.requestCount = 0;
      this.lastRequestTime = Date.now();
   }

   getStats() {
      return {
         requestCount: this.requestCount,
         lastRequestTime: this.lastRequestTime,
         rateLimit: this.rateLimit,
      };
   }

   private async delay(ms: number): Promise<void> {
      return new Promise((resolve) => setTimeout(resolve, ms));
   }
}
