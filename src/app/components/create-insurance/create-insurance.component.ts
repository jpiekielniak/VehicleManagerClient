import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {AlertComponent} from "@coreui/angular";
import {MatButton} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatError, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators} from "@angular/forms";
import { Subject, takeUntil} from "rxjs";
import {VehicleService} from "../../services/vehicle/vehicle.service";
import {
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {CreateInsurance} from "../../types/create-insurance.type";
import {MaterialImports} from "../../imports/material.imports";

@Component({
  selector: 'app-create-insurance',
  standalone: true,
  imports: [
    AlertComponent,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    ...MaterialImports,
    MatError,
    MatInput,
    MatLabel,
    NgIf,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './create-insurance.component.html',
  styleUrl: './create-insurance.component.css'
})
export class CreateInsuranceComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private formBuilder = inject(FormBuilder);
  private vehicleService = inject(VehicleService);
  protected dialogRef = inject(MatDialogRef<CreateInsuranceComponent>);
  protected readonly data = inject(MAT_DIALOG_DATA) as { vehicleId: string };

  isError = signal(false);
  createInsuranceForm!: FormGroup;

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.createInsuranceForm = this.formBuilder.group({
      vehicleId: [this.data],
      title: ['', [Validators.required, Validators.maxLength(50)]],
      provider: ['', [Validators.required, Validators.maxLength(50)]],
      policyNumber: ['', [Validators.required, Validators.maxLength(50)]],
      validFrom: ['', [Validators.required]],
      validTo: ['', [Validators.required]],
    }, { validators: [this.validToLaterThanValidFromValidator()] });
  }

  private validToLaterThanValidFromValidator(): ValidatorFn {
    return (group: AbstractControl): { [key: string]: any } | null => {
      const validFrom = group.get('validFrom')?.value;
      const validTo = group.get('validTo')?.value;

      if (validFrom && validTo) {
        const validFromDate = new Date(validFrom);
        const validToDate = new Date(validTo);

        if (validToDate <= validFromDate) {
          return {'validToEarlierThanValidFrom': true};
        }
      }
      return null;
    };
  }


  handleError(): void {
    this.isError.set(true);
    setTimeout(() => {
      this.isError.set(false);
    }, 3000);
  }

  onSubmit() {
    if (this.createInsuranceForm.valid) {

      this.vehicleService.createInsurance(this.createInsuranceForm.value as CreateInsurance)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: this.dialogRef.close.bind(this.dialogRef),
          error: this.handleError.bind(this)
        });
    }
  }
}
