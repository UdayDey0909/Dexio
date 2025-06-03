import { useState, useEffect, useCallback } from "react";
import { locationService } from "../../API";
import type { Location, LocationArea, Region } from "pokenode-ts";

interface UseLocationState {
   location: Location | null;
   loading: boolean;
   error: string | null;
}

interface UseLocationListState {
   locations: any[] | null;
   loading: boolean;
   error: string | null;
   hasMore: boolean;
}

interface UseLocationAreaState {
   locationArea: LocationArea | null;
   loading: boolean;
   error: string | null;
}

interface UseLocationAreaListState {
   locationAreas: any[] | null;
   loading: boolean;
   error: string | null;
   hasMore: boolean;
}

interface UseRegionState {
   region: Region | null;
   loading: boolean;
   error: string | null;
}

interface UseRegionListState {
   regions: any[] | null;
   loading: boolean;
   error: string | null;
   hasMore: boolean;
}

interface UseLocationsByRegionState {
   locations: any[] | null;
   loading: boolean;
   error: string | null;
}

// Hook for getting a single location by ID or name
export const useLocation = (identifier?: string | number) => {
   const [state, setState] = useState<UseLocationState>({
      location: null,
      loading: false,
      error: null,
   });

   const fetchLocation = useCallback(async (id: string | number) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const location = await locationService.getLocation(id);
         setState({ location, loading: false, error: null });
      } catch (error) {
         setState({
            location: null,
            loading: false,
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to fetch location",
         });
      }
   }, []);

   useEffect(() => {
      if (identifier) {
         fetchLocation(identifier);
      }
   }, [identifier, fetchLocation]);

   const refetch = useCallback(() => {
      if (identifier) {
         fetchLocation(identifier);
      }
   }, [identifier, fetchLocation]);

   return {
      ...state,
      refetch,
   };
};

// Hook for getting location list with pagination
export const useLocationList = (offset = 0, limit = 20) => {
   const [state, setState] = useState<UseLocationListState>({
      locations: null,
      loading: false,
      error: null,
      hasMore: true,
   });

   const fetchLocations = useCallback(async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const response = await locationService.getLocationList(offset, limit);
         setState({
            locations: response.results,
            loading: false,
            error: null,
            hasMore: !!response.next,
         });
      } catch (error) {
         setState({
            locations: null,
            loading: false,
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to fetch locations",
            hasMore: false,
         });
      }
   }, [offset, limit]);

   useEffect(() => {
      fetchLocations();
   }, [fetchLocations]);

   return {
      ...state,
      refetch: fetchLocations,
   };
};

// Hook for getting a single location area by ID or name
export const useLocationArea = (identifier?: string | number) => {
   const [state, setState] = useState<UseLocationAreaState>({
      locationArea: null,
      loading: false,
      error: null,
   });

   const fetchLocationArea = useCallback(async (id: string | number) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const locationArea = await locationService.getLocationArea(id);
         setState({ locationArea, loading: false, error: null });
      } catch (error) {
         setState({
            locationArea: null,
            loading: false,
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to fetch location area",
         });
      }
   }, []);

   useEffect(() => {
      if (identifier) {
         fetchLocationArea(identifier);
      }
   }, [identifier, fetchLocationArea]);

   const refetch = useCallback(() => {
      if (identifier) {
         fetchLocationArea(identifier);
      }
   }, [identifier, fetchLocationArea]);

   return {
      ...state,
      refetch,
   };
};

// Hook for getting location area list with pagination
export const useLocationAreaList = (offset = 0, limit = 20) => {
   const [state, setState] = useState<UseLocationAreaListState>({
      locationAreas: null,
      loading: false,
      error: null,
      hasMore: true,
   });

   const fetchLocationAreas = useCallback(async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const response = await locationService.getLocationAreaList(
            offset,
            limit
         );
         setState({
            locationAreas: response.results,
            loading: false,
            error: null,
            hasMore: !!response.next,
         });
      } catch (error) {
         setState({
            locationAreas: null,
            loading: false,
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to fetch location areas",
            hasMore: false,
         });
      }
   }, [offset, limit]);

   useEffect(() => {
      fetchLocationAreas();
   }, [fetchLocationAreas]);

   return {
      ...state,
      refetch: fetchLocationAreas,
   };
};

// Hook for getting a single region by ID or name
export const useRegion = (identifier?: string | number) => {
   const [state, setState] = useState<UseRegionState>({
      region: null,
      loading: false,
      error: null,
   });

   const fetchRegion = useCallback(async (id: string | number) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const region = await locationService.getRegion(id);
         setState({ region, loading: false, error: null });
      } catch (error) {
         setState({
            region: null,
            loading: false,
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to fetch region",
         });
      }
   }, []);

   useEffect(() => {
      if (identifier) {
         fetchRegion(identifier);
      }
   }, [identifier, fetchRegion]);

   const refetch = useCallback(() => {
      if (identifier) {
         fetchRegion(identifier);
      }
   }, [identifier, fetchRegion]);

   return {
      ...state,
      refetch,
   };
};

// Hook for getting region list with pagination
export const useRegionList = (offset = 0, limit = 20) => {
   const [state, setState] = useState<UseRegionListState>({
      regions: null,
      loading: false,
      error: null,
      hasMore: true,
   });

   const fetchRegions = useCallback(async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const response = await locationService.getRegionList(offset, limit);
         setState({
            regions: response.results,
            loading: false,
            error: null,
            hasMore: !!response.next,
         });
      } catch (error) {
         setState({
            regions: null,
            loading: false,
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to fetch regions",
            hasMore: false,
         });
      }
   }, [offset, limit]);

   useEffect(() => {
      fetchRegions();
   }, [fetchRegions]);

   return {
      ...state,
      refetch: fetchRegions,
   };
};

// Hook for getting locations by region name
export const useLocationsByRegion = (regionName?: string) => {
   const [state, setState] = useState<UseLocationsByRegionState>({
      locations: null,
      loading: false,
      error: null,
   });

   const fetchLocationsByRegion = useCallback(async (name: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const locations = await locationService.getLocationsByRegion(name);
         setState({ locations, loading: false, error: null });
      } catch (error) {
         setState({
            locations: null,
            loading: false,
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to fetch locations by region",
         });
      }
   }, []);

   useEffect(() => {
      if (regionName) {
         fetchLocationsByRegion(regionName);
      }
   }, [regionName, fetchLocationsByRegion]);

   const refetch = useCallback(() => {
      if (regionName) {
         fetchLocationsByRegion(regionName);
      }
   }, [regionName, fetchLocationsByRegion]);

   return {
      ...state,
      refetch,
   };
};
