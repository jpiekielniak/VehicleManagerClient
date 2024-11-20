import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginatorIntl, PageEvent} from '@angular/material/paginator';
import {finalize, Subject, takeUntil} from 'rxjs';
import {VEHICLE_LIST_CONSTANTS} from '../../constants/vehicle.constants';
import {VehicleService} from '../../services/vehicle/vehicle.service';
import {PaginationService} from '../../services/pagination/pagination.service';
import {MaterialImports,} from '../../imports/material.imports';
import {getPolishPaginatorIntl} from "../../shared/get-polish-paginator.intl";
import {VehicleType} from "../../types/vehicle.type";
import {PaginationResult} from "../../types/pagination.result";
import {MatDialog} from "@angular/material/dialog";
import {CreateVehicleComponent} from "../create-vehicle/create-vehicle.component";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {Router} from "@angular/router";


@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  standalone: true,
  imports: [...MaterialImports],
  providers: [
    {provide: MatPaginatorIntl, useValue: getPolishPaginatorIntl()}
  ],
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly vehicleService = inject(VehicleService);
  protected readonly paginationService = inject(PaginationService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  dataSource = new MatTableDataSource<VehicleType>();
  isLoading = true;
  selectedVehicle: string | null = null;
  hoveredAction: string | null = null;
  displayedColumns =  VEHICLE_LIST_CONSTANTS.COLUMNS.DISPLAYED;

  ngOnInit(): void {
    this.loadVehicles();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPageChange(event: PageEvent): void {
    this.paginationService.updateState({
      pageSize: event.pageSize,
      pageIndex: event.pageIndex
    });

    this.loadVehicles();
  }

  private loadVehicles(): void {
    this.isLoading = true;
    const {pageIndex, pageSize} = this.paginationService.getCurrentState();

    this.vehicleService.getVehicles(pageIndex + 1, pageSize)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: this.handleVehicleResponse.bind(this)
      });
  }

  private handleVehicleResponse(response: PaginationResult<VehicleType>): void {
    this.paginationService.updateState({totalItems: response.totalItemsCount});
    this.dataSource.data = response.items;
    this.animateTable();
  }

  private animateTable(): void {
    setTimeout(() => {
      const table = document.querySelector(`.${VEHICLE_LIST_CONSTANTS.ANIMATION.TABLE_CLASS}`);
      table?.classList.add(VEHICLE_LIST_CONSTANTS.ANIMATION.SHOW_CLASS);
    }, VEHICLE_LIST_CONSTANTS.ANIMATION.DELAY);
  }

  openVehicleDialog() {
    const dialogRef = this.dialog.open(CreateVehicleComponent, {
      width: '800px'
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadVehicles();
    });
  }

  confirmDelete(vehicle: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Potwierdzenie usunięcia',
        message: `Czy na pewno chcesz usunąć pojazd ${vehicle.brand} ${vehicle.model}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteVehicle(vehicle.vehicleId);
      }
    });
  }

  private deleteVehicle(id: number): void {
    this.vehicleService.deleteVehicle(id).subscribe({
      next: this.loadVehicles.bind(this),
      error: (error) => {
        console.error(error);
      }
    });
  }

  navigateToDetails(vehicleId: string) {
    this.router.navigate([`/moje-pojazdy/${vehicleId}`]);
  }
}
