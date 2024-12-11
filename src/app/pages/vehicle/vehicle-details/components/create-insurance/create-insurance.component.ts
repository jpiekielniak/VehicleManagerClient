import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NgIf } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { BehaviorSubject, finalize, Subject, takeUntil } from "rxjs";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';

import { VehicleService } from "../../../services/vehicle/vehicle.service";
import { CreateInsurance } from "../../types/create-insurance.type";
import { FormValidatorsService } from "../../../../../shared/services/form/form-validators.service";
import { FormErrorService } from "../../../../../shared/services/form/form-error.service";
import { ToastService } from '../../../../../shared/services/toast/toast.service';
import {PrimeNGConfig} from "primeng/api";

interface FormState {
  isSubmitting: boolean;
  isValid: boolean;
  dateError: boolean;
}

const INITIAL_STATE: FormState = {
  isSubmitting: false,
  isValid: false,
  dateError: false
};

@Component({
  selector: 'app-create-insurance',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    CardModule,
    DividerModule
  ],
  providers: [ToastService],
  templateUrl: './create-insurance.component.html',
  styleUrl: './create-insurance.component.css'
})
export class CreateInsuranceComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly formState$ = new BehaviorSubject<FormState>(INITIAL_STATE);

  private readonly fb = inject(FormBuilder);
  private readonly vehicleService = inject(VehicleService);
  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);
  private readonly formValidators = inject(FormValidatorsService);
  private readonly formErrorService = inject(FormErrorService);
  private readonly toastService = inject(ToastService);
  private readonly primeConfig = inject(PrimeNGConfig);

  createInsuranceForm: FormGroup = this.initializeForm();
  protected state = INITIAL_STATE;

  readonly minDate = new Date();
  readonly pl = {
    firstDayOfWeek: 1,
    dayNames: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"],
    dayNamesShort: ["Nie", "Pon", "Wt", "Śr", "Czw", "Pt", "Sob"],
    dayNamesMin: ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "Sb"],
    monthNames: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"],
    monthNamesShort: ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"],
    today: "Dziś",
    clear: "Wyczyść",
    dateFormat: "dd.mm.yy"
  };

  ngOnInit(): void {
    this.setupFormListeners();
    this.primeConfig.setTranslation(this.pl);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.formState$.complete();
  }

  private initializeForm(): FormGroup {
    return this.fb.group({
      vehicleId: [this.config.data?.vehicleId],
      title: ['', this.formValidators.TITLE_VALIDATORS],
      provider: ['', this.formValidators.TITLE_VALIDATORS],
      policyNumber: ['', this.formValidators.TITLE_VALIDATORS],
      validFrom: [null, this.formValidators.REQUIRED_VALIDATOR],
      validTo: [null, this.formValidators.REQUIRED_VALIDATOR]
    });
  }

  private setupFormListeners(): void {
    this.createInsuranceForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.validateDates();
        this.updateFormState();
      });

    this.formState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.state = state;
      });
  }

  private validateDates(): void {
    const validFrom = this.createInsuranceForm.get('validFrom')?.value;
    const validTo = this.createInsuranceForm.get('validTo')?.value;

    if (validFrom && validTo) {
      const isValid = new Date(validTo) > new Date(validFrom);
      this.updateFormState(!isValid);
    }
  }

  private updateFormState(dateError = false): void {
    this.formState$.next({
      ...this.formState$.value,
      dateError,
      isValid: this.createInsuranceForm.valid && !dateError
    });
  }

  async onSubmit(): Promise<void> {
    if (!this.createInsuranceForm.valid || this.state.isSubmitting || this.state.dateError) {
      this.createInsuranceForm.markAllAsTouched();
      return;
    }

    this.formState$.next({ ...this.state, isSubmitting: true });

    try {
      await this.vehicleService.createInsurance(
        this.createInsuranceForm.value as CreateInsurance
      )
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => {
            this.formState$.next({ ...this.state, isSubmitting: false });
          })
        )
        .toPromise();

      this.dialogRef.close(true);
      this.toastService.showSuccess('Ubezpieczenie zostało pomyślnie utworzone');
    } catch (error) {
      this.toastService.showError('Wystąpił błąd podczas tworzenia ubezpieczenia');
    }
  }

  getErrorMessage(controlName: string): string | null {
    if (controlName === 'validTo' && this.state.dateError) {
      return 'Data zakończenia musi być późniejsza niż data rozpoczęcia';
    }
    return this.formErrorService.getControlError(this.createInsuranceForm, controlName);
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.createInsuranceForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
