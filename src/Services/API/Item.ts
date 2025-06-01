import { BaseService } from "../Client";
import type { Item, ItemCategory } from "pokenode-ts";

export class ItemService extends BaseService {
   async getItem(identifier: string | number): Promise<Item> {
      this.validateIdentifier(identifier, "Item");

      return this.executeWithErrorHandling(async () => {
         return typeof identifier === "string"
            ? await this.api.item.getItemByName(identifier.toLowerCase().trim())
            : await this.api.item.getItemById(identifier);
      }, `Failed to fetch item: ${identifier}`);
   }

   async getItemList(offset: number = 0, limit: number = 20) {
      this.validatePaginationParams(offset, limit);

      return this.executeWithErrorHandling(
         async () => await this.api.item.listItems(offset, limit),
         "Failed to fetch item list"
      );
   }

   async getItemCategory(identifier: string | number): Promise<ItemCategory> {
      this.validateIdentifier(identifier, "Item Category");

      return this.executeWithErrorHandling(async () => {
         return typeof identifier === "string"
            ? await this.api.item.getItemCategoryByName(
                 identifier.toLowerCase().trim()
              )
            : await this.api.item.getItemCategoryById(identifier);
      }, `Failed to fetch item category: ${identifier}`);
   }

   async getItemCategoryList(offset: number = 0, limit: number = 20) {
      this.validatePaginationParams(offset, limit);

      return this.executeWithErrorHandling(
         async () => await this.api.item.listItemCategories(offset, limit),
         "Failed to fetch item category list"
      );
   }

   async getItemsByCategory(categoryName: string) {
      this.validateIdentifier(categoryName, "Category name");

      const category = await this.getItemCategory(categoryName);
      return category.items;
   }

   async batchGetItems(identifiers: (string | number)[]): Promise<Item[]> {
      if (!Array.isArray(identifiers) || identifiers.length === 0) {
         throw new Error("Identifiers array cannot be empty");
      }

      if (identifiers.length > 50) {
         throw new Error("Batch size cannot exceed 50 items");
      }

      return this.batchOperation(
         identifiers,
         async (id) => await this.getItem(id),
         5
      );
   }
}
