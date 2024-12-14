import { Component, inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DatePipe, DecimalPipe, NgIf } from "@angular/common";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { MessageModule } from "primeng/message";
import { ButtonModule } from "primeng/button";
import { DynamicDialogRef, DynamicDialogConfig } from "primeng/dynamicdialog";
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { firstValueFrom } from 'rxjs';

import { ServiceBookService } from "../../services/serviceBook/service-book.service";
import { ServiceDetails } from "../../types/service-details.type";
import { ToastService } from '../../../../../shared/services/toast/toast.service';

interface ServiceDetailsState {
  isLoading: boolean;
  serviceDetails: ServiceDetails | null;
  error: string | null;
}

@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [
    DatePipe,
    CardModule,
    TableModule,
    MessageModule,
    ButtonModule,
    ProgressSpinnerModule,
    NgIf,
    DecimalPipe
  ],
  providers: [ToastService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './service-details.component.html',
  styleUrl: './service-details.component.scss'
})
export class ServiceDetailsComponent implements OnInit {
  private readonly serviceBookService = inject(ServiceBookService);
  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);
  private readonly toastService = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);

  protected state: ServiceDetailsState = {
    isLoading: false,
    serviceDetails: null,
    error: null
  };

  ngOnInit(): void {
    this.loadServiceDetails();
  }

  protected async loadServiceDetails(): Promise<void> {
    if (!this.config.data?.service?.id || !this.config.data?.serviceBookId) {
      this.handleError('Brak wymaganych danych');
      return;
    }

    try {
      this.state.isLoading = true;
      this.cdr.detectChanges();

      const serviceId = this.config.data.service.id;
      const serviceBookId = this.config.data.serviceBookId;

      const response = await firstValueFrom(
        this.serviceBookService.getService(serviceBookId, serviceId)
      );

      this.updateState(response);
    } catch (error) {
      this.handleError('Nie udało się pobrać szczegółów serwisu');
    } finally {
      this.state.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  protected close(): void {
    this.dialogRef.close();
  }

  private updateState(serviceDetails: ServiceDetails): void {
    this.state.serviceDetails = serviceDetails;
    this.state.error = null;
    this.cdr.detectChanges();
  }

  private handleError(message: string): void {
    this.state.error = message;
    this.toastService.showError(message);
    this.cdr.detectChanges();
  }

  protected getTotalCost(): number {
    return this.state.serviceDetails?.costs?.reduce((sum, cost) =>
      sum + (cost.amount || 0), 0
    ) || 0;
  }

  protected hasCosts(): boolean {
    return Array.isArray(this.state.serviceDetails?.costs) &&
      this.state.serviceDetails.costs.length > 0;
  }
}
