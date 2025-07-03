// src/Services/Hooks/Utility/index.ts
export { useResourceByUrl } from "./useResourceByUrl";
export { useBatchResources } from "./useBatchResources";
export { useAllPages } from "./useAllPages";
export { useRandomResource } from "./useRandomResource";
export { useUtilityHelpers } from "./useUtilityHelpers";

export type {
   UseResourceReturn,
   UseBatchResourceReturn,
   UseAllPagesReturn,
   UseRandomResourceReturn,
   UseUtilityHelpersReturn,
   ResourceReference,
   PaginatedResponse,
   PaginationInfo,
   ResourceInfo,
} from "./Shared/Types";
