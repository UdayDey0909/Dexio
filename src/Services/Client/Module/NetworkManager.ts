import NetInfo from "@react-native-community/netinfo";

/**
 * NetworkManager handles network connectivity monitoring for React Native Android applications.
 * Uses @react-native-community/netinfo to track connection status and provide connectivity utilities.
 *
 * @class NetworkManager
 * @example
 * ```typescript
 * const networkManager = new NetworkManager();
 *
 * // Check if currently online
 * if (networkManager.isOnline()) {
 *   console.log('Device is connected');
 * }
 *
 * // Verify connection with async check
 * const isConnected = await networkManager.checkConnection();
 *
 * // Clean up when done
 * networkManager.cleanup();
 * ```
 */
export class NetworkManager {
   /**
    * Current connection status cached from NetInfo
    * @private
    * @type {boolean}
    * @default true
    */
   private isConnected: boolean = true;

   /**
    * Unsubscribe function for NetInfo event listener
    * @private
    * @type {(() => void) | undefined}
    */
   private unsubscribe?: () => void;

   /**
    * Creates a new NetworkManager instance and initializes NetInfo monitoring.
    * Automatically starts listening for network state changes.
    *
    * @constructor
    * @throws {Error} Logs warning if NetInfo initialization fails but continues with fallback
    */
   constructor() {
      this.initializeNetInfo();
   }

   /**
    * Initializes NetInfo event listener to monitor network state changes.
    * Sets up automatic updates to the internal connection status.
    * Gracefully handles initialization failures with fallback to connected state.
    *
    * @private
    * @returns {void}
    * @throws {Error} Logs warning on NetInfo setup failure but doesn't throw
    */
   private initializeNetInfo(): void {
      try {
         this.unsubscribe = NetInfo.addEventListener((state) => {
            this.isConnected = state?.isConnected ?? false;
         });
      } catch (error) {
         console.warn("NetInfo initialization failed:", error);
         this.isConnected = true;
      }
   }

   /**
    * Cleans up the NetInfo event listener to prevent memory leaks.
    * Should be called when the NetworkManager instance is no longer needed.
    * Safe to call multiple times.
    *
    * @public
    * @returns {void}
    * @example
    * ```typescript
    * // In a React component's cleanup
    * useEffect(() => {
    *   const networkManager = new NetworkManager();
    *   return () => {
    *     networkManager.cleanup();
    *   };
    * }, []);
    * ```
    */
   cleanup(): void {
      if (this.unsubscribe) {
         this.unsubscribe();
         this.unsubscribe = undefined;
      }
   }

   /**
    * Performs an active network connectivity check by fetching current NetInfo state.
    * This method actively queries the network state rather than relying on cached status.
    * Updates the internal connection status based on the fresh network state.
    *
    * @public
    * @async
    * @returns {Promise<boolean>} Promise that resolves to true if connected, false otherwise
    * @throws {Error} Logs warning on network check failure but returns cached status
    *
    * @example
    * ```typescript
    * // Check connection before making API calls
    * const isConnected = await networkManager.checkConnection();
    * if (isConnected) {
    *   // Safe to make network requests
    *   await fetchPokemonData();
    * } else {
    *   // Handle offline state
    *   showOfflineMessage();
    * }
    * ```
    */
   async checkConnection(): Promise<boolean> {
      try {
         const state = await NetInfo.fetch();
         this.isConnected = state?.isConnected ?? false;
         return this.isConnected;
      } catch (error) {
         console.warn("Network check failed:", error);
         return this.isConnected;
      }
   }

   /**
    * Returns the current cached network connection status.
    * This is a synchronous method that returns the last known connection state
    * without performing an active network check.
    *
    * @public
    * @returns {boolean} true if the device appears to be online, false otherwise
    *
    * @example
    * ```typescript
    * // Quick synchronous check
    * if (networkManager.isOnline()) {
    *   // Show online UI
    *   enableNetworkFeatures();
    * } else {
    *   // Show offline UI
    *   displayCachedContent();
    * }
    * ```
    */
   isOnline(): boolean {
      return this.isConnected;
   }
}
