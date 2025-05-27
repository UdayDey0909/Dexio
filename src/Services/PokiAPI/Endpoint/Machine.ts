// src/Services/PokiAPI/Endpoints/MachineEndpoints.ts
import { BaseEndpoint } from "./Common";
import { NamedAPIResourceList } from "../Interface/Common";

/**
 * Machine-specific endpoints
 */
export class MachineEndpoints extends BaseEndpoint {
   /**
    * Get machine by ID
    */
   async getMachine(id: number) {
      return this.fetchResource("machine", id);
   }

   /**
    * Get list of machines
    */
   async getMachinesList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("machine", params);
   }

   /**
    * Get machines by version group
    */
   async getMachinesByVersionGroup(versionGroupId: number | string) {
      const allMachines = await this.getMachinesList({
         limit: 1000,
         offset: 0,
      });
      const machineData = await Promise.allSettled(
         allMachines.results.map((machine) =>
            this.getMachine(this.extractIdFromUrl(machine.url))
         )
      );

      return machineData
         .filter(
            (result): result is PromiseFulfilledResult<any> =>
               result.status === "fulfilled"
         )
         .map((result) => result.value)
         .filter((machine) => {
            const vgId = this.extractIdFromUrl(machine.version_group.url);
            return (
               vgId ===
               (typeof versionGroupId === "string"
                  ? parseInt(versionGroupId)
                  : versionGroupId)
            );
         });
   }
}
