import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginatorIntl, PageEvent} from '@angular/material/paginator';
import {finalize, Subject, takeUntil} from 'rxjs';
import {VehicleService} from '../../services/vehicle/vehicle.service';
import {PaginationService} from '../../services/pagination/pagination.service';
import {getPolishPaginatorIntl} from "../../shared/get-polish-paginator.intl";
import {Vehicle} from "../../types/vehicle.type";
import {CreateVehicleComponent} from "../create-vehicle/create-vehicle.component";
import {Router} from "@angular/router";
import {ConfirmationService, MessageService, } from "primeng/api";
import {TableModule} from "primeng/table";
import {DialogService} from "primeng/dynamicdialog";
import {ToolbarModule} from "primeng/toolbar";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {PaginationResult} from "../../types/pagination-result.type";
import {MatDialog} from "@angular/material/dialog";
import {NgForOf} from "@angular/common";
import {PaginatorModule, PaginatorState} from "primeng/paginator";


@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  standalone: true,
  imports: [TableModule, ToolbarModule, ConfirmDialogModule, NgForOf, PaginatorModule],
  providers: [
    DialogService, ConfirmationService, MessageService,
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

  dataSource = new MatTableDataSource<Vehicle>();
  isLoading = true;
  first =0;
  rows = 5;

  ngOnInit(): void {
    this.loadVehicles();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPageChange(event: PaginatorState): void {
    this.first = event.first!;
    this.rows = event.rows!;
    this.paginationService.updateState({
      pageSize: event.rows,
      pageIndex: event.page
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
        next: this.handleVehicleResponse.bind(this),
        error: (error) => {
          console.error('Błąd podczas ładowania pojazdów:', error);
        }
      });
  }

  private handleVehicleResponse(response: PaginationResult<Vehicle>): void {
    this.paginationService.updateState({totalItems: response.totalItemsCount});
    this.dataSource.data = response.items;
  }

  openVehicleDialog() {
    const dialogRef = this.dialog.open(CreateVehicleComponent, {
      width: '800px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadVehicles();
      }
    });
  }

  private deleteVehicle(id: string): void {
    this.vehicleService.deleteVehicle(id).subscribe({
      next: () => {
        this.loadVehicles();
      },
      error: (error) => {
        console.error('Błąd podczas usuwania pojazdu:', error);
      }
    });
  }

  navigateToDetails(vehicleId: string) {
    this.router.navigate([`/moje-pojazdy/${vehicleId}`]);
  }
}
