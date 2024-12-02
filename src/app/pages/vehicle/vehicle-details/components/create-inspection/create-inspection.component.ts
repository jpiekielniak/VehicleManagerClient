import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatError, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgForOf, NgIf} from "@angular/common";
import {Subject, takeUntil} from "rxjs";
import {ServiceBookService} from "../../services/serviceBook/service-book.service";
import {CreateInspection} from "../../types/create-inspection.type";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {Enum} from "../../../../../shared/types/enum.type";
import {EnumService} from "../../../../../shared/services/enum/enum.service";
import {API_CONSTANTS} from "../../../../../constants/api.constants";
import {MaterialImports} from "../../../../../imports/material.imports";

@Component({
  selector: 'app-create-inspection',
  standalone: true,
  imports: [
    ...MaterialImports,
    FormsModule,
    MatButton,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatError,
    MatInput,
    MatLabel,
    NgIf,
    ReactiveFormsModule,
    MatSuffix,
    MatOption,
    MatSelect,
    NgForOf
  ],
  templateUrl: './create-inspection.component.html',
  styleUrl: './create-inspection.component.css'
})
export class CreateInspectionComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private formBuilder = inject(FormBuilder);
  private serviceBookService = inject(ServiceBookService);
  protected dialogRef = inject(MatDialogRef<CreateInspectionComponent>);
  protected readonly data = inject(MAT_DIALOG_DATA) as { serviceBookId: string };
  private readonly enumService = inject(EnumService);

  isError = signal(false);
  createInspectionForm!: FormGroup;
  inspectionTypes: Enum[] = [];

  ngOnInit(): void {
    this.initializeForm();
    this.loadEnumValues();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadEnumValues() {
    this.enumService.getEnumValues(API_CONSTANTS.ENUMS.INSPECTION_TYPES)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Enum[]) => {
          this.inspectionTypes = response;
        },
        error: this.handleError.bind(this)
      });
  }

  private initializeForm(): void {
    this.createInspectionForm = this.formBuilder.group({
      title: [''],
      scheduledDate: [null, [Validators.required]],
      performDate: [null, [Validators.required, Validators.max(new Date().getDate())]],
      inspectionType: [null, [Validators.required]],
    });
  }


  handleError(): void {
    this.isError.set(true);
    setTimeout(() => {
      this.isError.set(false);
    }, 3000);
  }

  onSubmit() {
    if (this.createInspectionForm.valid) {

      this.serviceBookService.createInspection(this.data.serviceBookId, this.createInspectionForm.value as CreateInspection)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.dialogRef.close.bind(this.dialogRef);
            window.location.reload();
          },
          error: this.handleError.bind(this)
        });
    }
  }
}
