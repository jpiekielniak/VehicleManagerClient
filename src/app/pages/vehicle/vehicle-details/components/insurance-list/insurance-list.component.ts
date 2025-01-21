import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  Output
} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {CardModule} from "primeng/card";
import {TabViewModule} from "primeng/tabview";
import {Button, ButtonDirective} from "primeng/button";
import {MenuModule} from "primeng/menu";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {firstValueFrom} from 'rxjs';

import {Insurance} from "../../types/insurance.type";
import {VehicleService} from "../../../services/vehicle/vehicle.service";
import {InsuranceDialogService} from "../../services/dialogs/insurance/insurance-dialog.service";
import {ConfirmDialogService} from "../../../../../shared/services/dialogs/confirm/confirm-dialog.service";
import {ToastService} from '../../../../../shared/services/toast/toast.service';
import {LoadingSpinnerComponent} from "../../../../../shared/components/loading-spinner/loading-spinner.component";

interface InsuranceState {
  insurances: Insurance[];
  isLoading: boolean;
  isInitialized: boolean;
  isOperationInProgress: boolean;
}

@Component({
  selector: 'app-insurance-list',
  standalone: true,
  imports: [
    CardModule,
    NgIf,
    TabViewModule,
    Button,
    NgForOf,
    MenuModule,
    ProgressSpinnerModule,
    ButtonDirective,
    LoadingSpinnerComponent
  ],
  providers: [ToastService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './insurance-list.component.html',
  styleUrl: './insurance-list.component.css'
})
export class InsuranceListComponent {
  @Input() vehicleId!: string;
  @Output() onView = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<string>();
  @Output() onAdd = new EventEmitter<void>();

  private readonly vehicleService = inject(VehicleService);
  private readonly insuranceDialog = inject(InsuranceDialogService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly toastService = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);

  protected state: InsuranceState = {
    insurances: [],
    isLoading: false,
    isInitialized: false,
    isOperationInProgress: false
  };

  async loadInsurances(): Promise<void> {
    if (this.state.isInitialized || this.state.isOperationInProgress) {
      return;
    }

    try {
      this.state.isLoading = true;
      this.state.isOperationInProgress = true;
      this.cdr.detectChanges();

      const response = await firstValueFrom(
        this.vehicleService.getInsurances(this.vehicleId)
      );

      this.state.insurances = response.items || [];
      this.state.isInitialized = true;

    } catch (error) {
      this.toastService.showError('Nie udało się pobrać ubezpieczeń');
    } finally {
      this.state.isLoading = false;
      this.state.isOperationInProgress = false;
      this.cdr.detectChanges();
    }
  }

  async openInsuranceDetails(insuranceId: string): Promise<void> {
    if (this.state.isOperationInProgress) return;

    const insurance = this.state.insurances.find(i => i.insuranceId === insuranceId);
    if (!insurance) return;

    try {
      this.state.isOperationInProgress = true;
      await this.insuranceDialog.openInsuranceDetails(insurance, this.vehicleId);
    } finally {
      this.state.isOperationInProgress = false;
      this.cdr.detectChanges();
    }
  }

  async deleteInsurance(insuranceId: string): Promise<void> {
    try {
      this.vehicleService.deleteInsurance(this.vehicleId, insuranceId)
        .subscribe(() => {
          this.toastService.showSuccess('Ubezpieczenie zostało usunięte');
          this.refreshData();
        })

    } catch (error) {
      this.toastService.showError('Nie udało się usunąć ubezpieczenia');
    } finally {
      this.state.isOperationInProgress = false;
      this.cdr.detectChanges();
    }
  }

  async confirmInsuranceDelete(insuranceId: string): Promise<void> {
    if (this.state.isOperationInProgress) return;

    const insurance = this.state.insurances.find(i => i.insuranceId === insuranceId);
    if (!insurance) return;

    try {
      this.state.isOperationInProgress = true;
      const result = await firstValueFrom(
        this.confirmDialog.openConfirmDialog(insurance.title)
      );
      if (result) {
        await this.deleteInsurance(insuranceId);
      }
    } finally {
      this.state.isOperationInProgress = false;
      this.cdr.detectChanges();
    }
  }

  async addInsurance(): Promise<void> {
    if (this.state.isOperationInProgress) return;

    try {
      this.state.isOperationInProgress = true;
      this.insuranceDialog.openCreateInsurance(this.vehicleId)
        .subscribe(result => {
          if (result) {
            this.refreshData();
          }
        });

    } finally {
      this.state.isOperationInProgress = false;
      this.cdr.detectChanges();
    }
  }

  private async refreshData(): Promise<void> {
    this.state.isInitialized = false;
    await this.loadInsurances();
  }
}
