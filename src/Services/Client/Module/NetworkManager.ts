import NetInfo from "@react-native-community/netinfo";

export class NetworkManager {
   private isConnected: boolean = true; // Default to true as fallback

   constructor() {
      // FIXED: Add error handling for NetInfo initialization
      this.initializeNetInfo();
   }

   private initializeNetInfo(): void {
      try {
         // Listen to network changes
         NetInfo.addEventListener((state) => {
            this.isConnected = state.isConnected ?? false;
            console.log("Network status changed:", this.isConnected);
         });

         console.log("NetInfo initialized successfully");
      } catch (error) {
         console.warn(
            "NetInfo initialization failed, assuming device is online:",
            error
         );
         this.isConnected = true; // Assume connected if we can't check
      }
   }

   async checkConnection(): Promise<boolean> {
      try {
         const state = await NetInfo.fetch();
         this.isConnected = state.isConnected ?? false;
         return this.isConnected;
      } catch (error) {
         console.warn("Failed to check network connection:", error);
         // Return current cached status if fetch fails
         return this.isConnected;
      }
   }

   isOnline(): boolean {
      return this.isConnected;
   }
}
