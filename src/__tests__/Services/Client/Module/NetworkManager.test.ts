import { NetworkManager } from "@/Services/Client/Module/NetworkManager";
import NetInfo from "@react-native-community/netinfo";

// Mock the entire NetInfo module
jest.mock("@react-native-community/netinfo", () => ({
   addEventListener: jest.fn(),
   fetch: jest.fn(),
}));

describe("NetworkManager", () => {
   let networkManager: NetworkManager;
   let mockUnsubscribe: jest.Mock;

   beforeEach(() => {
      jest.clearAllMocks();

      mockUnsubscribe = jest.fn();

      // Set up mock implementations
      (NetInfo.addEventListener as jest.Mock).mockReturnValue(mockUnsubscribe);
      (NetInfo.fetch as jest.Mock).mockResolvedValue({
         isConnected: true,
         type: "wifi",
         details: {},
      });

      networkManager = new NetworkManager();
   });

   afterEach(() => {
      networkManager.cleanup();
   });

   describe("Constructor", () => {
      it("should initialize NetInfo listener successfully", () => {
         expect(NetInfo.addEventListener).toHaveBeenCalledWith(
            expect.any(Function)
         );
      });

      it("should handle NetInfo initialization failure gracefully", () => {
         const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

         (NetInfo.addEventListener as jest.Mock).mockImplementation(() => {
            throw new Error("NetInfo initialization failed");
         });

         const manager = new NetworkManager();

         expect(consoleSpy).toHaveBeenCalledWith(
            "NetInfo initialization failed:",
            expect.any(Error)
         );
         expect(manager.isOnline()).toBe(true); // Falls back to true

         consoleSpy.mockRestore();
         manager.cleanup();
      });

      it("should set initial connection state from NetInfo callback", () => {
         let netInfoCallback: (state: any) => void;

         (NetInfo.addEventListener as jest.Mock).mockImplementation(
            (callback) => {
               netInfoCallback = callback;
               return mockUnsubscribe;
            }
         );

         const manager = new NetworkManager();

         // Simulate NetInfo callback with connected state
         netInfoCallback!({ isConnected: true });
         expect(manager.isOnline()).toBe(true);

         // Simulate NetInfo callback with disconnected state
         netInfoCallback!({ isConnected: false });
         expect(manager.isOnline()).toBe(false);

         // Simulate NetInfo callback with null isConnected
         netInfoCallback!({ isConnected: null });
         expect(manager.isOnline()).toBe(false);

         manager.cleanup();
      });
   });

   describe("isOnline", () => {
      it("should return true by default", () => {
         expect(networkManager.isOnline()).toBe(true);
      });

      it("should return current connection state", () => {
         let netInfoCallback: (state: any) => void;

         (NetInfo.addEventListener as jest.Mock).mockImplementation(
            (callback) => {
               netInfoCallback = callback;
               return mockUnsubscribe;
            }
         );

         const manager = new NetworkManager();

         // Test connected state
         netInfoCallback!({ isConnected: true });
         expect(manager.isOnline()).toBe(true);

         // Test disconnected state
         netInfoCallback!({ isConnected: false });
         expect(manager.isOnline()).toBe(false);

         manager.cleanup();
      });
   });

   describe("checkConnection", () => {
      it("should fetch current network state and return connection status", async () => {
         (NetInfo.fetch as jest.Mock).mockResolvedValue({
            isConnected: true,
            type: "cellular",
         });

         const isConnected = await networkManager.checkConnection();

         expect(NetInfo.fetch).toHaveBeenCalled();
         expect(isConnected).toBe(true);
         expect(networkManager.isOnline()).toBe(true);
      });

      it("should handle null isConnected value", async () => {
         (NetInfo.fetch as jest.Mock).mockResolvedValue({
            isConnected: null,
            type: "none",
         });

         const isConnected = await networkManager.checkConnection();

         expect(isConnected).toBe(false);
         expect(networkManager.isOnline()).toBe(false);
      });

      it("should handle NetInfo.fetch failure gracefully", async () => {
         const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

         (NetInfo.fetch as jest.Mock).mockRejectedValue(
            new Error("Fetch failed")
         );

         const isConnected = await networkManager.checkConnection();

         expect(consoleSpy).toHaveBeenCalledWith(
            "Network check failed:",
            expect.any(Error)
         );
         expect(isConnected).toBe(true); // Falls back to current state

         consoleSpy.mockRestore();
      });

      it("should update internal state based on fetch result", async () => {
         // Initially connected
         (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: true });
         await networkManager.checkConnection();
         expect(networkManager.isOnline()).toBe(true);

         // Then disconnected
         (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: false });
         await networkManager.checkConnection();
         expect(networkManager.isOnline()).toBe(false);
      });

      it("should handle concurrent checkConnection calls", async () => {
         (NetInfo.fetch as jest.Mock)
            .mockResolvedValueOnce({ isConnected: true })
            .mockResolvedValueOnce({ isConnected: false });

         const [result1, result2] = await Promise.all([
            networkManager.checkConnection(),
            networkManager.checkConnection(),
         ]);

         expect(result1).toBe(true);
         expect(result2).toBe(false);
         expect(NetInfo.fetch).toHaveBeenCalledTimes(2);
      });
   });

   describe("cleanup", () => {
      it("should call unsubscribe function if it exists", () => {
         networkManager.cleanup();

         expect(mockUnsubscribe).toHaveBeenCalled();
      });

      it("should handle cleanup when unsubscribe is undefined", () => {
         (NetInfo.addEventListener as jest.Mock).mockReturnValue(undefined);
         const manager = new NetworkManager();

         expect(() => manager.cleanup()).not.toThrow();
      });

      it("should prevent multiple cleanup calls", () => {
         networkManager.cleanup();
         networkManager.cleanup();

         expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
      });

      it("should handle cleanup when NetInfo fails to initialize", () => {
         const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

         (NetInfo.addEventListener as jest.Mock).mockImplementation(() => {
            throw new Error("Init failed");
         });

         const manager = new NetworkManager();

         expect(() => manager.cleanup()).not.toThrow();

         consoleSpy.mockRestore();
      });
   });

   describe("Edge cases", () => {
      it("should handle undefined network state in callback", () => {
         let netInfoCallback: (state: any) => void;

         (NetInfo.addEventListener as jest.Mock).mockImplementation(
            (callback) => {
               netInfoCallback = callback;
               return mockUnsubscribe;
            }
         );

         const manager = new NetworkManager();

         netInfoCallback!(undefined as any);
         expect(manager.isOnline()).toBe(false);

         manager.cleanup();
      });

      it("should handle network state changes during cleanup", () => {
         let netInfoCallback: (state: any) => void;

         (NetInfo.addEventListener as jest.Mock).mockImplementation(
            (callback) => {
               netInfoCallback = callback;
               return mockUnsubscribe;
            }
         );

         const manager = new NetworkManager();
         manager.cleanup();

         // This should not cause errors even after cleanup
         expect(() => netInfoCallback!({ isConnected: true })).not.toThrow();
      });

      it("should maintain state consistency during rapid state changes", () => {
         let netInfoCallback: (state: any) => void;

         (NetInfo.addEventListener as jest.Mock).mockImplementation(
            (callback) => {
               netInfoCallback = callback;
               return mockUnsubscribe;
            }
         );

         const manager = new NetworkManager();

         // Rapid state changes
         netInfoCallback!({ isConnected: true });
         netInfoCallback!({ isConnected: false });
         netInfoCallback!({ isConnected: true });
         netInfoCallback!({ isConnected: false });

         expect(manager.isOnline()).toBe(false);

         manager.cleanup();
      });
   });
});
