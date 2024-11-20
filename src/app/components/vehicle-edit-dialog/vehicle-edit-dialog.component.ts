import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {VehicleService} from "../../services/vehicle/vehicle.service";
import {VehicleDetails} from "../../types/vehicle-details.type";
import {CommonModule} from '@angular/common';
import {MaterialImports} from "../../imports/material.imports";
import {EnumService} from "../../services/enum/enum.service";
import {finalize, forkJoin, Subject, takeUntil} from "rxjs";
import {API_CONSTANTS} from "../../constants/api.constants";
import {Enum} from "../../types/enum.type";
import {EnumData} from "../../types/enum-data.type";


@Component({
  selector: 'app-vehicle-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...MaterialImports
  ],
  templateUrl: './vehicle-edit-dialog.component.html',
  styleUrls: ['./vehicle-edit-dialog.component.css']
})
export class VehicleEditDialogComponent implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly vehicleService = inject(VehicleService);
  private readonly enumService = inject(EnumService);
  private readonly dialogRef = inject(MatDialogRef<VehicleEditDialogComponent>);
  private readonly data = inject(MAT_DIALOG_DATA) as { vehicle: VehicleDetails };
  private readonly destroy$ = new Subject<void>();
  vehicleForm!: FormGroup;
  fuelTypes: Enum[] = [];
  gearboxTypes: Enum[] = [];
  vehicleTypes: Enum[] = [];
  isLoading = signal(false);

  ngOnInit() {
    this.loadEnumValues();
    this.initializeForm();
    this.isLoading.set(false);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm() {
    this.vehicleForm = this.formBuilder.group({
      brand: [this.data.vehicle.brand, Validators.required],
      model: [this.data.vehicle.model, Validators.required],
      year: [this.data.vehicle.year, [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      licensePlate: [this.data.vehicle.licensePlate, Validators.required],
      vin: [this.data.vehicle.vin, [Validators.required, Validators.minLength(17), Validators.maxLength(17)]],
      engineCapacity: [this.data.vehicle.engineCapacity, [Validators.required, Validators.min(0)]],
      enginePower: [this.data.vehicle.enginePower, [Validators.required, Validators.min(0)]],
      gearboxType: [this.data.vehicle.gearboxType, [Validators.required]],
      fuelType: [this.data.vehicle.fuelType, [Validators.required]],
      vehicleType: [this.data.vehicle.vehicleType, [Validators.required]]
    });
  }

  private loadEnumValues(): void {
    this.isLoading.set(true);
    forkJoin({
      fuelTypes: this.enumService.getEnumValues(API_CONSTANTS.ENUMS.FUEL_TYPES),
      gearboxTypes: this.enumService.getEnumValues(API_CONSTANTS.ENUMS.GEARBOX_TYPES),
      vehicleTypes: this.enumService.getEnumValues(API_CONSTANTS.ENUMS.VEHICLE_TYPES)
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (result: EnumData) => this.handleEnumResponse(result)
    });
  }

  saveChanges() {
    if (this.vehicleForm.valid) {
      this.isLoading.set(true);
      this.vehicleForm.patchValue({
        gearboxType: this.gearboxTypes.find(type => type.value === this.vehicleForm.value.gearboxType)?.key,
        fuelType: this.fuelTypes.find(type => type.value === this.vehicleForm.value.fuelType)?.key,
        vehicleType: this.vehicleTypes.find(type => type.value === this.vehicleForm.value.vehicleType)?.key
      })

      const updatedVehicle = {...this.data.vehicle, ...this.vehicleForm.value};
      this.vehicleService.update(this.data.vehicle.id, updatedVehicle)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => this.isLoading.set(false))
        )
        .subscribe({
          next: (response) => {
            this.dialogRef.close(response);
            this.isLoading.set(false);
            window.location.reload();
          },
          error: (err) => {
            console.error('Failed to update vehicle', err);
          }
        });
    }
  }

  cancelEdit() {
    this.dialogRef.close();
  }

  private handleEnumResponse(result: EnumData) {
    this.fuelTypes = result.fuelTypes;
    this.gearboxTypes = result.gearboxTypes;
    this.vehicleTypes = result.vehicleTypes;
  }
}
