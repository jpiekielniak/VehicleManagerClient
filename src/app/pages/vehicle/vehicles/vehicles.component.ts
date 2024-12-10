import {Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnDestroy, OnInit} from '@angular/core';
import {FilterComponent} from "../../../shared/components/filter/filter.component";
import {NgClass, NgIf} from "@angular/common";
import {SortConfig, SortingComponent} from "../../../shared/components/sorting/sorting.component";
import {PageChangeEvent, VehicleListComponent} from "./components/vehicle-list/vehicle-list.component";
import {catchError, EMPTY, firstValueFrom, Subject, takeUntil} from "rxjs";
import {Vehicle} from "./types/vehicle.type";
import {PaginationComponent} from "../../../shared/components/pagination/pagination.component";
import {ButtonDirective} from "primeng/button";
import {Ripple} from "primeng/ripple";
import {Router} from "@angular/router";
import {VehicleDataService} from "../services/vehicle/data/vehicle-data.service";
import {PaginationService} from "../../../shared/services/pagination/pagination.service";
import {PaginationResult} from "../../../shared/components/pagination/types/pagination-result.type";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {LoadingService} from "../../../shared/services/loading/loading.service";
import {LoadingSpinnerComponent} from "../../../shared/components/loading-spinner/loading-spinner.component";
import {VehicleDialogService} from "../services/dialogs/vehicle/vehicle-dialog.service";
import {DialogService} from "primeng/dynamicdialog";
import {ToastService} from "../../../shared/services/toast/toast.service";

const VEHICLE_SORT_OPTIONS: { label: string, value: keyof Vehicle }[] = [
  {label: 'Marka', value: 'brand'},
  {label: 'Model', value: 'model'}
];

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [
    FilterComponent,
    NgIf,
    SortingComponent,
    VehicleListComponent,
    PaginationComponent,
    ButtonDirective,
    Ripple,
    NgClass,
    ProgressSpinnerModule,
    LoadingSpinnerComponent
  ],
  providers: [VehicleDialogService, DialogService, ToastService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.css'
})
export class VehiclesComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly vehicleDataService = inject(VehicleDataService);
  private readonly dialogService = inject(VehicleDialogService);
  private readonly loadingService = inject(LoadingService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  protected readonly paginationService = inject(PaginationService);

  readonly sortOptions = VEHICLE_SORT_OPTIONS;
  vehicles: Vehicle[] = [];
  totalItems = 0;
  uniqueBrands: string[] = [];
  isComponentLoaded = false;
  isLoading = true;

  ngOnInit(): void {
     this.initializeComponent();
     this.loadVehicles();
  }

  private async initializeComponent(): Promise<void> {
    this.loadingService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => this.isLoading = loading);

    await new Promise(resolve => setTimeout(resolve, 2000));
    this.isComponentLoaded = true;
  }

  private async loadVehicles(): Promise<void> {
    try {
      const result = await firstValueFrom(
        this.vehicleDataService.loadVehicles().pipe(
          takeUntil(this.destroy$)
        )
      );
      this.updateState(result);
      this.toastService.showSuccess('Pojazdy zostały załadowane pomyślnie');
    } catch {
      this.toastService.showError('Wystąpił błąd podczas ładowania pojazdów');
    }
  }

  async applySorting(sortConfig: SortConfig<Vehicle>): Promise<void> {
    try {
      const result = await firstValueFrom(
        this.vehicleDataService.applySorting(sortConfig).pipe(
          takeUntil(this.destroy$)
        )
      );
      this.updateState(result);
    } catch {
      this.toastService.showError('Wystąpił błąd podczas sortowania pojazdów');
    }
  }

  async applyFilter(brand: string): Promise<void> {
    if (brand === 'Wszystkie marki') {
      await this.loadVehicles();
      return;
    }

    try {
      const result = await firstValueFrom(
        this.vehicleDataService.applyFilter(brand).pipe(
          takeUntil(this.destroy$)
        )
      );
      this.updateState(result);
    } catch {
      this.toastService.showError('Wystąpił błąd podczas filtrowania pojazdów');
    }
  }

  async onPaginatorChange(event: PageChangeEvent): Promise<void> {
    try {
      const result = await firstValueFrom(
        this.vehicleDataService.changePage(event).pipe(
          takeUntil(this.destroy$)
        )
      );
      this.updateState(result);
    } catch {
      this.toastService.showError('Wystąpił błąd podczas zmiany strony');
    }
  }

  private updateState(result: PaginationResult<Vehicle>): void {
    this.vehicles = result.items;
    this.uniqueBrands = [...new Set(result.items.map(v => v.brand))];
    this.totalItems = result.totalItemsCount;
  }

  async openVehicleDialog(): Promise<void> {
    try {
      const result = await firstValueFrom(
        this.dialogService.openCreateVehicleDialog()
      );

      if (result) {
        await this.loadVehicles();
      }
    } catch {
      this.toastService.showError('Wystąpił błąd podczas otwierania okna dialogowego');
    }
  }

  async navigateToDetails(vehicleId: string): Promise<void> {
    await this.router.navigate([`/moje-pojazdy/${vehicleId}`]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
