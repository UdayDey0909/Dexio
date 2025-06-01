import { BaseService } from "../Client";
import type { Move } from "pokenode-ts";

export class MoveService extends BaseService {
   async getMove(identifier: string | number): Promise<Move> {
      try {
         return typeof identifier === "string"
            ? await this.api.move.getMoveByName(identifier.toLowerCase())
            : await this.api.move.getMoveById(identifier);
      } catch (error) {
         throw new Error(`Failed to fetch move: ${error}`);
      }
   }

   async getMoveList(offset: number = 0, limit: number = 20) {
      return await this.api.move.listMoves(offset, limit);
   }

   async getMoveDetails(moveName: string) {
      const move = await this.getMove(moveName);
      return {
         ...move,
         effectChance: move.effect_chance,
         effectEntries: move.effect_entries,
         flavorTextEntries: move.flavor_text_entries,
      };
   }

   async getPokemonThatLearnMove(moveName: string) {
      const move = await this.getMove(moveName);
      return move.learned_by_pokemon;
   }

   async filterMovesByPower(minPower: number, maxPower: number = 999) {
      const moves = await this.getMoveList(0, 1000);
      const movePromises = moves.results.map(async (moveRef) => {
         const move = await this.getMove(moveRef.name);
         return move.power !== null &&
            move.power >= minPower &&
            move.power <= maxPower
            ? move
            : null;
      });
      const results = await Promise.all(movePromises);
      return results.filter((move) => move !== null);
   }

   async batchGetMoves(identifiers: (string | number)[]): Promise<Move[]> {
      const promises = identifiers.map((id) => this.getMove(id));
      return await Promise.all(promises);
   }
}
