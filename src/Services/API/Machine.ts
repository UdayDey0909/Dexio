import { BaseService } from "../Client";
import type { Machine } from "pokenode-ts";

export class MachineService extends BaseService {
   async getMachine(id: number): Promise<Machine> {
      this.validateIdentifier(id, "Machine");

      return this.executeWithErrorHandling(
         async () => await this.api.machine.getMachineById(id),
         `Failed to fetch machine: ${id}`
      );
   }

   async getMachineList(offset: number = 0, limit: number = 20) {
      this.validatePaginationParams(offset, limit);

      return this.executeWithErrorHandling(
         async () => await this.api.machine.listMachines(offset, limit),
         "Failed to fetch machine list"
      );
   }

   async getMachinesByVersionGroup(versionGroupName: string) {
      this.validateIdentifier(versionGroupName, "Version group name");

      return this.executeWithErrorHandling(async () => {
         const machines = await this.getMachineList(0, 1000);
         const machinePromises = machines.results.map(async (machineRef) => {
            try {
               const machine = await this.getMachine(
                  parseInt(machineRef.url.split("/").slice(-2, -1)[0])
               );
               return machine.version_group.name ===
                  versionGroupName.toLowerCase().trim()
                  ? machine
                  : null;
            } catch (error) {
               console.warn(
                  `Failed to fetch machine from ${machineRef.url}:`,
                  error
               );
               return null;
            }
         });
         const results = await Promise.all(machinePromises);
         return results.filter((machine) => machine !== null);
      }, `Failed to fetch machines for version group: ${versionGroupName}`);
   }

   async getTMsByMove(moveName: string) {
      this.validateIdentifier(moveName, "Move name");

      return this.executeWithErrorHandling(async () => {
         const machines = await this.getMachineList(0, 1000);
         const machinePromises = machines.results.map(async (machineRef) => {
            try {
               const machine = await this.getMachine(
                  parseInt(machineRef.url.split("/").slice(-2, -1)[0])
               );
               return machine.move.name === moveName.toLowerCase().trim()
                  ? machine
                  : null;
            } catch (error) {
               console.warn(
                  `Failed to fetch machine from ${machineRef.url}:`,
                  error
               );
               return null;
            }
         });
         const results = await Promise.all(machinePromises);
         return results.filter((machine) => machine !== null);
      }, `Failed to fetch TMs for move: ${moveName}`);
   }
}
