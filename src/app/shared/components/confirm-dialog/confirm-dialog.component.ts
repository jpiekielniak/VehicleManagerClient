import { Component, inject } from '@angular/core';
import { ButtonDirective } from "primeng/button";
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [ButtonDirective],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
  protected readonly dialogRef = inject(DynamicDialogRef);
  protected readonly config = inject(DynamicDialogConfig);

  protected message = this.config.data?.message ?? 'Czy na pewno chcesz usunąć wybrany element?';

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
