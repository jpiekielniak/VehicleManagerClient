import { Injectable } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Service} from "../../../types/service.type";
import {Observable} from "rxjs";
import {ServiceDetailsComponent} from "../../../components/service-details/service-details.component";
import {CreateServiceComponent} from "../../../components/create-service/create-service.component";

@Injectable({
  providedIn: 'root'
})
export class ServiceDialogService {
  constructor(private dialog: MatDialog) {}

  openServiceDetails(service: Service, serviceBookId: string): Observable<void> {
    return this.dialog.open(ServiceDetailsComponent, {
      width: '600px',
      data: { service, serviceBookId }
    }).afterClosed();
  }

  openCreateService(serviceBookId: string): Observable<any> {
    return this.dialog.open(CreateServiceComponent, {
      width: '600px',
      data: { serviceBookId }
    }).afterClosed();
  }
}
