import NetInfo from "@react-native-community/netinfo";

export class NetworkManager {
   private isConnected: boolean = true;
   private unsubscribe?: () => void;

   constructor() {
      this.initializeNetInfo();
   }

   private initializeNetInfo(): void {
      try {
         this.unsubscribe = NetInfo.addEventListener((state) => {
            this.isConnected = state.isConnected ?? false;
         });
      } catch (error) {
         console.warn("NetInfo initialization failed:", error);
         this.isConnected = true;
      }
   }

   cleanup(): void {
      if (this.unsubscribe) {
         this.unsubscribe();
         this.unsubscribe = undefined;
      }
   }

   async checkConnection(): Promise<boolean> {
      try {
         const state = await NetInfo.fetch();
         this.isConnected = state.isConnected ?? false;
         return this.isConnected;
      } catch (error) {
         console.warn("Network check failed:", error);
         return this.isConnected;
      }
   }

   isOnline(): boolean {
      return this.isConnected;
   }
}
