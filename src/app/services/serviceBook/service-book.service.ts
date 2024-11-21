import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {API_CONSTANTS} from "../../constants/api.constants";
import {Observable} from "rxjs";
import {PaginationResult} from "../../types/pagination-result.type";
import {Service} from "../../types/service.type";
import {Inspection} from "../../types/inspection.type";
import {ServiceDetails} from "../../types/service-details.type";
import {InspectionDetails} from "../../types/inspection-details.type";
import {CreateService} from "../../types/create-service.type";

@Injectable({
  providedIn: 'root'
})
export class ServiceBookService {
  private http = inject(HttpClient);

  getServices(serviceBookId : string) : Observable<PaginationResult<Service>> {
    return this.http.get<PaginationResult<Service>>(API_CONSTANTS.SERVICE_BOOKS.BASE_PATH + `/${serviceBookId}/services`);
  }

  getService(serviceBookId : string, serviceId: string) : Observable<ServiceDetails> {
    return this.http.get<ServiceDetails>(API_CONSTANTS.SERVICE_BOOKS.BASE_PATH + `/${serviceBookId}/services/${serviceId}`);
  }

  getInspections(serviceBookId : string) : Observable<PaginationResult<Inspection>> {
    return this.http.get<PaginationResult<Inspection>>(API_CONSTANTS.SERVICE_BOOKS.BASE_PATH + `/${serviceBookId}/inspections`);
  }

  getInspection(serviceBookId : string, inspectionId: string) : Observable<InspectionDetails> {
    return this.http.get<InspectionDetails>(API_CONSTANTS.SERVICE_BOOKS.BASE_PATH + `/${serviceBookId}/inspections/${inspectionId}`);
  }

  deleteInspection(serviceBookId : string, inspectionId: string) : Observable<void> {
    return this.http.delete<void>(API_CONSTANTS.SERVICE_BOOKS.BASE_PATH + `/${serviceBookId}/inspections/${inspectionId}`);
  }

  deleteService(serviceBookId : string, serviceId: string) : Observable<void> {
    return this.http.delete<void>(API_CONSTANTS.SERVICE_BOOKS.BASE_PATH + `/${serviceBookId}/services/${serviceId}`);
  }

  createService(serviceBookId: string, createServiceData: CreateService):Observable<any> {
    return this.http.post<any>(API_CONSTANTS.SERVICE_BOOKS.BASE_PATH + `/${serviceBookId}/services`, createServiceData);
  }
}
