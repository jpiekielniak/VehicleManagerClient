import {Observable} from "rxjs";
import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {API_CONSTANTS} from "../../constants/api.constants";
import {PaginationResult} from "../../types/pagination.result";
import {VehicleType} from "../../types/vehicle.type";
import {CreateVehicle} from "../../types/create-vehicle";
import {VehicleDetails} from "../../types/vehicle-details";

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private http = inject(HttpClient);

  createVehicle(vehicle: CreateVehicle): Observable<any> {
    return this.http.post<any>(API_CONSTANTS.VEHICLE.BASE_PATH, vehicle);
  }

  getVehicles(page: number, pageSize: number): Observable<PaginationResult<VehicleType>> {
    return this.http.get<PaginationResult<VehicleType>>(API_CONSTANTS.VEHICLE.BASE_PATH + `?page=${page}&pageSize=${pageSize}`)
  }

  deleteVehicle(id: number): Observable<void> {
    return this.http.delete<void>(API_CONSTANTS.VEHICLE.BASE_PATH + `/${id}`);
  }

  getById(vehicleId: string): Observable<VehicleDetails> {
    return this.http.get<VehicleDetails>(API_CONSTANTS.VEHICLE.BASE_PATH + `/${vehicleId}`)
  }

  update(vehicleId: string, updatedVehicle: any) : Observable<void> {
    return this.http.put<void>(API_CONSTANTS.VEHICLE.BASE_PATH + `/${vehicleId}`, updatedVehicle);
  }
}
