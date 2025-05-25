import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { PokemonClient } from "pokenode-ts";

interface APIError {
   code: string;
   message: string;
   details?: string;
   retryable: boolean;
}

class HTTPClient {
   private axiosInstance: AxiosInstance;
   private pokemonClient: PokemonClient;

   constructor() {
      this.axiosInstance = axios.create({
         baseURL: "https://pokeapi.co/api/v2/",
         timeout: 10000,
         headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
         },
      });

      this.pokemonClient = new PokemonClient();
      this.setupInterceptors();
   }

   private setupInterceptors(): void {
      // Request interceptor
      this.axiosInstance.interceptors.request.use(
         (config) => {
            console.log(
               `[API Request] ${config.method?.toUpperCase()} ${config.url}`
            );
            return config;
         },
         (error) => {
            console.error("[API Request Error]", error);
            return Promise.reject(error);
         }
      );

      // Response interceptor
      this.axiosInstance.interceptors.response.use(
         (response: AxiosResponse) => {
            console.log(
               `[API Response] ${response.status} ${response.config.url}`
            );
            return response;
         },
         async (error) => {
            const config = error.config;

            // Retry logic with exponential backoff
            if (error.response?.status >= 500 && config && !config._retry) {
               config._retry = true;
               config._retryCount = config._retryCount || 0;

               if (config._retryCount < 3) {
                  config._retryCount++;
                  const delay = Math.pow(2, config._retryCount) * 1000;
                  console.log(
                     `[API Retry] Attempt ${config._retryCount} after ${delay}ms`
                  );

                  await new Promise((resolve) => setTimeout(resolve, delay));
                  return this.axiosInstance(config);
               }
            }

            console.error(
               "[API Response Error]",
               error.response?.status,
               error.message
            );
            return Promise.reject(this.formatError(error));
         }
      );
   }

   private formatError(error: any): APIError {
      return {
         code: error.response?.status?.toString() || "NETWORK_ERROR",
         message: error.message || "An unexpected error occurred",
         details: error.response?.data?.message,
         retryable: error.response?.status >= 500 || !error.response,
      };
   }

   public get axios(): AxiosInstance {
      return this.axiosInstance;
   }

   public get pokeClient(): PokemonClient {
      return this.pokemonClient;
   }
}

export const httpClient = new HTTPClient();
