import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DatePipe, NgIf } from "@angular/common";
import { Subject, takeUntil, finalize } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ServiceBookService } from "../../services/serviceBook/service-book.service";
import { InspectionDetails } from "../../types/inspection-details.type";
import { ToastService } from '../../../../../shared/services/toast/toast.service';

interface InspectionState {
  loading: boolean;
  details: InspectionDetails | null;
}

@Component({
  selector: 'app-inspection-details',
  standalone: true,
  imports: [
    NgIf,
    DatePipe,
    ButtonModule,
    CardModule,
    DividerModule,
    ProgressSpinnerModule
  ],
  templateUrl: './inspection-details.component.html',
  styleUrl: './inspection-details.component.css'
})
export class InspectionDetailsComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly serviceBookService = inject(ServiceBookService);
  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);
  private readonly toastService = inject(ToastService);

  protected state: InspectionState = {
    loading: false,
    details: null,
  };

  ngOnInit(): void {
    this.loadInspectionDetails();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadInspectionDetails(): void {
    const { serviceBookId, inspection } = this.config.data;

    this.state = { ...this.state, loading: true };

    this.serviceBookService.getInspection(serviceBookId, inspection.id)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.state = { ...this.state, loading: false };
        })
      )
      .subscribe({
        next: (response: InspectionDetails) => {
          this.state = {
            ...this.state,
            details: response,
          };
        },
        error: () => {
          this.toastService.showError('Nie udało się pobrać szczegółów przeglądu');
        }
      });
  }

  close(): void {
    this.dialogRef.close();
  }
}
