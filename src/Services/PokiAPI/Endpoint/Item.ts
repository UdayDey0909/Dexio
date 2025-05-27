// src/Services/PokiAPI/Endpoints/ItemEndpoints.ts
import { BaseEndpoint } from "./Common";
import { NamedAPIResourceList } from "../Interface/Common";

/**
 * Item-specific endpoints
 */
export class ItemEndpoints extends BaseEndpoint {
   /**
    * Get item by ID or name
    */
   async getItem(id: number | string) {
      return this.fetchResource("item", id);
   }

   /**
    * Get list of items
    */
   async getItemsList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("item", params);
   }

   /**
    * Get item attribute by ID or name
    */
   async getItemAttribute(id: number | string) {
      return this.fetchResource("item-attribute", id);
   }

   /**
    * Get list of item attributes
    */
   async getItemAttributesList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("item-attribute", params);
   }

   /**
    * Get item category by ID or name
    */
   async getItemCategory(id: number | string) {
      return this.fetchResource("item-category", id);
   }

   /**
    * Get list of item categories
    */
   async getItemCategoriesList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("item-category", params);
   }

   /**
    * Get item fling effect by ID or name
    */
   async getItemFlingEffect(id: number | string) {
      return this.fetchResource("item-fling-effect", id);
   }

   /**
    * Get list of item fling effects
    */
   async getItemFlingEffectsList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("item-fling-effect", params);
   }

   /**
    * Get item pocket by ID or name
    */
   async getItemPocket(id: number | string) {
      return this.fetchResource("item-pocket", id);
   }

   /**
    * Get list of item pockets
    */
   async getItemPocketsList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("item-pocket", params);
   }

   /**
    * Search items by name
    */
   async searchItems(
      query: string,
      limit: number = 10
   ): Promise<NamedAPIResourceList> {
      const allItems = await this.getItemsList({ limit: 2000, offset: 0 });

      const filteredResults = allItems.results.filter((item) =>
         item.name.toLowerCase().includes(query.toLowerCase())
      );

      return {
         count: filteredResults.length,
         next: null,
         previous: null,
         results: filteredResults.slice(0, limit),
      };
   }
}
