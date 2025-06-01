import { BaseService } from "../Client";
import type { Move } from "pokenode-ts";

export class MoveService extends BaseService {
   async getMove(identifier: string | number): Promise<Move> {
      this.validateIdentifier(identifier, "Move");

      return this.executeWithErrorHandling(async () => {
         return typeof identifier === "string"
            ? await this.api.move.getMoveByName(identifier.toLowerCase().trim())
            : await this.api.move.getMoveById(identifier);
      }, `Failed to fetch move: ${identifier}`);
   }

   async getMoveList(offset: number = 0, limit: number = 20) {
      this.validatePaginationParams(offset, limit);

      return this.executeWithErrorHandling(
         async () => await this.api.move.listMoves(offset, limit),
         "Failed to fetch move list"
      );
   }

   async getMoveDetails(moveName: string) {
      this.validateIdentifier(moveName, "Move name");

      const move = await this.getMove(moveName);
      return {
         ...move,
         effectChance: move.effect_chance,
         effectEntries: move.effect_entries,
         flavorTextEntries: move.flavor_text_entries,
      };
   }

   async getPokemonThatLearnMove(moveName: string) {
      this.validateIdentifier(moveName, "Move name");

      const move = await this.getMove(moveName);
      return move.learned_by_pokemon;
   }

   async filterMovesByPower(minPower: number, maxPower: number = 999) {
      if (minPower < 0 || maxPower < minPower || maxPower > 999) {
         throw new Error(
            "Invalid power range. Values must be 0-999 and minPower <= maxPower"
         );
      }

      return this.executeWithErrorHandling(async () => {
         const moves = await this.getMoveList(0, 1000);
         const movePromises = moves.results.map(async (moveRef) => {
            try {
               const move = await this.getMove(moveRef.name);
               return move.power !== null &&
                  move.power >= minPower &&
                  move.power <= maxPower
                  ? move
                  : null;
            } catch (error) {
               console.warn(`Failed to fetch move ${moveRef.name}:`, error);
               return null;
            }
         });
         const results = await Promise.all(movePromises);
         return results.filter((move) => move !== null);
      }, `Failed to filter moves by power range: ${minPower}-${maxPower}`);
   }

   async batchGetMoves(identifiers: (string | number)[]): Promise<Move[]> {
      if (!Array.isArray(identifiers) || identifiers.length === 0) {
         throw new Error("Identifiers array cannot be empty");
      }

      if (identifiers.length > 50) {
         throw new Error("Batch size cannot exceed 50 moves");
      }

      return this.batchOperation(
         identifiers,
         async (id) => await this.getMove(id),
         5
      );
   }
}
