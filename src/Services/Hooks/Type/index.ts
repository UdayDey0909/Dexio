// Main hooks
export { useType } from "./useType";
export { useTypeDetails } from "./useTypeDetails";
export { useTypeList } from "./useTypeList";
export { useAllTypes } from "./useAllTypes";

// Specialized hooks
export { useTypeEffectiveness } from "./useTypeEffectiveness";
export { useTypeMatchup } from "./useTypeMatchup";
export { usePokemonByType } from "./usePokemonByType";
export { useMovesByType } from "./useMovesByType";

// Export types for external use
export type {
   UseTypeReturn,
   UseTypeDetailsReturn,
   UseTypeListReturn,
   UseAllTypesReturn,
   UseTypeEffectivenessReturn,
   UseTypeMatchupReturn,
   UsePokemonByTypeReturn,
   UseMovesByTypeReturn,
   TypeDetails,
   TypeEffectiveness,
   TypeMatchup,
} from "./Shared/Types";
