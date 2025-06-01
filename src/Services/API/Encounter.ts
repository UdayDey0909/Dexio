import { BaseService } from "../Client";
import type {
   EncounterMethod,
   EncounterCondition,
   EncounterConditionValue,
} from "pokenode-ts";

export class EncounterService extends BaseService {
   async getEncounterMethod(
      identifier: string | number
   ): Promise<EncounterMethod> {
      this.validateIdentifier(identifier, "Encounter Method");

      return this.executeWithErrorHandling(async () => {
         return typeof identifier === "string"
            ? await this.api.encounter.getEncounterMethodByName(
                 identifier.toLowerCase().trim()
              )
            : await this.api.encounter.getEncounterMethodById(identifier);
      }, `Failed to fetch encounter method: ${identifier}`);
   }

   async getEncounterMethodList(offset: number = 0, limit: number = 20) {
      this.validatePaginationParams(offset, limit);

      return this.executeWithErrorHandling(
         async () =>
            await this.api.encounter.listEncounterMethods(offset, limit),
         "Failed to fetch encounter method list"
      );
   }

   async getEncounterCondition(
      identifier: string | number
   ): Promise<EncounterCondition> {
      this.validateIdentifier(identifier, "Encounter Condition");

      return this.executeWithErrorHandling(async () => {
         return typeof identifier === "string"
            ? await this.api.encounter.getEncounterConditionByName(
                 identifier.toLowerCase().trim()
              )
            : await this.api.encounter.getEncounterConditionById(identifier);
      }, `Failed to fetch encounter condition: ${identifier}`);
   }

   async getEncounterConditionList(offset: number = 0, limit: number = 20) {
      this.validatePaginationParams(offset, limit);

      return this.executeWithErrorHandling(
         async () =>
            await this.api.encounter.listEncounterConditions(offset, limit),
         "Failed to fetch encounter condition list"
      );
   }

   async getEncounterConditionValue(
      identifier: string | number
   ): Promise<EncounterConditionValue> {
      this.validateIdentifier(identifier, "Encounter Condition Value");

      return this.executeWithErrorHandling(async () => {
         return typeof identifier === "string"
            ? await this.api.encounter.getEncounterConditionValueByName(
                 identifier.toLowerCase().trim()
              )
            : await this.api.encounter.getEncounterConditionValueById(
                 identifier
              );
      }, `Failed to fetch encounter condition value: ${identifier}`);
   }

   async getEncounterConditionValueList(
      offset: number = 0,
      limit: number = 20
   ) {
      this.validatePaginationParams(offset, limit);

      return this.executeWithErrorHandling(
         async () =>
            await this.api.encounter.listEncounterConditionValues(
               offset,
               limit
            ),
         "Failed to fetch encounter condition value list"
      );
   }
}
