import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {ServiceBookService} from "../../services/serviceBook/service-book.service";
import {CreateInspection} from "../../types/create-inspection.type";
import {Enum} from "../../../../../shared/types/enum.type";
import {EnumService} from "../../../../../shared/services/enum/enum.service";
import {API_CONSTANTS} from "../../../../../constants/api.constants";
import {FormValidatorsService} from '../../../../../shared/services/form/form-validators.service';
import {NgIf} from "@angular/common";
import {CalendarModule} from "primeng/calendar";
import {InputTextModule} from "primeng/inputtext";
import {DividerModule} from "primeng/divider";
import {DropdownModule} from "primeng/dropdown";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ButtonModule} from "primeng/button";
import {ToastService} from "../../../../../shared/services/toast/toast.service";
import {FormErrorService} from "../../../../../shared/services/form/form-error.service";
import {CardModule} from "primeng/card";
import {PrimeNGConfig} from "primeng/api";

@Component({
  selector: 'app-create-inspection',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CalendarModule,
    InputTextModule,
    DividerModule,
    DropdownModule,
    ButtonModule,
    NgIf,
    CardModule
  ],
  providers: [ToastService],
  templateUrl: './create-inspection.component.html',
  styleUrl: './create-inspection.component.css'
})
export class CreateInspectionComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly formBuilder = inject(FormBuilder);
  private readonly serviceBookService = inject(ServiceBookService);
  private readonly formValidators = inject(FormValidatorsService);
  private readonly enumService = inject(EnumService);
  private readonly toastService = inject(ToastService);
  private readonly formErrorService = inject(FormErrorService);
  protected readonly dialogRef = inject(DynamicDialogRef);
  protected readonly config = inject(DynamicDialogConfig);
  private configC = inject(PrimeNGConfig);


  protected readonly isLoading = signal<boolean>(false);
  protected createInspectionForm!: FormGroup;
  protected inspectionTypes: Enum[] = [];
  pl = {
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
    this.initializeForm();
    this.loadEnumValues();
    this.configC.setTranslation(this.pl);
  }

  private initializeForm(): void {
    this.createInspectionForm = this.formBuilder.group({
      title: ['', this.formValidators.TITLE_VALIDATORS],
      scheduledDate: [null, this.formValidators.REQUIRED_VALIDATOR],
      performDate: [null, this.formValidators.DATE_VALIDATORS],
      inspectionType: [null, this.formValidators.REQUIRED_VALIDATOR],
    });
  }

  private async loadEnumValues(): Promise<void> {
    try {
      const response = await this.enumService.getEnumValues(API_CONSTANTS.ENUMS.INSPECTION_TYPES)
        .pipe(takeUntil(this.destroy$))
        .toPromise();

      if (response) {
        this.inspectionTypes = response;
      }
    } catch {
      this.handleError('Błąd podczas ładowania typów przeglądów');
    }
  }

  protected async onSubmit(): Promise<void> {
    if (this.createInspectionForm.valid) {
      try {
        this.isLoading.set(true);
        const formValue = this.prepareFormData();

        await this.serviceBookService.createInspection(
          this.config.data.serviceBookId,
          formValue
        )
          .pipe(takeUntil(this.destroy$))
          .toPromise();

        this.handleSuccess();
      } catch {
        this.handleError('Błąd podczas tworzenia przeglądu');
      } finally {
        this.isLoading.set(false);
      }
    }
  }

  private prepareFormData(): CreateInspection {
    const formValue = this.createInspectionForm.value;
    return {
      ...formValue,
      inspectionType: formValue.inspectionType?.key ?? 0
    };
  }

  private handleSuccess(): void {
    this.toastService.showSuccess('Przegląd został pomyślnie utworzony');
    this.dialogRef.close(true);
  }

  private handleError(message: string): void {
    this.toastService.showError(message);
  }

  getControlError(controlName: string): string | null {
    return this.formErrorService.getControlError(this.createInspectionForm, controlName);
  }

  isFieldInvalid(controlName: string): boolean {
    return this.formErrorService.isFieldInvalid(this.createInspectionForm, controlName);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
