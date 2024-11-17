import {map, Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

export type Vehicle = {
  vehicleId: string;
  brand: string;
  model: string;
  licensePlate: string;
}

export type VehicleListResponse = {
  items: Vehicle[];
  totalPages: number;
  itemsFrom: number;
  itemsTo: number;
  totalItemsCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private readonly apiUrl = 'http://localhost:5189/api/v1/vehicles';

  constructor(private http: HttpClient) {
  }

  getVehicles(page: number = 1, pageSize: number = 5): Observable<VehicleListResponse> {
      return this.http.get<VehicleListResponse>(`${this.apiUrl}?page=${page}&pageSize=${pageSize}`)
        .pipe(map((response: any) => { return response; }));
  }
}
