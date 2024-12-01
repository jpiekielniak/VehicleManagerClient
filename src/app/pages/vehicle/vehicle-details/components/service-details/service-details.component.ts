import {Component, inject, OnInit} from '@angular/core';
import {MaterialImports} from "../../../../../imports/material.imports";
import {MAT_DIALOG_DATA, MatDialogClose} from "@angular/material/dialog";
import {SumByPipe} from "./pipes/sum-by.pipe";
import {CurrencyPipe, DatePipe, NgForOf} from "@angular/common";
import {ServiceBookService} from "../../services/serviceBook/service-book.service";
import {ServiceDetails} from "../../types/service-details.type";

@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [
    MaterialImports,
    MatDialogClose,
    SumByPipe,
    CurrencyPipe,
    DatePipe,
    NgForOf
  ],
  templateUrl: './service-details.component.html',
  styleUrl: './service-details.component.css'
})
export class ServiceDetailsComponent implements OnInit {
  protected readonly data = inject(MAT_DIALOG_DATA);
  private readonly serviceBookService = inject(ServiceBookService);
  loadingServiceDetails = false;
  serviceDetails: any;

  ngOnInit() {
    this.getServiceDetails(this.data.service.id);
  }

  getServiceDetails(serviceId: string) {
    this.loadingServiceDetails = true;

    this.serviceBookService.getService(this.data.serviceBookId, serviceId).subscribe({
      next: (response: ServiceDetails) => {
        this.serviceDetails = response;
        this.loadingServiceDetails = false;
      },
      error: (err) => {
        console.error('Failed to fetch service details', err);
        this.loadingServiceDetails = false;
      }
    });
  }
}
