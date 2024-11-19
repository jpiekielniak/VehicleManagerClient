import {map, Observable} from "rxjs";
import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {API_CONSTANTS} from "../../constants/api.constants";
import {PaginationResult} from "../../types/pagination.result";
import {VehicleType} from "../../types/vehicle.type";
import {CreateVehicle} from "../../types/create-vehicle";

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
      .pipe(map((response: PaginationResult<VehicleType>) => {
        return response;
      }));
  }

  deleteVehicle(id: number) : Observable<void> {
    return this.http.delete<void>(API_CONSTANTS.VEHICLE.BASE_PATH + `/${id}`);
  }
}
