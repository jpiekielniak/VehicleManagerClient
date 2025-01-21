import { Injectable } from '@angular/core';
import {Insurance} from "../../../types/insurance.type";
import {InsuranceDetailsComponent} from "../../../components/insurance-details/insurance-details.component";
import {Observable} from "rxjs";
import {CreateInsuranceComponent} from "../../../components/create-insurance/create-insurance.component";
import {DialogService} from "primeng/dynamicdialog";

@Injectable({
  providedIn: 'root'
})
export class InsuranceDialogService {
  constructor(private dialogService: DialogService) {}

  openInsuranceDetails(insurance: Insurance, vehicleId: string): Observable<void> {
    return this.dialogService.open(InsuranceDetailsComponent, {
      header: 'Szczegóły ubezpieczenia',
      width: '1050px',
      style: { 'max-width': '90%' },
      contentStyle: { 'padding': '0' },
      data: { insurance, vehicleId },
      baseZIndex: 10000,
      dismissableMask: true
    }).onClose;
  }

  openCreateInsurance(vehicleId: string): Observable<any> {
    return this.dialogService.open(CreateInsuranceComponent, {
      header: 'Dodaj nowe ubezpieczenie',
      width: '80vw',
      height: 'auto',
      style: { 'max-width': '100%' },
      data: { vehicleId },
      baseZIndex: 10000,
      dismissableMask: true
    }).onClose;
  }
}
