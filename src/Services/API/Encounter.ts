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
      try {
         return typeof identifier === "string"
            ? await this.api.encounter.getEncounterMethodByName(
                 identifier.toLowerCase()
              )
            : await this.api.encounter.getEncounterMethodById(identifier);
      } catch (error) {
         throw new Error(`Failed to fetch encounter method: ${error}`);
      }
   }

   async getEncounterMethodList(offset: number = 0, limit: number = 20) {
      return await this.api.encounter.listEncounterMethods(offset, limit);
   }

   async getEncounterCondition(
      identifier: string | number
   ): Promise<EncounterCondition> {
      try {
         return typeof identifier === "string"
            ? await this.api.encounter.getEncounterConditionByName(
                 identifier.toLowerCase()
              )
            : await this.api.encounter.getEncounterConditionById(identifier);
      } catch (error) {
         throw new Error(`Failed to fetch encounter condition: ${error}`);
      }
   }

   async getEncounterConditionList(offset: number = 0, limit: number = 20) {
      return await this.api.encounter.listEncounterConditions(offset, limit);
   }

   async getEncounterConditionValue(
      identifier: string | number
   ): Promise<EncounterConditionValue> {
      try {
         return typeof identifier === "string"
            ? await this.api.encounter.getEncounterConditionValueByName(
                 identifier.toLowerCase()
              )
            : await this.api.encounter.getEncounterConditionValueById(
                 identifier
              );
      } catch (error) {
         throw new Error(`Failed to fetch encounter condition value: ${error}`);
      }
   }

   async getEncounterConditionValueList(
      offset: number = 0,
      limit: number = 20
   ) {
      return await this.api.encounter.listEncounterConditionValues(
         offset,
         limit
      );
   }
}
