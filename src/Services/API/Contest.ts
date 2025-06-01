import { BaseService } from "../Client";
import type {
   ContestType,
   ContestEffect,
   SuperContestEffect,
} from "pokenode-ts";

export class ContestService extends BaseService {
   // Note: Contest endpoints might not be available in pokenode-ts
   // This is a corrected version based on actual API structure

   async getContestType(identifier: string | number): Promise<ContestType> {
      this.validateIdentifier(identifier, "Contest Type");

      return this.executeWithErrorHandling(async () => {
         // Contest types are in the contest namespace, not pokemon
         return typeof identifier === "string"
            ? await this.api.contest.getContestTypeByName(
                 identifier.toLowerCase().trim()
              )
            : await this.api.contest.getContestTypeById(identifier);
      }, `Failed to fetch contest type: ${identifier}`);
   }

   async getContestTypeList(offset: number = 0, limit: number = 20) {
      this.validatePaginationParams(offset, limit);

      return this.executeWithErrorHandling(
         async () => await this.api.contest.listContestTypes(offset, limit),
         "Failed to fetch contest type list"
      );
   }

   async getContestEffect(id: number): Promise<ContestEffect> {
      this.validateIdentifier(id, "Contest Effect");

      return this.executeWithErrorHandling(
         async () => await this.api.contest.getContestEffectById(id),
         `Failed to fetch contest effect: ${id}`
      );
   }

   async getContestEffectList(offset: number = 0, limit: number = 20) {
      this.validatePaginationParams(offset, limit);

      return this.executeWithErrorHandling(
         async () => await this.api.contest.listContestEffects(offset, limit),
         "Failed to fetch contest effect list"
      );
   }

   async getSuperContestEffect(id: number): Promise<SuperContestEffect> {
      this.validateIdentifier(id, "Super Contest Effect");

      return this.executeWithErrorHandling(
         async () => await this.api.contest.getSuperContestEffectById(id),
         `Failed to fetch super contest effect: ${id}`
      );
   }

   async getSuperContestEffectList(offset: number = 0, limit: number = 20) {
      this.validatePaginationParams(offset, limit);

      return this.executeWithErrorHandling(
         async () =>
            await this.api.contest.listSuperContestEffects(offset, limit),
         "Failed to fetch super contest effect list"
      );
   }

   // Enhanced utility methods

   async batchGetContestEffects(ids: number[]): Promise<ContestEffect[]> {
      if (!Array.isArray(ids) || ids.length === 0) {
         throw new Error("IDs array cannot be empty");
      }

      if (ids.length > 20) {
         throw new Error("Batch size cannot exceed 20 contest effects");
      }

      return this.batchOperation(
         ids,
         async (id) => await this.getContestEffect(id),
         3
      );
   }

   async batchGetSuperContestEffects(
      ids: number[]
   ): Promise<SuperContestEffect[]> {
      if (!Array.isArray(ids) || ids.length === 0) {
         throw new Error("IDs array cannot be empty");
      }

      if (ids.length > 20) {
         throw new Error("Batch size cannot exceed 20 super contest effects");
      }

      return this.batchOperation(
         ids,
         async (id) => await this.getSuperContestEffect(id),
         3
      );
   }

   // Get all contest types (there are only 5)
   async getAllContestTypes(): Promise<ContestType[]> {
      const contestTypeNames = ["cool", "beauty", "cute", "smart", "tough"];

      return this.batchOperation(
         contestTypeNames,
         async (name) => await this.getContestType(name),
         5
      );
   }

   async getContestEffectWithMoves(effectId: number) {
      const effect = await this.getContestEffect(effectId);

      return {
         ...effect,
         effectEntries: effect.effect_entries,
         flavorTextEntries: effect.flavor_text_entries,
      };
   }
}
