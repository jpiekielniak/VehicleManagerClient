import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {AccordionModule} from "primeng/accordion";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {TooltipModule} from "primeng/tooltip";
import {Service} from "../../types/service.type";
import {AccordionTabComponent} from "../accordion-tab/accordion-tab.component";
import {Inspection} from "../../types/inspection.type";
import {ServiceBookService} from "../../services/serviceBook/service-book.service";
import {ServiceDialogService} from "../../services/dialogs/service/service-dialog.service";
import {InspectionDialogService} from "../../services/dialogs/inspection/inspection-dialog.service";
import {ConfirmDialogService} from "../../../../../shared/services/dialogs/confirm/confirm-dialog.service";
import {DialogService} from "primeng/dynamicdialog";

@Component({
  selector: 'app-service-book-tab',
  standalone: true,
  imports: [
    AccordionModule,
    ProgressSpinnerModule,
    TooltipModule,
    AccordionTabComponent
  ],
  providers: [InspectionDialogService, DialogService, ConfirmDialogService],
  templateUrl: './service-book-tab.component.html',
  styleUrl: './service-book-tab.component.css'
})
export class ServiceBookTabComponent {
  @Input() serviceBookId!: string;

  private serviceDialog = inject(ServiceDialogService);
  private inspectionDialog = inject(InspectionDialogService);
  private confirmDialog = inject(ConfirmDialogService);

  services: Service[] = [];
  inspections: Inspection[] = [];
  isLoadingServices = false;
  isLoadingInspections = false;

  @Output() onViewService = new EventEmitter<string>();
  @Output() onDeleteService = new EventEmitter<string>();
  @Output() onAddService = new EventEmitter<void>();

  @Output() onViewInspection = new EventEmitter<string>();
  @Output() onDeleteInspection = new EventEmitter<string>();
  @Output() onAddInspection = new EventEmitter<void>();

  constructor(private serviceBookService: ServiceBookService) {}

  loadServices() {
    if (!this.services.length) {
      this.isLoadingServices = true;
      this.serviceBookService.getServices(this.serviceBookId).subscribe({
        next: (response: any) => {
          this.services = response.items || [];
          this.isLoadingServices = false;
        },
        error: (err) => {
          console.error('Failed to fetch services', err);
          this.isLoadingServices = false;
        }
      });
    }
  }

  loadInspections() {
    if (!this.inspections.length) {
      this.isLoadingInspections = true;
      this.serviceBookService.getInspections(this.serviceBookId).subscribe({
        next: (response: any) => {
          this.inspections = response.items || [];
          this.isLoadingInspections = false;
        },
        error: (err) => {
          console.error('Failed to fetch inspections', err);
          this.isLoadingInspections = false;
        }
      });
    }
  }

  addService() {
    this.serviceDialog
      .openCreateService(this.serviceBookId!)
      .subscribe(result => {
        if (result) {
          window.location.reload();
        }
      });
  }

  addInspection() {
    this.inspectionDialog
      .openCreateInspection(this.serviceBookId!)
      .subscribe(result => {
        if (result) {
          window.location.reload();
        }
      });
  }

  deleteService(serviceId: string) {
    if (this.serviceBookId) {
      this.serviceBookService.deleteService(this.serviceBookId, serviceId).subscribe({
        next: () => {
          window.location.reload();
        },
        error: (error) => {
          console.error('Error deleting service:', error);
        }
      });
    }
  }

  confirmServiceDelete(serviceId: string): void {
    const service = this.services.find(s => s.id === serviceId);
    if (service) {
      this.confirmDialog
        .openConfirmDialog(
          service.title
        )
        .subscribe(result => {
          if (result) {
            this.deleteService(serviceId);
          }
        });
    }
  }

  deleteInspection(inspectionId: string) {
    if (this.serviceBookId) {
      this.serviceBookService.deleteInspection(this.serviceBookId, inspectionId).subscribe({
        next: () => {
          window.location.reload();
        },
        error: (error) => {
          console.error('Error deleting inspection:', error);
        }
      });
    }
  }

  confirmInspectionDelete(inspectionId: string): void {
    const inspection = this.inspections.find(i => i.id === inspectionId);
    if (inspection) {
      this.confirmDialog
        .openConfirmDialog(
          inspection.title
        )
        .subscribe(result => {
          if (result) {
            this.deleteInspection(inspectionId);
          }
        });
    }
  }

  openServiceDetails(serviceId: string) {
    const service = this.services.find(s => s.id === serviceId);
    if (service) {
      this.serviceDialog.openServiceDetails(service, this.serviceBookId!);
    }
  }

  openInspectionDetails(inspectionId: string) {
    const inspection = this.inspections.find(i => i.id === inspectionId);
    if (inspection) {
      this.inspectionDialog.openInspectionDetails(inspection, this.serviceBookId!);
    }
  }
}
