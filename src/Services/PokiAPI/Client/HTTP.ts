import axios, { AxiosInstance, AxiosResponse } from "axios";
import { PokemonClient } from "pokenode-ts";

interface APIError {
   code: string;
   message: string;
   details?: string;
   retryable: boolean;
}

export class HTTPClient {
   private readonly axiosInstance: AxiosInstance;
   private readonly pokeClient: PokemonClient;

   constructor() {
      this.axiosInstance = axios.create({
         baseURL: "https://pokeapi.co/api/v2/",
         timeout: 10000,
         headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
         },
      });

      this.pokeClient = new PokemonClient();
      this.setupInterceptors();
   }

   /**
    * Setup request and response interceptors
    */
   private setupInterceptors(): void {
      this.axiosInstance.interceptors.request.use(
         (config) => {
            if (process.env.NODE_ENV === "development") {
               console.log(
                  `[API Request] ${config.method?.toUpperCase()} ${config.url}`
               );
            }
            return config;
         },
         (error) => {
            console.error("[API Request Error]", error);
            return Promise.reject(this.formatError(error));
         }
      );

      this.axiosInstance.interceptors.response.use(
         (response: AxiosResponse) => {
            if (process.env.NODE_ENV === "development") {
               console.log(
                  `[API Response] ${response.status} ${response.config.url}`
               );
            }
            return response;
         },
         async (error) => {
            const config = error.config;

            // Retry logic for server errors
            if (error.response?.status >= 500 && config && !config._retry) {
               config._retry = true;
               config._retryCount = config._retryCount || 0;

               if (config._retryCount < 3) {
                  config._retryCount++;
                  const delay = Math.pow(2, config._retryCount) * 1000;

                  if (process.env.NODE_ENV === "development") {
                     console.log(
                        `[API Retry] Attempt ${config._retryCount} after ${delay}ms`
                     );
                  }

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

   /**
    * Convert Axios or network error into a custom APIError
    */
   private formatError(error: any): APIError {
      return {
         code: error.response?.status?.toString() || "NETWORK_ERROR",
         message: error.message || "An unexpected error occurred",
         details: error.response?.data?.message,
         retryable: error.response?.status >= 500 || !error.response,
      };
   }

   /**
    * Axios instance for manual REST calls (optional)
    */
   public get axios(): AxiosInstance {
      return this.axiosInstance;
   }

   /**
    * Full-featured PokeAPI client
    */
   public get client(): PokemonClient {
      return this.pokeClient;
   }
}

export const httpClient = new HTTPClient();
