import { Component, inject, Input, OnDestroy } from '@angular/core';
import { AccordionModule } from "primeng/accordion";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { TooltipModule } from "primeng/tooltip";
import { DialogService } from "primeng/dynamicdialog";
import { finalize, Subject, takeUntil } from 'rxjs';
import { Service } from "../../types/service.type";
import { Inspection } from "../../types/inspection.type";
import { AccordionTabComponent } from "../accordion-tab/accordion-tab.component";
import { ServiceBookService } from "../../services/serviceBook/service-book.service";
import { ServiceDialogService } from "../../services/dialogs/service/service-dialog.service";
import { InspectionDialogService } from "../../services/dialogs/inspection/inspection-dialog.service";
import { ConfirmDialogService } from "../../../../../shared/services/dialogs/confirm/confirm-dialog.service";
import { ToastService } from '../../../../../shared/services/toast/toast.service';

interface ServiceBookState {
  services: Service[];
  inspections: Inspection[];
  isLoadingServices: boolean;
  isLoadingInspections: boolean;
}

@Component({
  selector: 'app-service-book-tab',
  standalone: true,
  imports: [
    AccordionModule,
    ProgressSpinnerModule,
    TooltipModule,
    AccordionTabComponent
  ],
  providers: [
    InspectionDialogService,
    DialogService,
    ConfirmDialogService,
    ToastService
  ],
  templateUrl: './service-book-tab.component.html',
  styleUrl: './service-book-tab.component.css'
})
export class ServiceBookTabComponent implements OnDestroy {
  @Input({ required: true }) serviceBookId!: string;

  private readonly destroy$ = new Subject<void>();
  private readonly serviceDialog = inject(ServiceDialogService);
  private readonly inspectionDialog = inject(InspectionDialogService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly serviceBookService = inject(ServiceBookService);
  private readonly toastService = inject(ToastService);

  protected state: ServiceBookState = {
    services: [],
    inspections: [],
    isLoadingServices: false,
    isLoadingInspections: false
  };

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadServices(): void {
    if (this.state.services.length === 0) {
      this.state.isLoadingServices = true;

      this.serviceBookService.getServices(this.serviceBookId)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => this.state.isLoadingServices = false)
        )
        .subscribe({
          next: (response) => {
            this.state.services = response.items || [];
          },
          error: this.toastService.showError.bind(this, 'Błąd podczas pobierania serwisów')
        });
    }
  }

  loadInspections(): void {
    if (this.state.inspections.length === 0) {
      this.state.isLoadingInspections = true;

      this.serviceBookService.getInspections(this.serviceBookId)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => this.state.isLoadingInspections = false)
        )
        .subscribe({
          next: (response) => {
            this.state.inspections = response.items || [];
          },
          error: this.toastService.showError.bind(this, 'Błąd podczas pobierania przeglądów')
        });
    }
  }

  addService(): void {
    this.serviceDialog.openCreateService(this.serviceBookId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.refreshData();
        }
      });
  }

  addInspection(): void {
    this.inspectionDialog.openCreateInspection(this.serviceBookId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.refreshData();
        }
      });
  }

  async deleteService(serviceId: string): Promise<void> {
    try {
      await this.serviceBookService.deleteService(this.serviceBookId, serviceId)
        .pipe(takeUntil(this.destroy$))
        .toPromise();

      this.toastService.showSuccess('Serwis został usunięty');

      this.refreshData();
    } catch (error) {
      this.toastService.showError('Błąd podczas usuwania serwisu');
    }
  }

  confirmServiceDelete(serviceId: string): void {
    const service = this.state.services.find(s => s.id === serviceId);
    if (!service) return;

    this.confirmDialog.openConfirmDialog(service.title)
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.deleteService(serviceId);
        }
      });
  }

  async deleteInspection(inspectionId: string): Promise<void> {
    try {
      await this.serviceBookService.deleteInspection(this.serviceBookId, inspectionId)
        .pipe(takeUntil(this.destroy$))
        .toPromise();

      this.toastService.showSuccess('Przegląd został usunięty');

      this.refreshData();
    } catch (error) {
      this.toastService.showError('Błąd podczas usuwania przeglądu');
    }
  }

  confirmInspectionDelete(inspectionId: string): void {
    const inspection = this.state.inspections.find(i => i.id === inspectionId);
    if (!inspection) return;

    this.confirmDialog.openConfirmDialog(inspection.title)
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.deleteInspection(inspectionId);
        }
      });
  }

  openServiceDetails(serviceId: string): void {
    const service = this.state.services.find(s => s.id === serviceId);
    if (service) {
      this.serviceDialog.openServiceDetails(service, this.serviceBookId);
    }
  }

  openInspectionDetails(inspectionId: string): void {
    const inspection = this.state.inspections.find(i => i.id === inspectionId);
    if (inspection) {
      this.inspectionDialog.openInspectionDetails(inspection, this.serviceBookId);
    }
  }

  private refreshData(): void {
    this.state.services = [];
    this.state.inspections = [];
    this.loadServices();
    this.loadInspections();
  }
}
