import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {EnumService} from "../../../../../shared/services/enum/enum.service";
import {API_CONSTANTS} from "../../../../../constants/api.constants";
import {VehicleService} from "../../../services/vehicle/vehicle.service";
import {CreateVehicle} from "../../types/create-vehicle.type";
import {
  BehaviorSubject,
  catchError, EMPTY,
  firstValueFrom,
  forkJoin,
  map,
  Observable,
  Subject,
  switchMap,
  takeUntil
} from "rxjs";
import {InputTextModule} from "primeng/inputtext";
import {InputNumberModule} from "primeng/inputnumber";
import {DropdownModule} from "primeng/dropdown";
import {ButtonModule} from "primeng/button";
import {ToastService} from "../../../../../shared/services/toast/toast.service";
import {DialogModule} from "primeng/dialog";
import {AsyncPipe, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {DynamicDialogRef} from "primeng/dynamicdialog";
import {EnumResponseType} from "../../../vehicle-details/types/enum.response.type";
import {Enum} from "../../../../../shared/types/enum.type";
import {FormErrorService} from "../../../../../shared/services/form/form-error.service";
import {CardModule} from "primeng/card";
import {ProgressSpinnerModule} from "primeng/progressspinner";

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
    NgIf,
    CardModule,
    AsyncPipe,
    ProgressSpinnerModule
  ],
  providers: [ToastService],
  templateUrl: './create-vehicle.component.html',
  styleUrls: ['./create-vehicle.component.css']
})
export class CreateVehicleComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly formBuilder = inject(FormBuilder);
  private readonly enumService = inject(EnumService);
  private readonly vehicleService = inject(VehicleService);
  private readonly toastService = inject(ToastService);
  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly router = inject(Router);
  private readonly formErrorService = inject(FormErrorService);
  private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);

  protected readonly isLoading = signal(false);
  protected readonly currentYear = new Date().getFullYear();
  protected readonly createVehicleForm = this.initializeForm();
  protected readonly enumData$ = this.loadEnumValues();

  ngOnInit(): void {
    this.initializeForm();
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
      map(response => ({
        fuelTypes: response.fuelTypes as Enum[],
        gearboxTypes: response.gearboxTypes as Enum[],
        vehicleTypes: response.vehicleTypes as Enum[]
      })),
      catchError(error => {
        this.handleError('Nie udało się załadować danych formularza');
        return EMPTY;
      })
    );
  }

  protected async onSubmit(): Promise<void> {
    if (!this.validateForm()) return;

    this.isLoading.set(true);
    try {
      await firstValueFrom(
        this.vehicleService.createVehicle(this.createVehicleForm.value as CreateVehicle)
          .pipe(takeUntil(this.destroy$))
      );
      this.handleSuccess();
    } catch (error) {
      this.handleError('Nie udało się dodać pojazdu');
    } finally {
      this.isLoading.set(false);
    }
  }

  private validateForm(): boolean {
    if (this.createVehicleForm.valid)
      return true;

    this.toastService.showWarning('Formularz zawiera błędy');
    return false;
  }

  private handleSuccess(): void {
    this.toastService.showSuccess('Pojazd został pomyślnie dodany');
    this.dialogRef.close(true);
    this.router.navigate(['/moje-pojazdy']);
  }

  private handleError(message: string): void {
    this.toastService.showError(message);

    if (message.includes('formularza')) {
      this.dialogRef.close(false);
    }
  }

  protected onCancel(): void {
    this.dialogRef.close(false);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getControlError(licensePlate: string) {
    return this.formErrorService.getControlError(this.createVehicleForm, licensePlate);
  }

  protected isFieldInvalid(controlName: string): boolean {
    const control = this.createVehicleForm.get(controlName);
    return !!control && control.invalid && control.touched;
  }
}
