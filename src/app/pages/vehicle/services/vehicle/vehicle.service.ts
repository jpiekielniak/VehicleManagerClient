import {Observable} from "rxjs";
import {inject, Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {API_CONSTANTS} from "../../../../constants/api.constants";
import {Vehicle} from "../../vehicles/types/vehicle.type";
import {PaginationResult} from "../../../../shared/components/pagination/types/pagination-result.type";
import {CreateVehicle} from "../../vehicles/types/create-vehicle.type";
import {VehicleDetails} from "../../vehicle-details/types/vehicle-details.type";
import {Insurance} from "../../vehicle-details/types/insurance.type";
import {InsuranceDetails} from "../../vehicle-details/types/insurance-details.type";
import {CreateInsurance} from "../../vehicle-details/types/create-insurance.type";

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private http = inject(HttpClient);

  createVehicle(vehicle: CreateVehicle): Observable<any> {
    return this.http.post<any>(API_CONSTANTS.VEHICLE.BASE_PATH, vehicle);
  }

  getVehicles(
    page: number = 1,
    pageSize: number = 4,
    filter: any = null,
    sort: string = 'brand'
  ): Observable<PaginationResult<Vehicle>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (filter) {
      params = params.set('Filters', `brand@=${filter}`);
    }

    if (sort) {
      params = params.set('Sorts', sort);
    }

    return this.http.get<PaginationResult<Vehicle>>(API_CONSTANTS.VEHICLE.BASE_PATH, { params });
  }

  deleteVehicle(id: string): Observable<void> {
    return this.http.delete<void>(API_CONSTANTS.VEHICLE.BASE_PATH + `/${id}`);
  }

  getById(vehicleId: string): Observable<VehicleDetails> {
    return this.http.get<VehicleDetails>(API_CONSTANTS.VEHICLE.BASE_PATH + `/${vehicleId}`)
  }

  update(vehicleId: string, updatedVehicle: any): Observable<void> {
    return this.http.put<void>(API_CONSTANTS.VEHICLE.BASE_PATH + `/${vehicleId}`, updatedVehicle);
  }

  getInsurances(vehicleId: string): Observable<PaginationResult<Insurance>> {
    return this.http.get<PaginationResult<Insurance>>(API_CONSTANTS.VEHICLE.BASE_PATH + `/${vehicleId}/insurances`);
  }

  getInsurance(vehicleId : string, insuranceId: string) : Observable<InsuranceDetails> {
    return this.http.get<InsuranceDetails>(API_CONSTANTS.VEHICLE.BASE_PATH + `/${vehicleId}/insurances/${insuranceId}`);
  }

  deleteInsurance(vehicleId: string, insuranceId: string): Observable<void> {
    return this.http.delete<void>(API_CONSTANTS.VEHICLE.BASE_PATH + `/${vehicleId}/insurances/${insuranceId}`);
  }

  createInsurance(createInsuranceData: CreateInsurance) : Observable<any> {
    return this.http.post<any>(API_CONSTANTS.VEHICLE.BASE_PATH + `/${createInsuranceData.vehicleId}` + `/insurances`, createInsuranceData);
  }

  uploadImage(image: FormData, vehicleId : string) : Observable<any> {
    return this.http.post<any>(API_CONSTANTS.VEHICLE.BASE_PATH + `/${vehicleId}/image`, image);
  }

  deleteImage(vehicleId: string) : Observable<any> {
    return this.http.delete<any>(API_CONSTANTS.VEHICLE.BASE_PATH + `/${vehicleId}/image`);
  }
}
