// src/Services/Hooks/Berry/index.ts

// Single resource hooks
export { useBerry } from "./useBerry";
export { useBerryFlavor } from "./useBerryFlavor";
export { useBerryFirmness } from "./useBerryFirmness";

// List resource hooks
export { useBerryList } from "./useBerryList";
export { useBerryFlavorList } from "./useBerryFlavorList";
export { useBerryFirmnessList } from "./useBerryFirmnessList";

// Custom resource hooks
export { useBerriesByFlavor } from "./useBerriesByFlavor";

// Re-export types for convenience
export type {
   UseResourceReturn,
   UseResourceListReturn,
   UseResourceState,
   UseResourceListState,
   UseResourceListOptions,
} from "./Shared/Types";
