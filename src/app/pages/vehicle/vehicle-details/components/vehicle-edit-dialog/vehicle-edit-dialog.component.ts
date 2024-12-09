import {Component, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AsyncPipe, NgIf} from '@angular/common';
import {BehaviorSubject, catchError, firstValueFrom, forkJoin, map, Observable, of, switchMap} from 'rxjs';
import {Button} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputTextModule} from 'primeng/inputtext';
import {CardModule} from 'primeng/card';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {API_CONSTANTS} from "../../../../../constants/api.constants";
import {Enum} from "../../../../../shared/types/enum.type";
import {VehicleService} from "../../../services/vehicle/vehicle.service";
import {EnumService} from "../../../../../shared/services/enum/enum.service";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ToastService} from "../../../../../shared/services/toast/toast.service";
import {VehicleType} from "../../types/vehicle.type";
import {EnumResponseType} from "../../types/enum.response.type";
import { FormErrorService } from '../../../../../shared/services/form/form-error.service';

@Component({
  selector: 'app-vehicle-edit-dialog',
  templateUrl: './vehicle-edit-dialog.component.html',
  styleUrls: ['./vehicle-edit-dialog.component.css'],
  standalone: true,
  imports: [
    NgIf,
    Button,
    DropdownModule,
    ReactiveFormsModule,
    InputNumberModule,
    InputTextModule,
    CardModule,
    ProgressSpinnerModule,
    AsyncPipe
  ],
  providers: [ToastService]
})
export class VehicleEditDialogComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly vehicleService = inject(VehicleService);
  private readonly enumService = inject(EnumService);
  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly formErrorService = inject(FormErrorService);
  protected readonly config = inject(DynamicDialogConfig);
  private readonly toastService = inject(ToastService);

  private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);
  protected readonly isLoading = signal(false);
  protected readonly vehicle = signal<VehicleType>(this.config.data.vehicle);
  protected readonly currentYear = new Date().getFullYear();

  protected readonly vehicleForm = this.initializeForm();
  protected readonly enumData$ = this.loadEnumValues();


  ngOnInit(): void {
    this.loadInitialData();
  }

  private initializeForm(): FormGroup {
    return this.formBuilder.group({
      brand: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-Z0-9\s-]+$/)
      ]],
      model: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-Z0-9\s-]+$/)
      ]],
      year: [null, [
        Validators.required,
        Validators.min(1900),
        Validators.max(this.currentYear)
      ]],
      licensePlate: ['', [
        Validators.required,
        Validators.pattern(/^[A-Z]{1,3} ?[A-Z0-9]{1,5}(?: [A-Z0-9]{1,5})?$/)
      ]],
      vin: ['', [
        Validators.required,
        Validators.minLength(17),
        Validators.maxLength(17),
        Validators.pattern(/^[A-HJ-NPR-Z0-9]+$/)
      ]],
      engineCapacity: [null, [
        Validators.required,
        Validators.min(0),
        Validators.max(10000)
      ]],
      enginePower: [null, [
        Validators.required,
        Validators.min(0),
        Validators.max(2000)
      ]],
      gearboxType: [null, Validators.required],
      fuelType: [null, Validators.required],
      vehicleType: [null, Validators.required]
    });
  }

  private loadEnumValues(): Observable<EnumResponseType> {
    return this.refreshTrigger$.pipe(
      switchMap(() => forkJoin({
        fuelTypes: this.enumService.getEnumValues(API_CONSTANTS.ENUMS.FUEL_TYPES),
        gearboxTypes: this.enumService.getEnumValues(API_CONSTANTS.ENUMS.GEARBOX_TYPES),
        vehicleTypes: this.enumService.getEnumValues(API_CONSTANTS.ENUMS.VEHICLE_TYPES)
      })),
      map((response): EnumResponseType => ({
        fuelTypes: response.fuelTypes as Enum[],
        gearboxTypes: response.gearboxTypes as Enum[],
        vehicleTypes: response.vehicleTypes as Enum[]
      })),
      catchError(error => {
        console.error('Failed to load enum values', error);
        return of({fuelTypes: [], gearboxTypes: [], vehicleTypes: []});
      })
    );
  }

  private async loadInitialData(): Promise<void> {
    const vehicle = this.vehicle();
    if (!vehicle) return;

    try {
      this.isLoading.set(true);

      const enumData = await firstValueFrom(this.enumData$);
      const formData = this.mapVehicleToForm(vehicle, enumData);
      this.vehicleForm.patchValue(formData);
    } catch (error) {
      this.toastService.showError('Wystąpił błąd podczas ładowania danych');
    } finally {
      this.isLoading.set(false);
    }
  }

  private mapVehicleToForm(vehicle: VehicleType, enumData: EnumResponseType) {
    const selectedVehicleType = enumData.vehicleTypes.find(type => type.value === vehicle.vehicleType);
    const selectedFuelType = enumData.fuelTypes.find(type => type.value === vehicle.fuelType);
    const selectedGearboxType = enumData.gearboxTypes.find(type => type.value === vehicle.gearboxType);

    return {
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      licensePlate: vehicle.licensePlate,
      vin: vehicle.vin,
      engineCapacity: vehicle.engineCapacity,
      enginePower: vehicle.enginePower,
      vehicleType: selectedVehicleType,
      fuelType: selectedFuelType,
      gearboxType: selectedGearboxType
    };
  }

  protected async saveChanges(): Promise<void> {
    if (!this.validateForm())
      return;

    this.isLoading.set(true);

    try {
      const updatedVehicle = this.prepareVehicleData();
      const response = await this.updateVehicle(updatedVehicle);
      this.handleSuccessfulUpdate(response);
    } catch (error) {
      this.handleError();
    } finally {
      this.isLoading.set(false);
    }
  }

  private validateForm(): boolean {
    if (this.vehicleForm.valid)
      return true;

    this.toastService.showWarning('Formularz zawiera błędy. Sprawdź wszystkie pola.');
    return false;
  }

  private prepareVehicleData() {
    const formValue = this.vehicleForm.value;
    return {
      ...this.vehicle(),
      ...formValue,
      gearboxType: formValue.gearboxType?.key ?? 0,
      fuelType: formValue.fuelType?.key ?? 0,
      vehicleType: formValue.vehicleType?.key ?? 0
    };
  }

  private async updateVehicle(vehicleData: any) {
    return firstValueFrom(
      this.vehicleService.update(this.vehicle().id, vehicleData)
    );
  }

  private handleSuccessfulUpdate(response: any): void {
    this.toastService.showSuccess('Pojazd został pomyślnie zaktualizowany');
    this.dialogRef.close(response);

    setTimeout(() => window.location.reload(), 300);
  }

  private handleError(): void {
    this.toastService.showError('Wystąpił błąd podczas aktualizacji pojazdu');
  }

  protected cancelEdit(): void {
    this.dialogRef.close();
  }

  getControlError(controlName: string): string | null {
    return this.formErrorService.getControlError(this.vehicleForm, controlName);
  }

  protected isFieldInvalid(controlName: string): boolean {
    const control = this.vehicleForm.get(controlName);
    return !!control && control.invalid && control.touched;
  }
}
