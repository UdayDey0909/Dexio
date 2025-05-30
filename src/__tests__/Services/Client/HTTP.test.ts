import axios, { AxiosInstance, AxiosError } from "axios";
import {
   PokemonClient,
   MoveClient,
   ItemClient,
   LocationClient,
   BerryClient,
   EvolutionClient,
   GameClient,
} from "pokenode-ts";
import {
   HTTPClient,
   createHTTPClient,
   httpClient,
} from "@/Services/Client/HTTP";
import { APIError } from "@/Services/Client/Types";

// Mock axios and pokenode-ts
jest.mock("axios");
jest.mock("pokenode-ts");

const mockedAxios = axios as jest.Mocked<typeof axios>;
const MockedPokemonClient = PokemonClient as jest.MockedClass<
   typeof PokemonClient
>;

describe("HTTPClient", () => {
   let client: HTTPClient;
   let mockAxiosInstance: jest.Mocked<AxiosInstance>;
   let mockPokemonClient: jest.Mocked<PokemonClient>;

   beforeEach(() => {
      mockAxiosInstance = {
         create: jest.fn(),
         interceptors: {
            response: {
               use: jest.fn(),
            },
         },
         get: jest.fn(),
         post: jest.fn(),
         put: jest.fn(),
         delete: jest.fn(),
      } as any;

      mockPokemonClient = {
         getPokemonById: jest.fn(),
      } as any;

      mockedAxios.create.mockReturnValue(mockAxiosInstance);
      MockedPokemonClient.mockImplementation(() => mockPokemonClient);

      client = new HTTPClient();
   });

   afterEach(() => {
      jest.clearAllMocks();
   });

   describe("constructor", () => {
      it("should create axios instance with default config", () => {
         expect(mockedAxios.create).toHaveBeenCalledWith({
            baseURL: "https://pokeapi.co/api/v2/",
            timeout: 10000,
            headers: {
               Accept: "application/json",
               "Content-Type": "application/json",
            },
         });
      });

      it("should create axios instance with custom config", () => {
         const customConfig = {
            baseURL: "https://custom-api.com/",
            timeout: 5000,
         };

         new HTTPClient(customConfig);

         expect(mockedAxios.create).toHaveBeenCalledWith({
            baseURL: "https://custom-api.com/",
            timeout: 5000,
            headers: {
               Accept: "application/json",
               "Content-Type": "application/json",
            },
         });
      });

      it("should initialize all pokenode-ts clients", () => {
         expect(PokemonClient).toHaveBeenCalled();
         expect(MoveClient).toHaveBeenCalled();
         expect(ItemClient).toHaveBeenCalled();
         expect(LocationClient).toHaveBeenCalled();
         expect(BerryClient).toHaveBeenCalled();
         expect(EvolutionClient).toHaveBeenCalled();
         expect(GameClient).toHaveBeenCalled();
      });

      it("should setup error handling", () => {
         expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
      });
   });

   describe("client getters", () => {
      it("should return axios instance", () => {
         expect(client.axios).toBe(mockAxiosInstance);
      });

      it("should return pokemon client", () => {
         expect(client.pokemon).toBe(mockPokemonClient);
      });

      it("should return all client instances", () => {
         expect(client.move).toBeDefined();
         expect(client.item).toBeDefined();
         expect(client.location).toBeDefined();
         expect(client.berry).toBeDefined();
         expect(client.evolution).toBeDefined();
         expect(client.game).toBeDefined();
      });
   });

   describe("error formatting", () => {
      let errorHandler: (error: any) => Promise<any>;

      beforeEach(() => {
         // Get the error handler from the interceptor setup
         const interceptorCall =
            mockAxiosInstance.interceptors.response.use.mock.calls[0];
         errorHandler = interceptorCall[1];
      });

      it("should format axios errors correctly", async () => {
         const axiosError: Partial<AxiosError> = {
            isAxiosError: true,
            message: "Request failed",
            response: {
               status: 404,
               data: { message: "Pokemon not found" },
            } as any,
         };

         // Mock axios.isAxiosError
         (axios.isAxiosError as jest.Mock).mockReturnValue(true);

         const expectedError: APIError = {
            code: "404",
            message: "Request failed",
            details: "Pokemon not found",
            retryable: false,
         };

         await expect(errorHandler(axiosError)).rejects.toEqual(expectedError);
      });

      it("should handle network errors", async () => {
         const networkError: Partial<AxiosError> = {
            isAxiosError: true,
            message: "Network Error",
            response: undefined,
         };

         (axios.isAxiosError as jest.Mock).mockReturnValue(true);

         const expectedError: APIError = {
            code: "NETWORK_ERROR",
            message: "Network Error",
            details: undefined,
            retryable: true,
         };

         await expect(errorHandler(networkError)).rejects.toEqual(
            expectedError
         );
      });

      it("should handle server errors as retryable", async () => {
         const serverError: Partial<AxiosError> = {
            isAxiosError: true,
            message: "Internal Server Error",
            response: {
               status: 500,
               data: { message: "Server is down" },
            } as any,
         };

         (axios.isAxiosError as jest.Mock).mockReturnValue(true);

         const expectedError: APIError = {
            code: "500",
            message: "Internal Server Error",
            details: "Server is down",
            retryable: true,
         };

         await expect(errorHandler(serverError)).rejects.toEqual(expectedError);
      });

      it("should handle non-axios errors", async () => {
         const genericError = new Error("Generic error");

         (axios.isAxiosError as jest.Mock).mockReturnValue(false);

         const expectedError: APIError = {
            code: "UNKNOWN_ERROR",
            message: "Generic error",
            details: undefined,
            retryable: false,
         };

         await expect(errorHandler(genericError)).rejects.toEqual(
            expectedError
         );
      });

      it("should handle errors without message", async () => {
         const errorWithoutMessage = {};

         (axios.isAxiosError as jest.Mock).mockReturnValue(false);

         const expectedError: APIError = {
            code: "UNKNOWN_ERROR",
            message: "An unexpected error occurred",
            details: undefined,
            retryable: false,
         };

         await expect(errorHandler(errorWithoutMessage)).rejects.toEqual(
            expectedError
         );
      });
   });

   describe("healthCheck", () => {
      it("should return true when API is healthy", async () => {
         mockPokemonClient.getPokemonById.mockResolvedValue({} as any);

         const result = await client.healthCheck();

         expect(result).toBe(true);
         expect(mockPokemonClient.getPokemonById).toHaveBeenCalledWith(1);
      });

      it("should return false when API is unhealthy", async () => {
         mockPokemonClient.getPokemonById.mockRejectedValue(
            new Error("API Down")
         );

         const result = await client.healthCheck();

         expect(result).toBe(false);
         expect(mockPokemonClient.getPokemonById).toHaveBeenCalledWith(1);
      });
   });
});

