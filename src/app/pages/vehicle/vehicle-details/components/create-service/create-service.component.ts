import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef,} from "@angular/material/dialog";
import {ServiceBookService} from "../../services/serviceBook/service-book.service";
import {CreateService} from "../../types/create-service.type";
import {MaterialImports} from "../../../../../imports/material.imports";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";

export type Cost = {
  title: string,
  amount: number;
}

@Component({
  selector: 'app-create-service',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    CurrencyPipe,
    ...MaterialImports,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker
  ],
  templateUrl: './create-service.component.html',
  styleUrl: './create-service.component.css'
})
export class CreateServiceComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private formBuilder = inject(FormBuilder);
  private serviceBookService = inject(ServiceBookService);
  protected dialogRef = inject(MatDialogRef<CreateServiceComponent>);
  protected readonly data = inject(MAT_DIALOG_DATA) as { serviceBookId: string };

  isError = signal(false);
  createServiceForm!: FormGroup;

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.createServiceForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', Validators.maxLength(500)],
      date: [null, [Validators.required]],
      costs: this.formBuilder.array([])
    });
  }

  handleError(): void {
    this.isError.set(true);
    setTimeout(() => {
      this.isError.set(false);
    }, 3000);
  }

  onSubmit() {
    if (this.createServiceForm.valid) {
      this.serviceBookService.createService(this.data.serviceBookId, this.createServiceForm.value as CreateService)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.dialogRef.close(true)
            window.location.reload();
          },
          error: this.handleError.bind(this)
        });
    }
  }

  get costs(): FormArray {
    return this.createServiceForm.get('costs') as FormArray;
  }

  get totalCost(): number {
    return this.costs.controls.reduce((sum, cost) =>
      sum + (cost.get('amount')?.value || 0), 0
    );
  }

  addCost(): void {
    const costGroup = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      amount: [null, [Validators.required, Validators.min(0), Validators.max(1000000)]]
    });
    this.costs.push(costGroup);
  }

  removeCost(index: number): void {
    this.costs.removeAt(index);
  }

  validateControl(controlName: string, errorType: string): boolean {
    const control = this.createServiceForm.get(controlName);
    return control ? control.hasError(errorType) && control.touched : false;
  }

  validateCostControl(index: number, controlName: string, errorType: string): boolean {
    const costControl = this.costs.at(index).get(controlName);
    return costControl ? costControl.hasError(errorType) && costControl.touched : false;
  }
}
