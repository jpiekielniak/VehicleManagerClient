import { Injectable } from '@angular/core';
import {VehicleService} from "./vehicle.service";
import {SortConfig} from "../../components/sorting/sorting.component";
import {Vehicle} from "../../types/vehicle.type";

@Injectable({
  providedIn: 'root'
})
export class VehicleSortService {
  applySorting(vehicleService: VehicleService, sortConfig: SortConfig<Vehicle>) {
    const direction = sortConfig.direction === 'desc' ? '-' : '';
    return vehicleService.getVehicles(1, 10, null, `${direction}${sortConfig.field}`);
  }
}
