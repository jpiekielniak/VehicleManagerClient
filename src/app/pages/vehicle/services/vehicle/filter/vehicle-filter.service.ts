import { Injectable } from '@angular/core';
import {VehicleService} from "../vehicle.service";

@Injectable({
  providedIn: 'root'
})
export class VehicleFilterService {
  applyFilter(vehicleService: VehicleService, selectedBrand: string, pageIndex: number, pageSize: number) {
    return selectedBrand === 'Wszystkie marki'
      ? vehicleService.getVehicles(pageIndex + 1, pageSize)
      : vehicleService.getVehicles(pageIndex + 1, pageSize, selectedBrand);
  }
}
