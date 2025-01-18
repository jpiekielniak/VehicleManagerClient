import { Injectable } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Service } from "../../../types/service.type";
import { Observable } from "rxjs";
import { ServiceDetailsComponent } from "../../../components/service-details/service-details.component";
import { CreateServiceComponent } from "../../../components/create-service/create-service.component";

@Injectable({
  providedIn: 'root',
  deps: [DialogService]
})
export class ServiceDialogService {
  constructor(private dialogService: DialogService) {}

  openServiceDetails(service: Service, serviceBookId: string): Observable<void> {
    return this.dialogService.open(ServiceDetailsComponent, {
      header: 'Szczegóły serwisu',
      width: '900px',
      style: { 'max-width': '90%' },
      contentStyle: { 'padding': '0' },
      data: { service, serviceBookId },
      baseZIndex: 10000,
      dismissableMask: true
    }).onClose;
  }

  openCreateService(serviceBookId: string): Observable<any> {
    return this.dialogService.open(CreateServiceComponent, {
      width: '900px',
      style: { 'max-width': '80%' },
      data: { serviceBookId },
      baseZIndex: 10000,
      dismissableMask: true
    }).onClose;
  }
}
