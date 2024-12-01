import {Component, inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogClose} from "@angular/material/dialog";
import {VehicleService} from "../../../services/vehicle/vehicle.service";
import {InsuranceDetails} from "../../types/insurance-details.type";
import {MaterialImports} from "../../../../../imports/material.imports";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-insurance-details',
  standalone: true,
  imports: [
    MaterialImports,
    MatDialogClose,
    DatePipe
  ],
  templateUrl: './insurance-details.component.html',
  styleUrl: './insurance-details.component.css'
})
export class InsuranceDetailsComponent implements OnInit {
  protected readonly data = inject(MAT_DIALOG_DATA);
  private readonly vehicleService = inject(VehicleService);
  loadingInsuranceDetails = false;
  insuranceDetails: any;

  ngOnInit() {
    this.getInsuranceDetails(this.data.insurance.insuranceId);
  }

  getInsuranceDetails(inspectionId: string) {
    this.loadingInsuranceDetails = true;

    this.vehicleService.getInsurance(this.data.vehicleId, inspectionId).subscribe({
      next: (response: InsuranceDetails) => {
        this.insuranceDetails = response;
        this.loadingInsuranceDetails = false;
      },
      error: (err) => {
        console.error('Failed to fetch service insurance', err);
        this.loadingInsuranceDetails = false;
      }
    });
  }
}
