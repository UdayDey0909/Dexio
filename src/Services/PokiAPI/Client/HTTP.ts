import axios, { AxiosInstance, AxiosResponse } from "axios";
import { PokemonClient } from "pokenode-ts";
import { APIError } from "./Types";

/**
 * HTTPClient wraps Axios and Pokenode-TS for unified API communication with PokeAPI.
 * - Automatically configures base URL, headers, and timeout.
 * - Logs requests/responses in development mode.
 * - Implements automatic retry on server errors.
 * - Exposes both raw Axios instance and PokeAPI client.
 */
export class HTTPClient {
   private readonly axiosInstance: AxiosInstance;
   private readonly pokeClient: PokemonClient;

   /**
    * Initializes the HTTPClient with Axios and PokeAPI client.
    */
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
    * Sets up request and response interceptors for logging and error handling.
    * - Logs request and response info in development mode.
    * - Adds automatic retry with exponential backoff for server errors (status ≥ 500).
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
    * Converts an Axios error into a standardized `APIError` object.
    *
    * @param error - Axios or network error object
    * @returns Structured `APIError` with message, code, and retry hint
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
    * Returns the configured Axios instance.
    * Useful for making manual REST requests.
    */
   public get axios(): AxiosInstance {
      return this.axiosInstance;
   }

   /**
    * Returns the Pokenode-TS `PokemonClient` instance.
    * Provides a full-featured wrapper over the PokeAPI.
    */
   public get client(): PokemonClient {
      return this.pokeClient;
   }
}

/**
 * Singleton instance of `HTTPClient` for app-wide usage.
 */
export const httpClient = new HTTPClient();
