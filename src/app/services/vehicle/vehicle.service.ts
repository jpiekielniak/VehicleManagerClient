import {map, Observable} from "rxjs";
import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {API_CONSTANTS} from "../../constants/api.constants";
import {PaginationResultType} from "../../types/pagination-result.type";
import {VehicleType} from "../../types/vehicle.type";

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private http = inject(HttpClient);

  getVehicles(page: number, pageSize: number): Observable<PaginationResultType<VehicleType>> {
    return this.http.get<PaginationResultType<VehicleType>>(API_CONSTANTS.VEHICLE.VEHICLE_LIST + `?page=${page}&pageSize=${pageSize}`)
      .pipe(map((response: PaginationResultType<VehicleType>) => {
        return response;
      }));
  }
}
