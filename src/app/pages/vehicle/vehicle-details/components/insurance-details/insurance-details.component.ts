import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {DatePipe, NgClass, NgIf} from "@angular/common";
import { Subject, takeUntil, finalize } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { VehicleService } from "../../../services/vehicle/vehicle.service";
import { InsuranceDetails } from "../../types/insurance-details.type";
import { ToastService } from '../../../../../shared/services/toast/toast.service';

interface InsuranceState {
  loading: boolean;
  details: InsuranceDetails | null;
}

@Component({
  selector: 'app-insurance-details',
  standalone: true,
  imports: [
    DatePipe,
    ButtonModule,
    CardModule,
    DividerModule,
    ProgressSpinnerModule,
    NgClass,
    NgIf
  ],
  providers:[ToastService],
  templateUrl: './insurance-details.component.html',
  styleUrl: './insurance-details.component.css'
})
export class InsuranceDetailsComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly vehicleService = inject(VehicleService);
  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);
  private readonly toastService = inject(ToastService);

  protected state: InsuranceState = {
    loading: false,
    details: null,
  };

  ngOnInit(): void {
    this.loadInsuranceDetails();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadInsuranceDetails(): void {
    const { vehicleId, insurance } = this.config.data;

    this.state = { ...this.state, loading: true };

    this.vehicleService.getInsurance(vehicleId, insurance.insuranceId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.state = { ...this.state, loading: false };
        })
      )
      .subscribe({
        next: (response: InsuranceDetails) => {
          this.state = {
            ...this.state,
            details: response,
          };
        },
        error: (error) => {
          this.state = {
            ...this.state,
          };
          this.toastService.showError('Nie udało się pobrać szczegółów ubezpieczenia');
        }
      });
  }

  isInsuranceActive(): boolean {
    if (!this.state.details?.validTo) return false;
    return new Date(this.state.details.validTo) > new Date();
  }

  close(): void {
    this.dialogRef.close();
  }
}
