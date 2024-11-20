import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {switchMap} from "rxjs";
import {ReactiveFormsModule} from '@angular/forms';
import {VehicleService} from "../../services/vehicle/vehicle.service";
import {VehicleDetails} from "../../types/vehicle-details.type";
import {CommonModule} from '@angular/common';
import {MaterialImports} from "../../imports/material.imports";
import {MatDialog} from "@angular/material/dialog";
import {VehicleEditDialogComponent} from "../vehicle-edit-dialog/vehicle-edit-dialog.component";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MatList, MatListItem} from "@angular/material/list";
import {ServiceBookService} from "../../services/serviceBook/service-book.service";
import {Service} from "../../types/service.type";
import {Inspection} from "../../types/inspection.type";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {ServiceDetailsComponent} from "../service-details/service-details.component";
import {InspectionDetailsComponent} from "../inspection-details/inspection-details.component";
import {Insurance} from "../../types/insurance.type";
import {InsuranceDetailsComponent} from "../insurance-details/insurance-details.component";

@Component({
  selector: 'app-vehicle-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...MaterialImports,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelDescription,
    MatExpansionPanelTitle,
    MatList,
    MatListItem,
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
  }

  loadServices() {
    this.serviceBookService.getServices(this.vehicle?.serviceBookId!).subscribe({
      next: (response: any) => {
        this.services = response.items || [];
      },
      error: (err) => {
        console.error('Failed to fetch services', err);
      }
    });
  }

  loadInspection() {
    this.serviceBookService.getInspections(this.vehicle?.serviceBookId!).subscribe({
      next: (response: any) => {
        this.inspections = response.items || [];
      },
      error: (err) => {
        console.error('Failed to fetch inspections', err);
      }
    })
  }

  openEditDialog() {
    const dialogRef = this.dialog.open(VehicleEditDialogComponent, {
      width: '1200px',
      data: {vehicle: this.vehicle}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.vehicle = result;
      }
    });
  }

  confirmInspectionDelete(inspection: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Potwierdzenie usunięcia',
        message: `Czy na pewno chcesz usunąć przegląd '${inspection.title}'?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteInspection(inspection.id);
      }
    });
  }

  confirmServiceDelete(service: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Potwierdzenie usunięcia',
        message: `Czy na pewno chcesz usunąć przegląd '${service.title}'?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteService(service.id);
      }
    });
  }

  deleteInspection(inspectionId: string) {
    this.serviceBookService.deleteInspection(this.vehicle?.serviceBookId!, inspectionId).subscribe({
      next: this.loadInspection.bind(this),
      error: (error) => {
        console.error(error);
      }
    });
  }

  deleteService(serviceId: string) {
    this.serviceBookService.deleteService(this.vehicle?.serviceBookId!, serviceId).subscribe({
      next: this.loadServices.bind(this),
      error: (error) => {
        console.error(error);
      }
    });
  }

  openServiceDetails(service : any) {
    this.dialog.open(ServiceDetailsComponent, {
      width: '600px',
      data: {service, serviceBookId: this.vehicle?.serviceBookId}
    });
  }

  openInspectionDetails(inspection : any) {
    this.dialog.open(InspectionDetailsComponent, {
      width: '600px',
      data: {inspection, serviceBookId: this.vehicle?.serviceBookId}
    });
  }

  loadInsurances() {
    this.vehicleService.getInsurances(this.vehicleId).subscribe({
      next: (response: any) => {
        this.insurances = response.items || [];
      },
      error: (err) => {
        console.error('Failed to fetch insurances', err);
      }
    })
  }

  confirmInsuranceDelete(insurance: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Potwierdzenie usunięcia',
        message: `Czy na pewno chcesz usunąć ubezpieczenie '${insurance.title}'?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteInsurance(insurance.insuranceId);
      }
    });
  }

  deleteInsurance(insuranceId : string) {
    this.vehicleService.deleteInsurance(insuranceId).subscribe({
      next: this.loadInsurances.bind(this),
      error: (error) => {
        console.error(error);
      }
    })
  }

  openInsuranceDetails(insurance: Insurance) {
    this.dialog.open(InsuranceDetailsComponent, {
      width: '600px',
      data: {insurance, vehicleId: this.vehicleId}
    });
  }
}
