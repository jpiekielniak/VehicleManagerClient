import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {AsyncPipe, NgIf} from '@angular/common';
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  forkJoin,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil
} from 'rxjs';
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
import {FormErrorService} from '../../../../../shared/services/form/form-error.service';
import {FormValidatorsService} from '../../../../../shared/services/form/form-validators.service';
import {LoadingSpinnerComponent} from "../../../../../shared/components/loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-vehicle-edit-dialog',
  templateUrl: './vehicle-edit-dialog.component.html',
  styleUrls: ['./vehicle-edit-dialog.component.scss'],
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
    AsyncPipe,
    LoadingSpinnerComponent
  ],
  providers: [ToastService]
})
export class VehicleEditDialogComponent implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly vehicleService = inject(VehicleService);
  private readonly enumService = inject(EnumService);
  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly formErrorService = inject(FormErrorService);
  private readonly formValidators = inject(FormValidatorsService);
  private readonly toastService = inject(ToastService);
  protected readonly config = inject(DynamicDialogConfig);

  private readonly destroy$ = new Subject<void>();
  private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);

  protected readonly isLoading = signal<boolean>(false);
  protected readonly vehicle = signal<VehicleType>(this.config.data.vehicle);
  protected readonly currentYear = new Date().getFullYear();
  protected readonly vehicleForm: FormGroup = this.initializeForm();
  protected readonly enumData$ = this.loadEnumValues();

  ngOnInit(): void {
    this.setupFormValidation();
    this.loadInitialData();
  }

  private setupFormValidation(): void {
    this.vehicleForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.vehicleForm.dirty) {
          requestAnimationFrame(() => {
            this.formValidators.validateForm(
              this.vehicleForm,
              (key) => this.getControlError(key)
            );
          });
        }
      });
  }

  private initializeForm(): FormGroup {
    return this.formBuilder.group({
      brand: ['', this.formValidators.BASIC_TEXT_INPUT_VALIDATORS],
      model: ['', this.formValidators.BASIC_TEXT_INPUT_VALIDATORS],
      year: [null, this.formValidators.YEAR_VALIDATORS],
      licensePlate: ['', this.formValidators.LICENSE_PLATE_VALIDATORS],
      vin: ['', this.formValidators.VIN_VALIDATORS],
      engineCapacity: [null, this.formValidators.ENGINE_CAPACITY_VALIDATORS],
      enginePower: [null, this.formValidators.ENGINE_POWER_VALIDATORS],
      gearboxType: [null, this.formValidators.REQUIRED_VALIDATOR],
      fuelType: [null, this.formValidators.REQUIRED_VALIDATOR],
      vehicleType: [null, this.formValidators.REQUIRED_VALIDATOR]
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
      catchError(() => of({fuelTypes: [], gearboxTypes: [], vehicleTypes: []})),
      takeUntil(this.destroy$)
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
    } catch {
      this.toastService.showError('Wystąpił błąd podczas ładowania danych');
    } finally {
      this.isLoading.set(false);
    }
  }

  private mapVehicleToForm(vehicle: VehicleType, enumData: EnumResponseType) {
    return {
      ...vehicle,
      vehicleType: enumData.vehicleTypes.find(type => type.value === vehicle.vehicleType),
      fuelType: enumData.fuelTypes.find(type => type.value === vehicle.fuelType),
      gearboxType: enumData.gearboxTypes.find(type => type.value === vehicle.gearboxType)
    };
  }

  protected async saveChanges(): Promise<void> {
    if (!this.validateForm()) return;

    try {
      this.isLoading.set(true);
      const updatedVehicle = this.prepareVehicleData();
      await this.updateVehicle(updatedVehicle);
      await this.handleSuccessfulUpdate();
    } catch {
      this.handleError();
    } finally {
      this.isLoading.set(false);
    }
  }

  private validateForm(): boolean {
    if (this.vehicleForm.valid) return true;

    this.toastService.showWarning('Formularz zawiera błędy. Sprawdź wszystkie pola.');
    return false;
  }

  private prepareVehicleData(): VehicleType {
    const formValue = this.vehicleForm.value;
    return {
      ...this.vehicle(),
      ...formValue,
      gearboxType: formValue.gearboxType?.key ?? 0,
      fuelType: formValue.fuelType?.key ?? 0,
      vehicleType: formValue.vehicleType?.key ?? 0
    };
  }

  private async updateVehicle(vehicleData: VehicleType): Promise<void> {
    await firstValueFrom(
      this.vehicleService.update(this.vehicle().id, vehicleData).pipe(
        takeUntil(this.destroy$)
      )
    );
  }

  private async handleSuccessfulUpdate(): Promise<void> {
    this.toastService.showSuccess('Pojazd został pomyślnie zaktualizowany');
    this.dialogRef.close();
    await new Promise(resolve => setTimeout(resolve, 300));
    window.location.reload();
  }

  private handleError(): void {
    this.toastService.showError('Wystąpił błąd podczas aktualizacji pojazdu');
  }

  protected cancelEdit(): void {
    this.dialogRef.close();
  }

  protected getControlError(controlName: string): string | null {
    return this.formErrorService.getControlError(this.vehicleForm, controlName);
  }

  protected isFieldInvalid(controlName: string): boolean {
    return this.formErrorService.isFieldInvalid(this.vehicleForm, controlName);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
