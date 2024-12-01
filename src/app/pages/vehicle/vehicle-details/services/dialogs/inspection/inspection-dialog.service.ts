import { Injectable } from '@angular/core';
import {Inspection} from "../../../types/inspection.type";
import {MatDialog} from "@angular/material/dialog";
import {InspectionDetailsComponent} from "../../../components/inspection-details/inspection-details.component";
import {Observable} from "rxjs";
import {CreateInspectionComponent} from "../../../components/create-inspection/create-inspection.component";

@Injectable({
  providedIn: 'root'
})
export class InspectionDialogService {
  constructor(private dialog: MatDialog) {}

  openInspectionDetails(inspection: Inspection, serviceBookId: string): Observable<void> {
    return this.dialog.open(InspectionDetailsComponent, {
      width: '600px',
      data: { inspection, serviceBookId }
    }).afterClosed();
  }

  openCreateInspection(serviceBookId: string): Observable<any> {
    return this.dialog.open(CreateInspectionComponent, {
      width: '600px',
      data: { serviceBookId }
    }).afterClosed();
  }
}
