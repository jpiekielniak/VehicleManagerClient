import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { switchMap } from "rxjs";
import { ReactiveFormsModule } from '@angular/forms';
import { VehicleService } from "../../services/vehicle/vehicle.service";
import { VehicleDetails } from "../../types/vehicle-details";

import { CommonModule } from '@angular/common';

import {MaterialImports} from "../../imports/material.imports";
import {MatDialog} from "@angular/material/dialog";
import {VehicleEditDialogComponent} from "../vehicle-edit-dialog/vehicle-edit-dialog.component";

@Component({
  selector: 'app-vehicle-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...MaterialImports
  ],
  templateUrl: './vehicle-details.component.html',
  styleUrl: './vehicle-details.component.css'
})
export class VehicleDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private vehicleService = inject(VehicleService);
  private dialog = inject(MatDialog);

  vehicleId: string = '';
  vehicle: VehicleDetails | null = null;

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
      },
      error: (err) => {
        console.error('Failed to fetch vehicle details', err);
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
}
