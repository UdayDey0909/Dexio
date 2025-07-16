import type { TypeDetails } from "@/Services/Hooks/Type/Shared/Types";

/**
 * Combines weaknesses for dual types, returning an array of [type, multiplier] pairs where multiplier > 1.
 */
export function combineWeaknesses(
   typeDetailsArr: (TypeDetails | undefined)[]
): [string, number][] {
   const allTypes = [
      "normal",
      "fire",
      "water",
      "electric",
      "grass",
      "ice",
      "fighting",
      "poison",
      "ground",
      "flying",
      "psychic",
      "bug",
      "rock",
      "ghost",
      "dragon",
      "dark",
      "steel",
      "fairy",
   ];
   // Start with 1x for all types
   const result: Record<string, number> = {};
   allTypes.forEach((t) => (result[t] = 1));
   typeDetailsArr.forEach((typeDetails) => {
      if (!typeDetails) return;
      typeDetails.effectivenessChart.weakTo.forEach((t: { name: string }) => {
         result[t.name] *= 2;
      });
      typeDetails.effectivenessChart.resistantTo.forEach(
         (t: { name: string }) => {
            result[t.name] *= 0.5;
         }
      );
      typeDetails.effectivenessChart.immuneTo.forEach((t: { name: string }) => {
         result[t.name] *= 0;
      });
   });
   // Only show >1 (weaknesses)
   return Object.entries(result).filter(
      ([type, mult]) => typeof mult === "number" && mult > 1
   ) as [string, number][];
}
