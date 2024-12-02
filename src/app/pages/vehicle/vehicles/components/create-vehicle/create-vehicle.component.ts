import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {EnumService} from "../../../../../shared/services/enum/enum.service";
import {API_CONSTANTS} from "../../../../../constants/api.constants";
import {VehicleService} from "../../../services/vehicle/vehicle.service";
import {CreateVehicle} from "../../types/create-vehicle.type";
import {finalize, forkJoin, Subject, takeUntil} from "rxjs";
import {Enum} from "../../../../../shared/types/enum.type";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {InputTextModule} from "primeng/inputtext";
import {InputNumberModule} from "primeng/inputnumber";
import {DropdownModule} from "primeng/dropdown";
import {ButtonModule} from "primeng/button";
import {ToastService} from "../../../../../shared/services/toast/toast.service";
import {EnumData} from "../../../../../shared/types/enum-data.type";
import {DialogModule} from "primeng/dialog";
import {NgIf} from "@angular/common";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-create-vehicle',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    ButtonModule,
    DialogModule,
    NgIf
  ],
  providers: [ToastService, MessageService, DynamicDialogRef],
  templateUrl: './create-vehicle.component.html',
  styleUrls: ['./create-vehicle.component.scss']
})
export class CreateVehicleComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private formBuilder = inject(FormBuilder);
  private enumService = inject(EnumService);
  private vehicleService = inject(VehicleService);
  private toastService = inject(ToastService);
  private ref = inject(DynamicDialogRef);

  createVehicleForm!: FormGroup;
  currentYear = new Date().getFullYear();
  fuelTypes: Enum[] = [];
  gearboxTypes: Enum[] = [];
  vehicleTypes: Enum[] = [];
  isSubmitting = false;


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
    this.toastService.showWarning('Błąd', 'Dodanie pojazdu nie powiodło się. Spróbuj ponownie.');
    this.ref.close(false);
  }

  onSubmit() {
    if (this.createVehicleForm.valid) {
      this.isSubmitting = true;
      this.vehicleService.createVehicle(this.createVehicleForm.value as CreateVehicle)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => this.isSubmitting = false)
        )
        .subscribe({
          next: () => {
            this.toastService.showSuccess('Sukces', 'Pojazd został dodany.');
            this.ref.close(true);
          },
          error: this.handleError.bind(this)
        });
    }
  }
}

