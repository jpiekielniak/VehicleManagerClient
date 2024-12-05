import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ServiceBookService} from "../../services/serviceBook/service-book.service";
import {CreateService} from "../../types/create-service.type";
import {MaterialImports} from "../../../../../imports/material.imports";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {DividerModule} from "primeng/divider";
import {ButtonDirective} from "primeng/button";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {CalendarModule} from "primeng/calendar";
import {CardModule} from "primeng/card";
import {InputTextareaModule} from "primeng/inputtextarea";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {MessageService, PrimeNGConfig} from "primeng/api";

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
    ...MaterialImports,
    DividerModule,
    ButtonDirective,
    InputNumberModule,
    InputTextModule,
    NgClass,
    CalendarModule,
    CardModule,
    InputTextareaModule
  ],
  templateUrl: './create-service.component.html',
  styleUrl: './create-service.component.css'
})
export class CreateServiceComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private formBuilder = inject(FormBuilder);
  private serviceBookService = inject(ServiceBookService);
  private dialogRef = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private messageService = inject(MessageService);
  private configC = inject(PrimeNGConfig);

  createServiceForm!: FormGroup;
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
    this.configC.setTranslation(this.pl);
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
    this.messageService.add({
      severity: 'error',
      summary: 'Błąd',
      detail: 'Wystąpił błąd podczas zapisywania serwisu'
    });
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.createServiceForm.valid) {
      this.serviceBookService.createService(this.config.data.serviceBookId, this.createServiceForm.value as CreateService)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.dialogRef.close(true);
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
