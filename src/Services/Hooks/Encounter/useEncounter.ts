import { useState, useEffect, useCallback } from "react";
import { EncounterService } from "../../API/Encounter";
import type {
   EncounterMethod,
   EncounterCondition,
   EncounterConditionValue,
} from "pokenode-ts";

interface EncounterHookState<T> {
   data: T | null;
   loading: boolean;
   error: string | null;
}

interface UseEncounterReturn {
   // Encounter Methods
   encounterMethod: EncounterHookState<EncounterMethod>;
   encounterMethodList: EncounterHookState<any>;
   getEncounterMethod: (identifier: string | number) => Promise<void>;
   getEncounterMethodList: (offset?: number, limit?: number) => Promise<void>;

   // Encounter Conditions
   encounterCondition: EncounterHookState<EncounterCondition>;
   encounterConditionList: EncounterHookState<any>;
   getEncounterCondition: (identifier: string | number) => Promise<void>;
   getEncounterConditionList: (
      offset?: number,
      limit?: number
   ) => Promise<void>;

   // Encounter Condition Values
   encounterConditionValue: EncounterHookState<EncounterConditionValue>;
   encounterConditionValueList: EncounterHookState<any>;
   getEncounterConditionValue: (identifier: string | number) => Promise<void>;
   getEncounterConditionValueList: (
      offset?: number,
      limit?: number
   ) => Promise<void>;

   // Utilities
   clearAll: () => void;
   isOnline: boolean;
}

