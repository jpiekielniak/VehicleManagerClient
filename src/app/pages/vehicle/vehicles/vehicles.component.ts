import {Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnDestroy, OnInit} from '@angular/core';
import {FilterComponent} from "../../../shared/components/filter/filter.component";
import {NgClass, NgIf} from "@angular/common";
import {SortConfig, SortingComponent} from "../../../shared/components/sorting/sorting.component";
import {PageChangeEvent, VehicleListComponent} from "./components/vehicle-list/vehicle-list.component";
import {catchError, EMPTY, finalize, Subject, takeUntil} from "rxjs";
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
    LoadingSpinnerComponent,
  ],
  providers: [VehicleDialogService, DialogService, ToastService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.css'
})
export class VehiclesComponent implements OnInit, OnDestroy {
  private readonly vehicleDataService = inject(VehicleDataService);
  private readonly dialogService = inject(VehicleDialogService);
  private readonly loadingService = inject(LoadingService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();
  protected readonly paginationService = inject(PaginationService);

  vehicles: Vehicle[] = [];
  totalItems = 0;
  uniqueBrands: string[] = [];
  sortOptions = VEHICLE_SORT_OPTIONS;
  isComponentLoaded = false;
  isLoading = true;
  isError = false;

  ngOnInit(): void {
    this.loadVehicles();
    this.setupComponentLoadedFlag();
    this.loadingService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.isLoading = loading;
      });

    this.extractUniqueBrands(this.vehicles);
  }

  private loadVehicles(): void {
    this.loadingService.setLoading(true);
    this.vehicleDataService.loadVehicles()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loadingService.setLoading(false)),
        catchError(() => {
          this.toastService.showError('Wystąpił błąd podczas ładowania pojazdów');
          this.isError = true;
          return EMPTY;
        })
      )
      .subscribe(result => {
        this.handleVehiclesResult(result);
      });
  }

  private handleVehiclesResult(result: PaginationResult<Vehicle>) {
    this.vehicles = result.items;
    this.uniqueBrands = this.extractUniqueBrands(result.items);

    this.updatePaginationState(result.totalItemsCount);
  }

  private updatePaginationState(totalItemsCount: number): void {
    this.totalItems = totalItemsCount;
    const currentState = this.paginationService.getCurrentState();

    this.paginationService.updateState({
      totalItems: totalItemsCount,
      pageIndex: currentState.pageIndex,
      pageSize: currentState.pageSize
    });
  }

  applySorting(sortConfig: SortConfig<Vehicle>): void {
    this.vehicleDataService.applySorting(sortConfig)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loadingService.setLoading(false)),
        catchError(() => {
          return EMPTY;
        })
      )
      .subscribe(result => {
        this.handleVehiclesResult(result);
      });
  }

  applyFilter(selectedBrand: string): void {
    if(selectedBrand === 'Wszystkie marki') {
      this.loadVehicles();
      return;
    }

    this.vehicleDataService.applyFilter(selectedBrand)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loadingService.setLoading(false)),
        catchError(() => {
          return EMPTY;
        })
      )
      .subscribe(result => {
        this.handleVehiclesResult(result);

      });
  }

  onPaginatorChange(event: PageChangeEvent): void {
    this.paginationService.updateState({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize
    });

    this.vehicleDataService.changePage(event)
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => {
          return EMPTY;
        })
      )
      .subscribe(result => {
        this.handleVehiclesResult(result);
      });
  }

  openVehicleDialog(): void {
    this.dialogService.openCreateVehicleDialog()
      .pipe(takeUntil(this.destroy$))
      .subscribe(shouldReload => {
        if (shouldReload) this.loadVehicles();
      });
  }

  navigateToDetails(vehicleId: string): void {
    this.router.navigate([`/moje-pojazdy/${vehicleId}`]);
  }

  private extractUniqueBrands(data: Vehicle[]): string[] {
    return [...new Set(data.map(vehicle => vehicle.brand))];
  }

  private setupComponentLoadedFlag(): void {
    setTimeout(() => this.isComponentLoaded = true, 2000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
