import {Component, inject, OnInit} from '@angular/core';
import {MaterialImports} from "../../../../../imports/material.imports";
import {DatePipe} from "@angular/common";
import {MAT_DIALOG_DATA, MatDialogClose} from "@angular/material/dialog";
import {ServiceBookService} from "../../services/serviceBook/service-book.service";
import {InspectionDetails} from "../../types/inspection-details.type";

@Component({
  selector: 'app-inspection-details',
  standalone: true,
  imports: [
    MaterialImports,
    DatePipe,
    MatDialogClose
  ],
  templateUrl: './inspection-details.component.html',
  styleUrl: './inspection-details.component.css'
})
export class InspectionDetailsComponent implements OnInit{
  protected readonly data = inject(MAT_DIALOG_DATA);
  private readonly serviceBookService = inject(ServiceBookService);
  loadingInspectionDetails = false;
  inspectionDetails: any;

  ngOnInit() {
    this.getInspectionDetails(this.data.inspection.id);
  }

  getInspectionDetails(inspectionId: string) {
    this.loadingInspectionDetails = true;

    this.serviceBookService.getInspection(this.data.serviceBookId, inspectionId).subscribe({
      next: (response: InspectionDetails) => {
        this.inspectionDetails = response;
        this.loadingInspectionDetails = false;
      },
      error: (err) => {
        console.error('Failed to fetch service details', err);
        this.loadingInspectionDetails = false;
      }
    });
  }
}
