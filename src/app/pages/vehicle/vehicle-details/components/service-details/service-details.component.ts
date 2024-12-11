import { Component, inject, OnInit } from '@angular/core';
import { SumByPipe } from "./pipes/sum-by.pipe";
import {DatePipe, DecimalPipe, NgIf} from "@angular/common";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { MessageModule } from "primeng/message";
import { ButtonModule } from "primeng/button";
import { DynamicDialogRef, DynamicDialogConfig } from "primeng/dynamicdialog";
import { ServiceBookService } from "../../services/serviceBook/service-book.service";
import { ServiceDetails } from "../../types/service-details.type";
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [
    SumByPipe,
    DatePipe,
    CardModule,
    TableModule,
    MessageModule,
    ButtonModule,
    ProgressSpinnerModule,
    NgIf,
    DecimalPipe
  ],
  templateUrl: './service-details.component.html',
  styleUrl: './service-details.component.css'
})
export class ServiceDetailsComponent implements OnInit {
  private readonly serviceBookService = inject(ServiceBookService);
  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);

  loadingServiceDetails = false;
  serviceDetails: any;

  ngOnInit() {
    this.getServiceDetails(this.config.data.service.id);
  }

  getServiceDetails(serviceId: string) {
    this.loadingServiceDetails = true;

    this.serviceBookService.getService(this.config.data.serviceBookId, serviceId).subscribe({
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

  close() {
    this.dialogRef.close();
  }
}
