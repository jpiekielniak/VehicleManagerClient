import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {EnumService, EnumType} from "../../services/enum/enum.service";
import {MatDialogRef} from "@angular/material/dialog";
import {MaterialImports} from "../../imports/material.imports";
import {NgForOf} from "@angular/common";
import {API_CONSTANTS} from "../../constants/api.constants";
import {VehicleService} from "../../services/vehicle/vehicle.service";
import {CreateVehicle} from "../../types/create-vehicle";
import {forkJoin, Subject, takeUntil} from "rxjs";
import {AlertComponent} from "@coreui/angular";

interface EnumData {
  fuelTypes: EnumType[];
  gearboxTypes: EnumType[];
  vehicleTypes: EnumType[];
}

@Component({
  selector: 'app-create-vehicle',
  standalone: true,
  imports: [...MaterialImports, NgForOf, ReactiveFormsModule, AlertComponent],
  templateUrl: './create-vehicle.component.html',
  styleUrl: './create-vehicle.component.css'
})
export class CreateVehicleComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private formBuilder = inject(FormBuilder);
  private enumService = inject(EnumService);
  private vehicleService = inject(VehicleService);
  protected dialogRef = inject(MatDialogRef<CreateVehicleComponent>);

  isError = signal(false);
  createVehicleForm!: FormGroup;
  currentYear = new Date().getFullYear();
  fuelTypes: EnumType[] = [];
  gearboxTypes: EnumType[] = [];
  vehicleTypes: EnumType[] = [];

  ngOnInit(): void {
    this.initializeForm();
    this.loadEnumValues();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.createVehicleForm = this.formBuilder.group({
      brand: ['', [Validators.required, Validators.maxLength(50)]],
      model: ['', [Validators.required, Validators.maxLength(50)]],
      year: [null, [Validators.required, Validators.min(1900), Validators.max(this.currentYear)]],
      licensePlate: ['', [Validators.required, Validators.maxLength(10)]],
      vin: ['', [Validators.required, Validators.minLength(17), Validators.maxLength(17)]],
      engineCapacity: [null, [Validators.required, Validators.min(0), Validators.max(10_000)]],
      enginePower: [null, [Validators.required, Validators.min(0), Validators.max(10_000)]],
      fuelType: [null, [Validators.required]],
      gearboxType: [null, [Validators.required]],
      vehicleType: [null, [Validators.required]]
    });
  }

  private loadEnumValues(): void {
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

  handleEnumResponse(response: EnumData): void {
    this.fuelTypes = response.fuelTypes;
    this.gearboxTypes = response.gearboxTypes;
    this.vehicleTypes = response.vehicleTypes;
  }

  handleError(): void {
    this.isError.set(true);
    setTimeout(() => {
      this.isError.set(false);
    }, 3000);
  }

  onSubmit() {
    if (this.createVehicleForm.valid) {
      this.vehicleService.createVehicle(this.createVehicleForm.value as CreateVehicle)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: this.dialogRef.close.bind(this.dialogRef),
          error: this.handleError.bind(this)
        });
    }
  }
}
