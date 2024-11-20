import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {API_CONSTANTS} from "../../constants/api.constants";
import {Observable} from "rxjs";
import {PaginationResult} from "../../types/pagination.result.type";
import {Service} from "../../types/service.type";
import {Inspection} from "../../types/inspection.type";

@Injectable({
  providedIn: 'root'
})
export class ServiceBookService {
  private http = inject(HttpClient);

  getServices(serviceBookId : string) : Observable<PaginationResult<Service>> {
    return this.http.get<PaginationResult<Service>>(API_CONSTANTS.SERVICE_BOOKS.BASE_PATH + `/${serviceBookId}/services`);
  }

  getInspections(serviceBookId : string) : Observable<PaginationResult<Inspection>> {
    return this.http.get<PaginationResult<Inspection>>(API_CONSTANTS.SERVICE_BOOKS.BASE_PATH + `/${serviceBookId}/inspections`);
  }
}
