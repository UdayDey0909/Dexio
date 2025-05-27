import AxiosMockAdapter from "axios-mock-adapter";
import { httpClient } from "@/Services/Client/HTTP";
import { AxiosInstance } from "axios";

jest.mock("@react-native-async-storage/async-storage");

describe("HTTPClient", () => {
   let mock: AxiosMockAdapter;
   let axios: AxiosInstance;

   beforeEach(() => {
      axios = httpClient.axios;
      mock = new AxiosMockAdapter(axios);
   });

   afterEach(() => {
      mock.reset();
   });

   it("should return successful response", async () => {
      mock.onGet("/pokemon/pikachu").reply(200, { name: "pikachu" });

      const response = await axios.get("/pokemon/pikachu");

      expect(response.status).toBe(200);
      expect(response.data.name).toBe("pikachu");
   });

   it("should retry on 500 error and eventually succeed", async () => {
      const spy = jest.spyOn(global, "setTimeout");

      mock
         .onGet("/pokemon/charizard")
         .reply(500)
         .onGet("/pokemon/charizard")
         .reply(500)
         .onGet("/pokemon/charizard")
         .reply(200, { name: "charizard" });

      const response = await axios.get("/pokemon/charizard");

      expect(response.status).toBe(200);
      expect(response.data.name).toBe("charizard");

      spy.mockRestore();
   });

   it("should throw formatted APIError on network error", async () => {
      mock.onGet("/pokemon/missingno").networkError();

      await expect(axios.get("/pokemon/missingno")).rejects.toEqual(
         expect.objectContaining({
            code: "NETWORK_ERROR",
            retryable: true,
         })
      );
   });

   it("should expose pokeClient", () => {
      const client = httpClient.client;
      expect(client).toBeDefined();
      expect(typeof client.getPokemonByName).toBe("function");
   });
});
