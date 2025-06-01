import { BaseService } from "../Client";
import type { Machine } from "pokenode-ts";

export class MachineService extends BaseService {
   async getMachine(id: number): Promise<Machine> {
      try {
         return await this.api.machine.getMachineById(id);
      } catch (error) {
         throw new Error(`Failed to fetch machine: ${error}`);
      }
   }

   async getMachineList(offset: number = 0, limit: number = 20) {
      return await this.api.machine.listMachines(offset, limit);
   }

   async getMachinesByVersionGroup(versionGroupName: string) {
      const machines = await this.getMachineList(0, 1000);
      const machinePromises = machines.results.map(async (machineRef) => {
         const machine = await this.getMachine(
            parseInt(machineRef.url.split("/").slice(-2, -1)[0])
         );
         return machine.version_group.name === versionGroupName
            ? machine
            : null;
      });
      const results = await Promise.all(machinePromises);
      return results.filter((machine) => machine !== null);
   }

   async getTMsByMove(moveName: string) {
      const machines = await this.getMachineList(0, 1000);
      const machinePromises = machines.results.map(async (machineRef) => {
         const machine = await this.getMachine(
            parseInt(machineRef.url.split("/").slice(-2, -1)[0])
         );
         return machine.move.name === moveName ? machine : null;
      });
      const results = await Promise.all(machinePromises);
      return results.filter((machine) => machine !== null);
   }
}
