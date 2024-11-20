import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { switchMap } from "rxjs";
import { ReactiveFormsModule } from '@angular/forms';
import { VehicleService } from "../../services/vehicle/vehicle.service";
import {VehicleDetails} from "../../types/vehicle-details.type";

import { CommonModule } from '@angular/common';

import {MaterialImports} from "../../imports/material.imports";
import {MatDialog} from "@angular/material/dialog";
import {VehicleEditDialogComponent} from "../vehicle-edit-dialog/vehicle-edit-dialog.component";
import {
  MatAccordion,
  MatExpansionPanel, MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MatList, MatListItem} from "@angular/material/list";
import {MatLine} from "@angular/material/core";
import {ServiceBookService} from "../../services/serviceBook/service-book.service";
import {Service} from "../../types/service.type";
import {Inspection} from "../../types/inspection.type";

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
    MatLine
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
        console.error('Failed to fetch repairs', err);
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
      data: { vehicle: this.vehicle }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.vehicle = result;
      }
    });
  }
}