describe("Factory Functions", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   describe("createHTTPClient", () => {
      it("should create HTTPClient with default config", () => {
         const client = createHTTPClient();

         expect(client).toBeInstanceOf(HTTPClient);
         expect(mockedAxios.create).toHaveBeenCalled();
      });

      it("should create HTTPClient with custom config", () => {
         const config = { baseURL: "https://test.com", timeout: 1000 };
         const client = createHTTPClient(config);

         expect(client).toBeInstanceOf(HTTPClient);
      });
   });

   describe("httpClient singleton", () => {
      it("should export a default httpClient instance", () => {
         expect(httpClient).toBeInstanceOf(HTTPClient);
      });
   });
});

describe("Error Type Guards", () => {
   // Test the retryable logic for different status codes
   describe("retryable determination", () => {
      let errorHandler: (error: any) => Promise<any>;
      let client: HTTPClient;

      beforeEach(() => {
         const mockAxiosInstance = {
            interceptors: {
               response: {
                  use: jest.fn(),
               },
            },
         } as any;

         mockedAxios.create.mockReturnValue(mockAxiosInstance);
         client = new HTTPClient();

         const interceptorCall =
            mockAxiosInstance.interceptors.response.use.mock.calls[0];
         errorHandler = interceptorCall[1];
      });

      it("should mark 4xx errors as non-retryable", async () => {
         const clientError: Partial<AxiosError> = {
            isAxiosError: true,
            message: "Bad Request",
            response: { status: 400 } as any,
         };

         (axios.isAxiosError as jest.Mock).mockReturnValue(true);

         try {
            await errorHandler(clientError);
         } catch (error) {
            expect((error as APIError).retryable).toBe(false);
         }
      });

      it("should mark 5xx errors as retryable", async () => {
         const serverError: Partial<AxiosError> = {
            isAxiosError: true,
            message: "Internal Server Error",
            response: { status: 500 } as any,
         };

         (axios.isAxiosError as jest.Mock).mockReturnValue(true);

         try {
            await errorHandler(serverError);
         } catch (error) {
            expect((error as APIError).retryable).toBe(true);
         }
      });

      it("should mark network errors as retryable", async () => {
         const networkError: Partial<AxiosError> = {
            isAxiosError: true,
            message: "Network Error",
            response: undefined,
         };

         (axios.isAxiosError as jest.Mock).mockReturnValue(true);

         try {
            await errorHandler(networkError);
         } catch (error) {
            expect((error as APIError).retryable).toBe(true);
         }
      });
   });
});
