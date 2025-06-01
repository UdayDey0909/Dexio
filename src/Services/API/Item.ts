import { BaseService } from "../Client";
import type { Item, ItemCategory } from "pokenode-ts";

export class ItemService extends BaseService {
   async getItem(identifier: string | number): Promise<Item> {
      try {
         return typeof identifier === "string"
            ? await this.api.item.getItemByName(identifier.toLowerCase())
            : await this.api.item.getItemById(identifier);
      } catch (error) {
         throw new Error(`Failed to fetch item: ${error}`);
      }
   }

   async getItemList(offset: number = 0, limit: number = 20) {
      return await this.api.item.listItems(offset, limit);
   }

   async getItemCategory(identifier: string | number): Promise<ItemCategory> {
      try {
         return typeof identifier === "string"
            ? await this.api.item.getItemCategoryByName(
                 identifier.toLowerCase()
              )
            : await this.api.item.getItemCategoryById(identifier);
      } catch (error) {
         throw new Error(`Failed to fetch item category: ${error}`);
      }
   }

   async getItemCategoryList(offset: number = 0, limit: number = 20) {
      return await this.api.item.listItemCategories(offset, limit);
   }

   async getItemsByCategory(categoryName: string) {
      const category = await this.getItemCategory(categoryName);
      return category.items;
   }

   async batchGetItems(identifiers: (string | number)[]): Promise<Item[]> {
      const promises = identifiers.map((id) => this.getItem(id));
      return await Promise.all(promises);
   }
}
