import { BaseService } from "../Client";
import type { Item, ItemCategory } from "pokenode-ts";
import type {
   ItemDetails,
   ItemCategoryDetails,
} from "../Hooks/Item/Shared/Types";

export class ItemService extends BaseService {
   // Item methods
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

   async getItemDetails(name: string): Promise<ItemDetails> {
      this.validateIdentifier(name, "Item name");

      const item = await this.getItem(name);

      return {
         ...item,
         categoryName: item.category?.name || null,
         effectShort: item.effect_entries?.[0]?.short_effect || null,
         costFormatted: item.cost ? `₽${item.cost.toLocaleString()}` : "Free",
         isConsumable:
            item.attributes?.some((attr) => attr.name === "consumable") ||
            false,
         generationName: item.generation?.name || null,
      };
   }

   // Item Category methods
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

   async getItemCategoryDetails(name: string): Promise<ItemCategoryDetails> {
      this.validateIdentifier(name, "Item Category name");

      const category = await this.getItemCategory(name);

      return {
         ...category,
         itemCount: category.items.length,
         itemNames: category.items.map((item) => item.name),
         generationName: category.generation?.name || null,
      };
   }

   // Helper methods
   async getItemsByCategory(categoryName: string) {
      this.validateIdentifier(categoryName, "Category name");

      const category = await this.getItemCategory(categoryName);
      return category.items;
   }

   async getItemAttributes(itemName: string) {
      this.validateIdentifier(itemName, "Item name");

      const item = await this.getItem(itemName);
      return item.attributes;
   }

   async getItemEffects(itemName: string) {
      this.validateIdentifier(itemName, "Item name");

      const item = await this.getItem(itemName);
      return item.effect_entries;
   }
}
