import axios, { AxiosInstance, isAxiosError } from "axios";
import {
   PokemonClient,
   MoveClient,
   ItemClient,
   LocationClient,
   BerryClient,
   EvolutionClient,
   GameClient,
} from "pokenode-ts";
import { APIError } from "./Types";

/**
 * Simple HTTP client configuration
 */
interface HTTPClientConfig {
   baseURL?: string;
   timeout?: number;
}

/**
 * Simplified HTTPClient - removes over-engineering while keeping essential features
 */
export class HTTPClient {
   private readonly axiosInstance: AxiosInstance;
   private readonly pokemonClient: PokemonClient;
   private readonly moveClient: MoveClient;
   private readonly itemClient: ItemClient;
   private readonly locationClient: LocationClient;
   private readonly berryClient: BerryClient;
   private readonly evolutionClient: EvolutionClient;
   private readonly gameClient: GameClient;

   constructor(config: HTTPClientConfig = {}) {
      this.axiosInstance = axios.create({
         baseURL: config.baseURL || "https://pokeapi.co/api/v2/",
         timeout: config.timeout || 10000,
         headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
         },
      });

      // Initialize Pokenode-TS clients
      this.pokemonClient = new PokemonClient();
      this.moveClient = new MoveClient();
      this.itemClient = new ItemClient();
      this.locationClient = new LocationClient();
      this.berryClient = new BerryClient();
      this.evolutionClient = new EvolutionClient();
      this.gameClient = new GameClient();

      this.setupErrorHandling();
   }

   private setupErrorHandling(): void {
      this.axiosInstance.interceptors.response.use(
         (response) => response,
         (error) => {
            return Promise.reject(this.formatError(error));
         }
      );
   }

   private formatError(error: any): APIError {
      if (isAxiosError(error)) {
         return {
            code: error.response?.status?.toString() || "NETWORK_ERROR",
            message: error.message || "An unexpected error occurred",
            details: error.response?.data?.message,
            retryable: (error.response?.status ?? 0) >= 500 || !error.response,
         };
      }

      return {
         code: "UNKNOWN_ERROR",
         message: error.message || "An unexpected error occurred",
         details: undefined,
         retryable: false,
      };
   }

   // Simple getters for clients
   public get axios(): AxiosInstance {
      return this.axiosInstance;
   }

   public get pokemon(): PokemonClient {
      return this.pokemonClient;
   }

   public get move(): MoveClient {
      return this.moveClient;
   }

   public get item(): ItemClient {
      return this.itemClient;
   }

   public get location(): LocationClient {
      return this.locationClient;
   }

   public get berry(): BerryClient {
      return this.berryClient;
   }

   public get evolution(): EvolutionClient {
      return this.evolutionClient;
   }

   public get game(): GameClient {
      return this.gameClient;
   }

   // Basic health check - simplified
   public async healthCheck(): Promise<boolean> {
      try {
         await this.pokemonClient.getPokemonById(1);
         return true;
      } catch {
         return false;
      }
   }
}

// Factory function and singleton
export function createHTTPClient(config?: HTTPClientConfig): HTTPClient {
   return new HTTPClient(config);
}

export const httpClient = createHTTPClient();
