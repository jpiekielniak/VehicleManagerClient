import { Injectable } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Insurance} from "../../../types/insurance.type";
import {InsuranceDetailsComponent} from "../../../components/insurance-details/insurance-details.component";
import {Observable} from "rxjs";
import {CreateInsuranceComponent} from "../../../components/create-insurance/create-insurance.component";

@Injectable({
  providedIn: 'root'
})
export class InsuranceDialogService {
  constructor(private dialog: MatDialog) {}

  openInsuranceDetails(insurance: Insurance, vehicleId: string): Observable<void> {
    return this.dialog.open(InsuranceDetailsComponent, {
      width: '600px',
      data: { insurance, vehicleId }
    }).afterClosed();
  }

  openCreateInsurance(vehicleId: string): Observable<any> {
    return this.dialog.open(CreateInsuranceComponent, {
      width: '600px',
      data: vehicleId
    }).afterClosed();
  }
}