export const useEncounter = (): UseEncounterReturn => {
   const [service] = useState(() => new EncounterService());

   // State for encounter methods
   const [encounterMethod, setEncounterMethod] = useState<
      EncounterHookState<EncounterMethod>
   >({
      data: null,
      loading: false,
      error: null,
   });

   const [encounterMethodList, setEncounterMethodList] = useState<
      EncounterHookState<any>
   >({
      data: null,
      loading: false,
      error: null,
   });

   // State for encounter conditions
   const [encounterCondition, setEncounterCondition] = useState<
      EncounterHookState<EncounterCondition>
   >({
      data: null,
      loading: false,
      error: null,
   });

   const [encounterConditionList, setEncounterConditionList] = useState<
      EncounterHookState<any>
   >({
      data: null,
      loading: false,
      error: null,
   });

   // State for encounter condition values
   const [encounterConditionValue, setEncounterConditionValue] = useState<
      EncounterHookState<EncounterConditionValue>
   >({
      data: null,
      loading: false,
      error: null,
   });

   const [encounterConditionValueList, setEncounterConditionValueList] =
      useState<EncounterHookState<any>>({
         data: null,
         loading: false,
         error: null,
      });

   const [isOnline, setIsOnline] = useState(true);

   // Check connection status
   useEffect(() => {
      const checkConnection = async () => {
         const online = await service.checkConnection();
         setIsOnline(online);
      };

      checkConnection();
      const interval = setInterval(checkConnection, 30000); // Check every 30s

      return () => clearInterval(interval);
   }, [service]);

   // Encounter Method functions
   const getEncounterMethod = useCallback(
      async (identifier: string | number) => {
         setEncounterMethod((prev) => ({
            ...prev,
            loading: true,
            error: null,
         }));

         try {
            const data = await service.getEncounterMethod(identifier);
            setEncounterMethod({ data, loading: false, error: null });
         } catch (error) {
            const errorMessage =
               error instanceof Error
                  ? error.message
                  : "Failed to fetch encounter method";
            setEncounterMethod({
               data: null,
               loading: false,
               error: errorMessage,
            });
         }
      },
      [service]
   );

   const getEncounterMethodList = useCallback(
      async (offset = 0, limit = 20) => {
         setEncounterMethodList((prev) => ({
            ...prev,
            loading: true,
            error: null,
         }));

         try {
            const data = await service.getEncounterMethodList(offset, limit);
            setEncounterMethodList({ data, loading: false, error: null });
         } catch (error) {
            const errorMessage =
               error instanceof Error
                  ? error.message
                  : "Failed to fetch encounter method list";
            setEncounterMethodList({
               data: null,
               loading: false,
               error: errorMessage,
            });
         }
      },
      [service]
   );

   // Encounter Condition functions
   const getEncounterCondition = useCallback(
      async (identifier: string | number) => {
         setEncounterCondition((prev) => ({
            ...prev,
            loading: true,
            error: null,
         }));

         try {
            const data = await service.getEncounterCondition(identifier);
            setEncounterCondition({ data, loading: false, error: null });
         } catch (error) {
            const errorMessage =
               error instanceof Error
                  ? error.message
                  : "Failed to fetch encounter condition";
            setEncounterCondition({
               data: null,
               loading: false,
               error: errorMessage,
            });
         }
      },
      [service]
   );

   const getEncounterConditionList = useCallback(
      async (offset = 0, limit = 20) => {
         setEncounterConditionList((prev) => ({
            ...prev,
            loading: true,
            error: null,
         }));

         try {
            const data = await service.getEncounterConditionList(offset, limit);
            setEncounterConditionList({ data, loading: false, error: null });
         } catch (error) {
            const errorMessage =
               error instanceof Error
                  ? error.message
                  : "Failed to fetch encounter condition list";
            setEncounterConditionList({
               data: null,
               loading: false,
               error: errorMessage,
            });
         }
      },
      [service]
   );

   // Encounter Condition Value functions
   const getEncounterConditionValue = useCallback(
      async (identifier: string | number) => {
         setEncounterConditionValue((prev) => ({
            ...prev,
            loading: true,
            error: null,
         }));

         try {
            const data = await service.getEncounterConditionValue(identifier);
            setEncounterConditionValue({ data, loading: false, error: null });
         } catch (error) {
            const errorMessage =
               error instanceof Error
                  ? error.message
                  : "Failed to fetch encounter condition value";
            setEncounterConditionValue({
               data: null,
               loading: false,
               error: errorMessage,
            });
         }
      },
      [service]
   );

   const getEncounterConditionValueList = useCallback(
      async (offset = 0, limit = 20) => {
         setEncounterConditionValueList((prev) => ({
            ...prev,
            loading: true,
            error: null,
         }));

         try {
            const data = await service.getEncounterConditionValueList(
               offset,
               limit
            );
            setEncounterConditionValueList({
               data,
               loading: false,
               error: null,
            });
         } catch (error) {
            const errorMessage =
               error instanceof Error
                  ? error.message
                  : "Failed to fetch encounter condition value list";
            setEncounterConditionValueList({
               data: null,
               loading: false,
               error: errorMessage,
            });
         }
      },
      [service]
   );

   // Utility function to clear all states
   const clearAll = useCallback(() => {
      setEncounterMethod({ data: null, loading: false, error: null });
      setEncounterMethodList({ data: null, loading: false, error: null });
      setEncounterCondition({ data: null, loading: false, error: null });
      setEncounterConditionList({ data: null, loading: false, error: null });
      setEncounterConditionValue({ data: null, loading: false, error: null });
      setEncounterConditionValueList({
         data: null,
         loading: false,
         error: null,
      });
   }, []);

   // Cleanup on unmount
   useEffect(() => {
      return () => {
         service.cleanup();
      };
   }, [service]);

   return {
      // Encounter Methods
      encounterMethod,
      encounterMethodList,
      getEncounterMethod,
      getEncounterMethodList,

      // Encounter Conditions
      encounterCondition,
      encounterConditionList,
      getEncounterCondition,
      getEncounterConditionList,

      // Encounter Condition Values
      encounterConditionValue,
      encounterConditionValueList,
      getEncounterConditionValue,
      getEncounterConditionValueList,

      // Utilities
      clearAll,
      isOnline,
   };
};
