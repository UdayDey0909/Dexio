// shared/services/api/client/cache.ts
import { QueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

// Create a QueryClient instance with default settings
const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         staleTime: 5 * 60 * 1000, // 5 minutes
         retry: 3,
         retryDelay: (attemptIndex) =>
            Math.min(1000 * 2 ** attemptIndex, 30000),
         refetchOnWindowFocus: true,
         refetchOnReconnect: true,
         refetchOnMount: true,
      },
      mutations: {
         retry: 1,
      },
   },
});

// Enable offline cache persistence using AsyncStorage
const asyncStoragePersister = createAsyncStoragePersister({
   storage: AsyncStorage,
   key: "pokemon-app-cache",
   serialize: JSON.stringify,
   deserialize: JSON.parse,
});

export { queryClient, asyncStoragePersister };
