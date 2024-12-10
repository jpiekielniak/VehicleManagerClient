import {inject, Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Inspection } from '../../../types/inspection.type';
import { InspectionDetailsComponent } from '../../../components/inspection-details/inspection-details.component';
import { CreateInspectionComponent } from '../../../components/create-inspection/create-inspection.component';

const DIALOG_CONFIG: Partial<DynamicDialogConfig> = {
  width: '1050px',
  style: { 'max-width': '90%' },
  contentStyle: { padding: '0' },
  baseZIndex: 10000,
  dismissableMask: true
};

@Injectable({
  providedIn: 'root'
})
export class InspectionDialogService {
  private readonly dialogService = inject(DialogService);

  openInspectionDetails(inspection: Inspection, serviceBookId: string): Observable<void> {
    return this.dialogService.open(InspectionDetailsComponent, {
      ...DIALOG_CONFIG,
      header: 'Szczegóły przeglądu',
      data: { inspection, serviceBookId }
    }).onClose;
  }

  openCreateInspection(serviceBookId: string): Observable<unknown> {
    return this.dialogService.open(CreateInspectionComponent, {
      ...DIALOG_CONFIG,
      header: 'Nowy przegląd',
      data: { serviceBookId }
    }).onClose;
  }
}
