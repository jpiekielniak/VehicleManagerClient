import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, debounceTime, distinctUntilChanged, finalize, Subject, takeUntil} from "rxjs";
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ServiceBookService} from "../../services/serviceBook/service-book.service";
import {CreateService} from "../../types/create-service.type";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {DividerModule} from "primeng/divider";
import {ButtonDirective} from "primeng/button";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {CalendarModule} from "primeng/calendar";
import {CardModule} from "primeng/card";
import {InputTextareaModule} from "primeng/inputtextarea";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {PrimeNGConfig} from "primeng/api";
import {FormValidatorsService} from "../../../../../shared/services/form/form-validators.service";
import {FormErrorService} from "../../../../../shared/services/form/form-error.service";
import {ToastService} from '../../../../../shared/services/toast/toast.service';

export interface Cost {
  title: string;
  amount: number;
}

interface FormState {
  isSubmitting: boolean;
  totalCost: number;
  isValid: boolean;
}

const INITIAL_FORM_STATE: FormState = {
  isSubmitting: false,
  totalCost: 0,
  isValid: false
};

@Component({
  selector: 'app-create-service',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    DividerModule,
    ButtonDirective,
    InputNumberModule,
    InputTextModule,
    NgClass,
    CalendarModule,
    CardModule,
    InputTextareaModule,
    AsyncPipe
  ],
  providers: [ToastService],
  templateUrl: './create-service.component.html',
  styleUrl: './create-service.component.css'
})
export class CreateServiceComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  protected readonly formState$ = new BehaviorSubject<FormState>(INITIAL_FORM_STATE);
  private readonly formChangeSubject$ = new Subject<void>();

  private readonly fb = inject(FormBuilder);
  private readonly serviceBookService = inject(ServiceBookService);
  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);
  private readonly primeConfig = inject(PrimeNGConfig);
  private readonly formValidators = inject(FormValidatorsService);
  private readonly formErrorService = inject(FormErrorService);
  private readonly toastService = inject(ToastService);

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

  createServiceForm!: FormGroup;

  ngOnInit(): void {
    this.initializeForm();
    this.setupFormListeners();
    this.primeConfig.setTranslation(this.pl);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.formState$.complete();
    this.formChangeSubject$.complete();
  }

  private initializeForm(): void {
    this.createServiceForm = this.fb.group({
      title: ['', this.formValidators.TITLE_VALIDATORS],
      description: ['', this.formValidators.DESCRIPTION_VALIDATORS],
      date: [null, this.formValidators.REQUIRED_VALIDATOR],
      costs: this.fb.array([])
    });
  }

  private setupFormListeners(): void {
    this.createServiceForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.formChangeSubject$.next());

    this.formChangeSubject$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateFormState();
      });

    this.costs.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) =>
          JSON.stringify(prev) === JSON.stringify(curr)
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.updateTotalCost();
      });
  }

  private updateFormState(): void {
    this.formState$.next({
      ...this.formState$.value,
      isValid: this.createServiceForm.valid,
      totalCost: this.calculateTotalCost()
    });
  }

  private calculateTotalCost(): number {
    return this.costs.controls.reduce((sum, control) =>
      sum + (control.get('amount')?.value || 0), 0
    );
  }

  private updateTotalCost(): void {
    const totalCost = this.calculateTotalCost();
    this.formState$.next({
      ...this.formState$.value,
      totalCost
    });
  }

  async onSubmit(): Promise<void> {
    if (!this.createServiceForm.valid || this.formState$.value.isSubmitting) {
      return;
    }

    this.formState$.next({...this.formState$.value, isSubmitting: true});

    try {
      await this.serviceBookService.createService(
        this.config.data.serviceBookId,
        this.createServiceForm.value as CreateService
      ).pipe(
        finalize(() => {
          this.formState$.next({...this.formState$.value, isSubmitting: false});
        }),
        takeUntil(this.destroy$)
      ).toPromise();

      this.dialogRef.close(true);
      this.toastService.showSuccess('Serwis został pomyślnie utworzony');
    } catch (error) {
      this.toastService.showError('Wystąpił błąd podczas zapisywania serwisu');
    }
  }

  get costs(): FormArray {
    return this.createServiceForm.get('costs') as FormArray;
  }

  addCost() {
    const costForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      amount: [null, [Validators.required, Validators.min(0.01)]]
    });

    costForm.markAsTouched();
    costForm.markAsDirty();

    this.costs.push(costForm);
  }

  removeCost(index: number): void {
    this.costs.removeAt(index);
    this.formChangeSubject$.next();
  }

  formatCurrency(value: number): string {
    return value
      ? new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value)
      : '0,00 PLN';
  }

  validateCostControl(index: number, controlName: string, errorType: string): boolean {
    const costControl = this.costs.at(index).get(controlName);
    return !!costControl?.hasError(errorType) && costControl.touched;
  }

  getControlError(controlName: string): string | null {
    return this.formErrorService.getControlError(this.createServiceForm, controlName);
  }

  isFieldInvalid(controlName: string): boolean {
    return this.formErrorService.isFieldInvalid(this.createServiceForm, controlName);
  }

  isFormValid(): boolean {
    return this.createServiceForm.valid;
  }

  close(): void {
    this.dialogRef.close();
  }

  get isSubmitting(): boolean {
    return this.formState$.value.isSubmitting;
  }
}
