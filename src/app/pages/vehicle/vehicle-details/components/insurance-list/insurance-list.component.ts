import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {CardModule} from "primeng/card";
import {NgForOf, NgIf} from "@angular/common";
import {TabViewModule} from "primeng/tabview";
import {Button} from "primeng/button";
import {MenuModule} from "primeng/menu";
import {Insurance} from "../../types/insurance.type";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {VehicleService} from "../../../services/vehicle/vehicle.service";
import {InsuranceDialogService} from "../../services/dialogs/insurance/insurance-dialog.service";
import {ConfirmDialogService} from "../../../../../shared/services/dialogs/confirm/confirm-dialog.service";
import { ToastService } from '../../../../../shared/services/toast/toast.service';

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
    ProgressSpinnerModule
  ],
  templateUrl: './insurance-list.component.html',
  styleUrl: './insurance-list.component.css'
})
export class InsuranceListComponent  {
  @Input() vehicleId!: string;
  @Output() onView = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<string>();
  @Output() onAdd = new EventEmitter<void>();

  private readonly vehicleService = inject(VehicleService)
  private insuranceDialog = inject(InsuranceDialogService);
  private confirmDialog = inject(ConfirmDialogService);


  insurances: Insurance[] = [];
  isLoading = false;

  loadInsurances() {
    this.vehicleService.getInsurances(this.vehicleId).subscribe({
      next: (response: any) => {
        this.insurances = response.items || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch insurances', err);
        this.isLoading = false;
      }
    });
  }

  openInsuranceDetails(insuranceId: string) {
    const insurance = this.insurances.find(i => i.insuranceId === insuranceId);
    if (insurance) {
      this.insuranceDialog.openInsuranceDetails(insurance, this.vehicleId);
    }
  }

  deleteInsurance(insuranceId: string) {
    this.vehicleService.deleteInsurance(this.vehicleId, insuranceId).subscribe({
      next: () => {
        window.location.reload();
      },
      error: (error) => {
        console.error('Error deleting insurance:', error);
      }
    });
  }

  confirmInsuranceDelete(insuranceId: string): void {
    const insurance = this.insurances.find(i => i.insuranceId === insuranceId);
    if (insurance) {
      this.confirmDialog
        .openConfirmDialog(
          insurance.title
        )
        .subscribe(result => {
          if (result) {
            this.deleteInsurance(insuranceId);
          }
        });
    }
  }

  addInsurance() {
    this.insuranceDialog
      .openCreateInsurance(this.vehicleId)
      .subscribe(result => {
        if (result) {
          window.location.reload();
        }
      });
  }
}
