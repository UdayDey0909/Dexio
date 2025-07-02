// Location hooks
export { useLocation } from "./useLocation";
export { useLocationDetails } from "./useLocationDetails";
export { useLocationList } from "./useLocationList";

// Location Area hooks
export { useLocationArea } from "./useLocationArea";
export { useLocationAreaDetails } from "./useLocationAreaDetails";
export { useLocationAreaList } from "./useLocationAreaList";

// Region hooks
export { useRegion } from "./useRegion";
export { useRegionDetails } from "./useRegionDetails";
export { useRegionList } from "./useRegionList";

// Specialty hooks
export { useLocationsByRegion } from "./useLocationsByRegion";

// Base types
export type { BaseHookState } from "./Shared/Types";

// Location types
export type {
   LocationDetails,
   UseLocationState,
   UseLocationDetailsState,
   UseLocationListState,
   UseLocationReturn,
   UseLocationDetailsReturn,
   UseLocationListReturn,
} from "./Shared/Types";

// Location Area types
export type {
   LocationAreaDetails,
   UseLocationAreaState,
   UseLocationAreaDetailsState,
   UseLocationAreaListState,
   UseLocationAreaReturn,
   UseLocationAreaDetailsReturn,
   UseLocationAreaListReturn,
} from "./Shared/Types";

// Region types
export type {
   RegionDetails,
   UseRegionState,
   UseRegionDetailsState,
   UseRegionListState,
   UseRegionReturn,
   UseRegionDetailsReturn,
   UseRegionListReturn,
} from "./Shared/Types";

// Specialty types
export type {
   UseLocationsByRegionState,
   UseLocationsByRegionReturn,
} from "./Shared/Types";

// Utility functions (if needed by consumers)
export {
   handleError,
   useMemoizedIdentifier,
   useMemoizedPagination,
   useMemoizedRegionName,
} from "./Shared/Types";
