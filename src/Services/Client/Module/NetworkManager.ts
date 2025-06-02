import NetInfo from "@react-native-community/netinfo";

export class NetworkManager {
   private isConnected: boolean = true;

   constructor() {
      // Listen to network changes
      NetInfo.addEventListener((state) => {
         this.isConnected = state.isConnected ?? false;
      });
   }

   async checkConnection(): Promise<boolean> {
      const state = await NetInfo.fetch();
      this.isConnected = state.isConnected ?? false;
      return this.isConnected;
   }

   isOnline(): boolean {
      return this.isConnected;
   }
}
