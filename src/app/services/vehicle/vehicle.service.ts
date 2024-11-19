import {map, Observable} from "rxjs";
import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {API_CONSTANTS} from "../../constants/api.constants";
import {PaginationResultType} from "../../types/pagination-result.type";
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

  getVehicles(page: number, pageSize: number): Observable<PaginationResultType<VehicleType>> {
    return this.http.get<PaginationResultType<VehicleType>>(API_CONSTANTS.VEHICLE.BASE_PATH + `?page=${page}&pageSize=${pageSize}`)
      .pipe(map((response: PaginationResultType<VehicleType>) => {
        return response;
      }));
  }
}
