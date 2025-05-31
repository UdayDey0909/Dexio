// src/Services/Client/HTTP.ts
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
import { APIError, HTTPConfig } from "./Types";

/**
 * Simplified HTTP client for solo development
 */
export class HTTP {
   private readonly axiosInstance: AxiosInstance;
   private readonly enableLogging: boolean;

   // PokeAPI clients
   public readonly pokemon: PokemonClient;
   public readonly move: MoveClient;
   public readonly item: ItemClient;
   public readonly location: LocationClient;
   public readonly berry: BerryClient;
   public readonly evolution: EvolutionClient;
   public readonly game: GameClient;

   constructor(config: HTTPConfig = {}) {
      this.enableLogging = config.enableLogging ?? __DEV__;

      // Basic axios setup
      this.axiosInstance = axios.create({
         baseURL: "https://pokeapi.co/api/v2/",
         timeout: config.timeout || 10000,
         headers: { Accept: "application/json" },
      });

      // Initialize all PokeAPI clients
      this.pokemon = new PokemonClient();
      this.move = new MoveClient();
      this.item = new ItemClient();
      this.location = new LocationClient();
      this.berry = new BerryClient();
      this.evolution = new EvolutionClient();
      this.game = new GameClient();

      this.setupErrorHandling();
   }

   private setupErrorHandling(): void {
      this.axiosInstance.interceptors.response.use(
         (response) => {
            if (this.enableLogging) {
               console.log(`✅ ${response.config.url}`);
            }
            return response;
         },
         (error) => {
            const apiError = this.formatError(error);
            if (this.enableLogging) {
               console.error(`❌ ${error.config?.url}:`, apiError.message);
            }
            return Promise.reject(apiError);
         }
      );
   }

   private formatError(error: any): APIError {
      if (isAxiosError(error)) {
         const status = error.response?.status;

         return {
            code: status?.toString() || "NETWORK_ERROR",
            message: this.getSimpleErrorMessage(error, status),
            retryable: !status || status >= 500 || status === 429,
         };
      }

      return {
         code: "UNKNOWN_ERROR",
         message: error.message || "Something went wrong",
         retryable: false,
      };
   }

   private getSimpleErrorMessage(error: any, status?: number): string {
      if (!status) {
         return "Check your internet connection";
      }

      switch (status) {
         case 404:
            return "Not found";
         case 429:
            return "Too many requests, please wait";
         case 500:
            return "Server error, try again";
         default:
            return error.message || `Error ${status}`;
      }
   }

   /**
    * Quick health check
    */
   public async isOnline(): Promise<boolean> {
      try {
         await this.pokemon.getPokemonById(1);
         return true;
      } catch {
         return false;
      }
   }

   /**
    * Get raw axios instance if needed
    */
   public get axios(): AxiosInstance {
      return this.axiosInstance;
   }
}

/**
 * Default HTTP client instance
 */
export const http = new HTTP();

/**
 * Quick factory for custom configs
 */
export const createHTTP = (config?: HTTPConfig) => new HTTP(config);
