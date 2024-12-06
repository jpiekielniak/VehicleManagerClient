import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmDialogComponent } from "../../../components/confirm-dialog/confirm-dialog.component";

@Injectable({
  providedIn: 'root',
  deps: [DialogService, DynamicDialogRef]
})
export class ConfirmDialogService {
  private dialogRef: DynamicDialogRef | undefined;

  constructor(private dialogService: DialogService) {}

  openConfirmDialog(itemName?: string): Observable<boolean> {
    const message = `Czy na pewno chcesz usunąć wpis ${itemName}?`

    this.dialogRef = this.dialogService.open(ConfirmDialogComponent, {
      width: '400px',
      contentStyle: {
        overflow: 'hidden',
        padding: 0,
        border: 'none',
        background: 'white',
        borderRadius: '12px'
      },
      baseZIndex: 10000,
      dismissableMask: true,
      showHeader: false,
      style: {
        border: 'none',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      },
      data: { message }
    });

    return this.dialogRef.onClose;
  }
}
