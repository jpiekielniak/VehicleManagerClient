import { Injectable } from '@angular/core';
import {VehicleService} from "./vehicle.service";
import {PaginationService} from "../pagination/pagination.service";
import {LoadingService} from "../loading/loading.service";
import {catchError, Observable, tap, throwError} from "rxjs";
import {PaginationResult} from "../../types/pagination-result.type";
import {Vehicle} from "../../types/vehicle.type";
import {SortConfig} from "../../components/sorting/sorting.component";
import {VehicleFilterService} from "./vehicle-filter.service";
import {VehicleSortService} from "./vehicle-sort.service";
import {PageChangeEvent} from "../../components/paginator/paginator.component";

@Injectable({
  providedIn: 'root'
})
export class VehicleDataService {
  constructor(
    private vehicleService: VehicleService,
    private vehicleFilterService: VehicleFilterService,
    private vehicleSortService: VehicleSortService,
    private paginationService: PaginationService,
    private loadingService: LoadingService
  ) {}

  loadVehicles(): Observable<PaginationResult<Vehicle>> {
    const { pageIndex, pageSize } = this.paginationService.getCurrentState();

    this.loadingService.setLoading(true);

    return this.vehicleService.getVehicles(pageIndex + 1, pageSize).pipe(
      tap(() => this.loadingService.setLoading(false)),
      catchError(error => {
        this.loadingService.setLoading(false);
        return throwError(error);
      })
    );
  }

  applySorting(sortConfig: SortConfig<Vehicle>): Observable<PaginationResult<Vehicle>> {
    return this.vehicleSortService.applySorting(this.vehicleService, sortConfig);
  }

  applyFilter(selectedBrand: string): Observable<PaginationResult<Vehicle>> {
    const { pageIndex, pageSize } = this.paginationService.getCurrentState();
    return this.vehicleFilterService.applyFilter(this.vehicleService, selectedBrand, pageIndex, pageSize);
  }

  changePage(event: PageChangeEvent): Observable<PaginationResult<Vehicle>> {
    this.paginationService.updateState({
      pageSize: event.pageSize!,
      pageIndex: event.pageIndex!
    });

    return this.loadVehicles();
  }
}
