import NetInfo from "@react-native-community/netinfo";
import { RetryManager } from "./RetryManager";

export class NetworkManager {
   private isConnected: boolean = true;
   private listeners: Set<(isConnected: boolean) => void> = new Set();

   constructor() {
      this.initializeNetworkListener();
   }

   private initializeNetworkListener() {
      NetInfo.addEventListener((state) => {
         this.isConnected = state.isConnected ?? false;
         this.notifyListeners();
      });
   }

   addListener(callback: (isConnected: boolean) => void) {
      this.listeners.add(callback);
      return () => this.listeners.delete(callback);
   }

   private notifyListeners() {
      this.listeners.forEach((listener) => listener(this.isConnected));
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

// Enhanced RetryManager for React Native
export class EnhancedRetryManager extends RetryManager {
   private networkManager: NetworkManager;

   constructor(retryAttempts: number = 3, retryDelay: number = 1000) {
      super(retryAttempts, retryDelay);
      this.networkManager = new NetworkManager();
   }

   async executeWithRetry<T>(
      operation: () => Promise<T>,
      errorMessage: string,
      customRetryAttempts?: number
   ): Promise<T> {
      // Check network before attempting
      if (!(await this.networkManager.checkConnection())) {
         throw new Error("No network connection available");
      }

      return super.executeWithRetry(
         operation,
         errorMessage,
         customRetryAttempts
      );
   }

   protected shouldRetry(error: Error): boolean {
      // Add React Native specific network errors
      const rnNetworkErrors = [
         "Network request failed",
         "The Internet connection appears to be offline",
         "Request timed out",
      ];

      const errorMessage = error.message.toLowerCase();
      const hasNetworkError = rnNetworkErrors.some((netError) =>
         errorMessage.includes(netError.toLowerCase())
      );

      return hasNetworkError || super.shouldRetry(error);
   }
}
