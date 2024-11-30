import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { switchMap } from "rxjs";
import { ReactiveFormsModule } from '@angular/forms';
import { VehicleService } from "../../services/vehicle/vehicle.service";
import { VehicleDetails } from "../../types/vehicle-details.type";
import { CommonModule } from '@angular/common';
import { MaterialImports } from "../../imports/material.imports";
import { MatDialog } from "@angular/material/dialog";
import { VehicleEditDialogComponent } from "../vehicle-edit-dialog/vehicle-edit-dialog.component";
import { ServiceBookService } from "../../services/serviceBook/service-book.service";
import { Service } from "../../types/service.type";
import { Inspection } from "../../types/inspection.type";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";
import { ServiceDetailsComponent } from "../service-details/service-details.component";
import { InspectionDetailsComponent } from "../inspection-details/inspection-details.component";
import { Insurance } from "../../types/insurance.type";
import { InsuranceDetailsComponent } from "../insurance-details/insurance-details.component";
import { CreateInsuranceComponent } from "../create-insurance/create-insurance.component";
import { CreateServiceComponent } from "../create-service/create-service.component";
import { CreateInspectionComponent } from "../create-inspection/create-inspection.component";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { Button } from "primeng/button";
import {MenuItem, PrimeTemplate} from "primeng/api";
import { CardModule } from "primeng/card";
import { MenuModule } from "primeng/menu";
import { AccordionModule } from "primeng/accordion";
import {TabViewModule} from "primeng/tabview";
import {ToastModule} from "primeng/toast";

@Component({
  selector: 'app-vehicle-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...MaterialImports,
    ProgressSpinnerModule,
    Button,
    PrimeTemplate,
    CardModule,
    MenuModule,
    AccordionModule,
    TabViewModule,
    ToastModule,
  ],
  templateUrl: './vehicle-details.component.html',
  styleUrl: './vehicle-details.component.css'
})
export class VehicleDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private vehicleService = inject(VehicleService);
  private serviceBookService = inject(ServiceBookService);
  private dialog = inject(MatDialog);

  vehicleId: string = '';
  vehicle: VehicleDetails | null = null;
  services: Service[] = [];
  inspections: Inspection[] = [];
  insurances: Insurance[] = [];
  hoveredAction: string | null = null;

  isLoadingServices = false;
  isLoadingInspections = false;
  isLoadingInsurances = false;
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(params => {
        const vehicleId = params.get('id');
        this.vehicleId = vehicleId!;
        return this.vehicleService.getById(this.vehicleId);
      })
    ).subscribe({
      next: (response: VehicleDetails) => {
        this.vehicle = response;
        this.loadServices();
        this.loadInspection();
        this.loadInsurances();
      },
      error: (err) => {
        console.error('Failed to fetch vehicle details', err);
      }
    });

    this.items = [
      {
        label: 'Edytuj',
        icon: 'pi pi-pencil',
        command: () => this.openEditDialog()
      },
      {
        label: 'Usuń',
        icon: 'pi pi-trash',
        command: () => console.log("REMOVE")
      }
      ];
  }

  loadServices() {
    this.isLoadingServices = true;
    this.serviceBookService.getServices(this.vehicle?.serviceBookId!).subscribe({
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

  loadInspection() {
    this.isLoadingInspections = true;
    this.serviceBookService.getInspections(this.vehicle?.serviceBookId!).subscribe({
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

  loadInsurances() {
    this.isLoadingInsurances = true;
    this.vehicleService.getInsurances(this.vehicleId).subscribe({
      next: (response: any) => {
        this.insurances = response.items || [];
        this.isLoadingInsurances = false;
      },
      error: (err) => {
        console.error('Failed to fetch insurances', err);
        this.isLoadingInsurances = false;
      }
    });
  }

  openEditDialog() {
    const dialogRef = this.dialog.open(VehicleEditDialogComponent, {
      width: '1200px',
      data: { vehicle: this.vehicle }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.vehicle = result;
      }
    });
  }

  deleteService(serviceId: string) {
    if (this.vehicle?.serviceBookId) {
      this.serviceBookService.deleteService(this.vehicle.serviceBookId, serviceId).subscribe({
        next: () => {
          this.loadServices();
        },
        error: (error) => {
          console.error('Error deleting service:', error);
        }
      });
    }
  }

  deleteInspection(inspectionId: string) {
    if (this.vehicle?.serviceBookId) {
      this.serviceBookService.deleteInspection(this.vehicle.serviceBookId, inspectionId).subscribe({
        next: () => {
          this.loadInspection();
        },
        error: (error) => {
          console.error('Error deleting inspection:', error);
        }
      });
    }
  }

  deleteInsurance(insuranceId: string) {
    this.vehicleService.deleteInsurance(this.vehicleId, insuranceId).subscribe({
      next: () => {
        this.loadInsurances();
      },
      error: (error) => {
        console.error('Error deleting insurance:', error);
      }
    });
  }

  confirmServiceDelete(serviceId: string): void {
    const service = this.services.find(s => s.id === serviceId);
    if (service) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: {
          title: 'Potwierdzenie usunięcia',
          message: `Czy na pewno chcesz usunąć serwis '${service.title}'?`
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.deleteService(serviceId);
        }
      });
    }
  }

  confirmInspectionDelete(inspectionId: string): void {
    const inspection = this.inspections.find(i => i.id === inspectionId);
    if (inspection) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: {
          title: 'Potwierdzenie usunięcia',
          message: `Czy na pewno chcesz usunąć przegląd '${inspection.title}'?`
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.deleteInspection(inspectionId);
        }
      });
    }
  }

  confirmInsuranceDelete(insuranceId: string): void {
    const insurance = this.insurances.find(i => i.insuranceId === insuranceId);
    if (insurance) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: {
          title: 'Potwierdzenie usunięcia',
          message: `Czy na pewno chcesz usunąć ubezpieczenie '${insurance.title}'?`
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.deleteInsurance(insuranceId);
        }
      });
    }
  }

  openServiceDetails(serviceId: string) {
    const service = this.services.find(s => s.id === serviceId);
    if (service) {
      this.dialog.open(ServiceDetailsComponent, {
        width: '600px',
        data: { service, serviceBookId: this.vehicle?.serviceBookId }
      });
    }
  }

  openInspectionDetails(inspectionId: string) {
    const inspection = this.inspections.find(i => i.id === inspectionId);
    if (inspection) {
      this.dialog.open(InspectionDetailsComponent, {
        width: '600px',
        data: { inspection, serviceBookId: this.vehicle?.serviceBookId }
      });
    }
  }

  openInsuranceDetails(insuranceId: string) {
    const insurance = this.insurances.find(i => i.insuranceId === insuranceId);
    if (insurance) {
      this.dialog.open(InsuranceDetailsComponent, {
        width: '600px',
        data: { insurance, vehicleId: this.vehicleId }
      });
    }
  }

  addService() {
    const dialogRef = this.dialog.open(CreateServiceComponent, {
      width: '600px',
      data: { serviceBookId: this.vehicle?.serviceBookId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadServices();
      }
    });
  }

  addInspection() {
    const dialogRef = this.dialog.open(CreateInspectionComponent, {
      width: '600px',
      data: { serviceBookId: this.vehicle?.serviceBookId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadInspection();
      }
    });
  }

  addInsurance() {
    const dialogRef = this.dialog.open(CreateInsuranceComponent, {
      width: '600px',
      data: this.vehicleId
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadInsurances();
      }
    });
  }
}
