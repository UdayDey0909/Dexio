import { BaseService } from "../Client";
import type {
   Contest,
   ContestType,
   ContestEffect,
   SuperContestEffect,
} from "pokenode-ts";

export class ContestService extends BaseService {
   async getContest(identifier: string | number): Promise<Contest> {
      try {
         return typeof identifier === "string"
            ? await this.api.contest.getContestByName(identifier.toLowerCase())
            : await this.api.contest.getContestById(identifier);
      } catch (error) {
         throw new Error(`Failed to fetch contest: ${error}`);
      }
   }

   async getContestList(offset: number = 0, limit: number = 20) {
      return await this.api.contest.listContests(offset, limit);
   }

   async getContestType(identifier: string | number): Promise<ContestType> {
      try {
         return typeof identifier === "string"
            ? await this.api.contest.getContestTypeByName(
                 identifier.toLowerCase()
              )
            : await this.api.contest.getContestTypeById(identifier);
      } catch (error) {
         throw new Error(`Failed to fetch contest type: ${error}`);
      }
   }

   async getContestTypeList(offset: number = 0, limit: number = 20) {
      return await this.api.contest.listContestTypes(offset, limit);
   }

   async getContestEffect(id: number): Promise<ContestEffect> {
      try {
         return await this.api.contest.getContestEffectById(id);
      } catch (error) {
         throw new Error(`Failed to fetch contest effect: ${error}`);
      }
   }

   async getContestEffectList(offset: number = 0, limit: number = 20) {
      return await this.api.contest.listContestEffects(offset, limit);
   }

   async getSuperContestEffect(id: number): Promise<SuperContestEffect> {
      try {
         return await this.api.contest.getSuperContestEffectById(id);
      } catch (error) {
         throw new Error(`Failed to fetch super contest effect: ${error}`);
      }
   }

   async getSuperContestEffectList(offset: number = 0, limit: number = 20) {
      return await this.api.contest.listSuperContestEffects(offset, limit);
   }
}
